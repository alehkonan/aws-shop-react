import { vi, describe, it, expect } from "vitest";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "./getProductsList.ts";

vi.mock("../products.service.ts", () => ({
  ProductsService: vi.fn().mockImplementation(() => ({
    getAllProducts: vi.fn().mockReturnValue([
      {
        id: "1",
        title: "Product 1",
        description: "Description 1",
        price: 99.99,
        count: 10,
      },
      {
        id: "2",
        title: "Product 2",
        description: "Description 2",
        price: 100,
        count: 2,
      },
    ]),
  })),
}));

describe("getProductsList", () => {
  it("should return list of products", async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = vi.fn();

    const result = await handler(event, context, callback);

    if (!result) {
      throw new Error("Handler returned void instead of APIGatewayProxyResult");
    }

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(
      JSON.stringify([
        {
          id: "1",
          title: "Product 1",
          description: "Description 1",
          price: 99.99,
          count: 10,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Description 2",
          price: 100,
          count: 2,
        },
      ])
    );
  });
});
