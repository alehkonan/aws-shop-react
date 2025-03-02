import { randomUUID } from "node:crypto";
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ProductDto, CreateProductDto } from "./products.type.ts";

export class ProductsService {
  #dynamoClient: DynamoDBClient;
  #productsTable: string;
  #stocksTable: string;

  constructor() {
    this.#dynamoClient = new DynamoDBClient();
    this.#productsTable = process.env.PRODUCTS_TABLE;
    this.#stocksTable = process.env.STOCKS_TABLE;
  }

  async getAllProducts(): Promise<ProductDto[]> {
    const result = await Promise.all([
      this.#dynamoClient.send(
        new ScanCommand({
          TableName: this.#productsTable,
        })
      ),
      this.#dynamoClient.send(
        new ScanCommand({
          TableName: this.#stocksTable,
        })
      ),
    ]);

    const [products, stocks] = result.map(({ Items }) => {
      return Items?.map((item) => unmarshall(item)) || [];
    });

    return products.map((product) => {
      const stock = stocks.find((stock) => stock.product_id === product.id);

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stock?.count || 0,
      };
    });
  }

  async getProductById(productId: string): Promise<ProductDto | undefined> {
    const result = await Promise.all([
      this.#dynamoClient.send(
        new GetItemCommand({
          TableName: this.#productsTable,
          Key: marshall({ id: productId }),
        })
      ),
      this.#dynamoClient.send(
        new GetItemCommand({
          TableName: this.#stocksTable,
          Key: marshall({ product_id: productId }),
        })
      ),
    ]);

    const [product, stock] = result.map(({ Item }) => unmarshall(Item));

    if (!product) return undefined;

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      count: stock?.count || 0,
    };
  }

  async createProduct(productDto: CreateProductDto): Promise<ProductDto> {
    const product: ProductDto = {
      id: randomUUID(),
      title: productDto.title,
      description: productDto.description,
      price: productDto.price,
      count: productDto.count,
    };

    await this.#dynamoClient.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: this.#productsTable,
              Item: marshall({
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
              }),
            },
          },
          {
            Put: {
              TableName: this.#stocksTable,
              Item: marshall({
                product_id: product.id,
                count: product.count,
              }),
            },
          },
        ],
      })
    );

    return product;
  }
}
