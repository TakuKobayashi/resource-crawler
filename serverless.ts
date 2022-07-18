import type { AWS } from '@serverless/typescript';

import { config } from 'dotenv';
const configedEnv = config();

const serverlessConfiguration: AWS = {
  service: 'resource-crawler-api',
  frameworkVersion: '3',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dotenv: {
      path: './.env',
      include: Object.keys(configedEnv.parsed),
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        migrate: true,
        // inMemory: truemにすることでメモリ上で実行する事でデータを永続化しません。
        inMemory: true,
        // すでにlocalでDynamodbが起動している状態ならば
        // noStart: true と指定することで serverless offline startでdynamodbも一緒に立ち上がるようなことはありません
        //noStart: true
      },
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    timeout: 900,
    memorySize: 128,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            'dynamodb:*',
          ],
          Resource: [
            // 'arn:aws:dynamodb:[region名]:[accountid]:table/[テーブル名]'
            'arn:aws:dynamodb:*:*:table/resources'
          ],
        }],
      },
    },
  },
  resources: {
    Resources: {
      resourcesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'resources',
          AttributeDefinitions: [
            {
              AttributeName: 'url',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'url',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    },
  },
  functions: {
    api: {
      handler: 'src/api/index.handler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
            cors: true,
          },
        },
        {
          http: {
            method: 'ANY',
            path: '/{any+}',
            cors: true,
          },
        },
      ],
    },
    crons: {
      handler: 'src/schedulers/index.event',
      events: [
        {
          schedule: {
            rate: ['rate(1 minute)'],
            enabled: false,
            input: {
              key1: 'value1',
              key2: 'value2',
              stageParams: {
                stage: 'dev',
              },
            },
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
