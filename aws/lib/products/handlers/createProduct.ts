import * as yup from "yup";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { ProductsService } from "../products.service.ts";
import { corsHeaders, logRequestArguments } from "./helpers.ts";

const productCreateSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  price: yup.number().min(0),
  count: yup.number().min(0).integer(),
});

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event) => {
  logRequestArguments(event);
  try {
    const product = await productCreateSchema.validate(JSON.parse(event.body));

    const productsService = new ProductsService();

    const createdProduct = await productsService.createProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      count: product.count,
    });

    return {
      statusCode: 201,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createdProduct),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Product is not valid",
          details: error.errors,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
