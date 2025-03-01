import * as path from "node:path";
import * as url from "node:url";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

const handlersPath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "handlers"
);

export class ProductsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable = cdk.aws_dynamodb.Table.fromTableName(
      this,
      "ProductsTable",
      "products"
    );

    const stocksTable = cdk.aws_dynamodb.Table.fromTableName(
      this,
      "StocksTable",
      "stocks"
    );

    const getProductsListFunction = new NodejsFunction(
      this,
      "GetProductsListFunction",
      {
        entry: path.join(handlersPath, "getProductsList.ts"),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_22_X,
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    const getProductByIdFunction = new NodejsFunction(
      this,
      "GetProductByIdFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(handlersPath, "getProductById.ts"),
        handler: "handler",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    const createProductFunction = new NodejsFunction(
      this,
      "CreateProductFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(handlersPath, "createProduct.ts"),
        handler: "handler",
        timeout: cdk.Duration.seconds(30),
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      }
    );

    productsTable.grantReadData(getProductsListFunction);
    stocksTable.grantReadData(getProductsListFunction);
    productsTable.grantReadData(getProductByIdFunction);
    stocksTable.grantReadData(getProductByIdFunction);
    productsTable.grantReadWriteData(createProductFunction);
    stocksTable.grantReadWriteData(createProductFunction);

    const productsApi = new apigateway.RestApi(this, "ProductsApi", {
      restApiName: "Products Api",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["https://d2rcjsjs5l9fv3.cloudfront.net"],
      },
    });

    const products = productsApi.root.addResource("products");
    products.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductsListFunction)
    );
    products.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createProductFunction)
    );

    const product = products.addResource("{productId}");
    product.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductByIdFunction)
    );

    new cdk.CfnOutput(this, "ProductsApiUrl", {
      value: productsApi.url,
      description: "Products API Gateway URL",
    });
  }
}
