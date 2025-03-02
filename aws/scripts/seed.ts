import { randomUUID } from "node:crypto";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { ProductDto } from "../lib/products/products.type.ts";

const dynamoClient = new DynamoDBClient();
const PRODUCTS_TABLE = "products";
const STOCKS_TABLE = "stocks";

const mockProducts: ProductDto[] = [
  {
    id: randomUUID(),
    title: "Apple",
    description: "Apple from Poland",
    price: 1.5,
    count: 199,
  },
  {
    id: randomUUID(),
    title: "Pineapple",
    description: "Apple from Africa",
    price: 2.7,
    count: 120,
  },
  {
    id: randomUUID(),
    title: "Avocado",
    description: "Green avocado",
    price: 4.1,
    count: 49,
  },
  {
    id: randomUUID(),
    title: "Banana",
    description: "Big banana",
    price: 0.9,
    count: 137,
  },
];

async function seedProductsTable() {
  console.log("Start batch seeding of products...");
  try {
    const products = mockProducts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    }));

    const stocks = mockProducts.map((product) => ({
      product_id: product.id,
      count: product.count,
    }));

    await dynamoClient.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [PRODUCTS_TABLE]: products.map((product) => ({
            PutRequest: {
              Item: marshall(product),
            },
          })),
          [STOCKS_TABLE]: stocks.map((stock) => ({
            PutRequest: {
              Item: marshall(stock),
            },
          })),
        },
      })
    );

    console.log("Batch seeding of products completed successfully!");
  } catch (error) {
    console.error("Error batch seeding products:", error);
  }
}

seedProductsTable();
