import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "todo-serverless",
  frameworkVersion: "3",

  plugins: ["serverless-esbuild"],

  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "sa-east-1",
    profile: "serverlessUser",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TODOS_TABLE: "Todos-${self:provider.stage}",
    },

    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
        ],
        Resource: [
          { "Fn::GetAtt": ["TodosDynamoDBTable", "Arn"] },
          "arn:aws:s3:::serverless-s3-operations-bucket-gui",
        ],
      },
    ],
  },

  // import the function via paths
  functions: {
    // Create
    createTodos: {
      name: "create-todo",
      handler: "src/lambda/http/createTodos.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "todos",
          },
        },
      ],
    },

    // Read
    getTodos: {
      name: "get-todos",
      handler: "src/lambda/http/getTodos.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "todos",
          },
        },
      ],
    },

    // Update
    updateTodos: {
      name: "update-todos",
      handler: "src/lambda/http/updateTodos.handler",
      events: [
        {
          http: {
            method: "PATCH",
            path: "todos/{id}",
          },
        },
      ],
    },

    // Delete
    deleteTodos: {
      name: "delete-todos",
      handler: "src/lambda/http/deleteTodos.handler",
      events: [
        {
          http: {
            method: "DELETE",
            path: "todos/{id}",
          },
        },
      ],
    },

    // Delete
    imageUpload: {
      name: "image-upload",
      handler: "src/lambda/imageUpload.handler",
      events: [
        {
          http: {
            method: "PUT",
            path: "image-upload",
          },
        },
      ],
    },
  },

  package: { individually: true },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      TodosDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.TODOS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },

      S3OperationsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "serverless-s3-operations-bucket-gui",
          AccessControl: "Private",
          CorsConfiguration: {
            AllowedMethods: ["GET", "PUT", "POST"],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
