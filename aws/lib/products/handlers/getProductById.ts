import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { ProductsService } from "../products.service.ts";

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async ({ pathParameters }) => {
  try {
    const productId = pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Product id was not provided" }),
      };
    }

    const productsService = new ProductsService();
    const product = await productsService.getProductById(productId);

    if (!product) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Product with id: ${productId} was not found`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
