import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { ProductsService } from "../products.service.ts";

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async () => {
  try {
    const productsService = new ProductsService();
    const products = await productsService.getAllProducts();

    if (!products) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Products were not found`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
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
