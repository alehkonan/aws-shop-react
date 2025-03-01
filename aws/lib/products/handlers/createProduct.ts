import * as yup from "yup";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { ProductsService } from "../products.service.ts";
import { corsHeaders, logRequestArguments } from "./helpers.ts";

const productCreateSchema = yup.object({
  title: yup.string().required().trim().min(0),
  description: yup.string().required().trim().min(0),
  price: yup.number().required().positive(),
  count: yup.number().integer().required().min(0),
});

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event) => {
  logRequestArguments(event);
  try {
    const product = await productCreateSchema.validate(JSON.parse(event.body), {
      abortEarly: false,
    });

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
