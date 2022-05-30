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
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  resources: {
    Resources: {
      usersTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "resources",
          AttributeDefinitions: {
            AttributeName: "url",
            AttributeType: "S",
          },
          KeySchema: {
            AttributeName: "url",
            KeyType: "HASH",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          }
        }
      }
    }
  },
  functions: {
    memorySize: 128,
    timeout: 900,
    app: {
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
  },
}

module.exports = serverlessConfiguration;
