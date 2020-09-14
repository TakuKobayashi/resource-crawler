import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'resource-crawler-api',
  },
  frameworkVersion: '>=1.72.0',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    dotenv: {
      path: './.env',
      include: [
        'TWITTER_CONSUMER_KEY',
        'TWITTER_CONSUMER_SECRET',
        'TWITTER_BOT_ACCESS_TOKEN',
        'TWITTER_BOT_ACCESS_TOKEN_SECRET',
        'GOOGLE_API_KEY',
        'GOOGLE_OAUTH_CLIENT_ID',
        'GOOGLE_OAUTH_CLIENT_SECRET',
        'FLICKR_APIKEY',
        'FLICKR_SECRET',
      ],
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
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
    app: {
      handler: 'src/app.handler',
      memorySize: 128,
      timeout: 900,
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          http: {
            method: 'ANY',
            path: '/{proxy+}',
          },
        },
      ],
    },
  },
}

module.exports = serverlessConfiguration;
