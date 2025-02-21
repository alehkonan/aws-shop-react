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

    const getProductsListFunction = new NodejsFunction(
      this,
      "GetProductsListFunction",
      {
        entry: path.join(handlersPath, "getProductsList.ts"),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    const getProductByIdFunction = new NodejsFunction(
      this,
      "GetProductByIdFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(handlersPath, "getProductById.ts"),
        handler: "handler",
      }
    );

    const productsApi = new apigateway.RestApi(this, "ProductsApi", {
      restApiName: "Products Api",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const products = productsApi.root.addResource("products");
    products.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductsListFunction)
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
