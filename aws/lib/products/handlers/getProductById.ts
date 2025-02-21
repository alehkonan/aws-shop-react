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
        statusCode: 404,
        body: JSON.stringify({
          message: `Product with id: ${productId} was not found`,
        }),
      };
    }

    const productsService = new ProductsService();
    const product = await productsService.getProductById(productId);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
