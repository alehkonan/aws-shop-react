import { vi, describe, it, expect } from "vitest";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "./getProductById.ts";

vi.mock("../products.service.ts", () => ({
  ProductsService: vi.fn().mockImplementation(() => ({
    getProductById: vi.fn().mockImplementation((id: string) => {
      if (id === "1") {
        return {
          id: "1",
          title: "Product 1",
          description: "Description 1",
          price: 99.99,
          count: 10,
        };
      }

      return undefined;
    }),
  })),
}));

describe("getProductsById", () => {
  it("should return product with existing id", async () => {
    const event = {
      pathParameters: {
        productId: "1",
      },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = vi.fn();

    const result = await handler(event, context, callback);

    if (!result) {
      throw new Error("Handler returned void instead of APIGatewayProxyResult");
    }

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(
      JSON.stringify({
        id: "1",
        title: "Product 1",
        description: "Description 1",
        price: 99.99,
        count: 10,
      })
    );
  });

  it("should return 404 if product not found", async () => {
    const event = {
      pathParameters: {
        productId: "2",
      },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = vi.fn();

    const result = await handler(event, context, callback);

    if (!result) {
      throw new Error("Handler returned void instead of APIGatewayProxyResult");
    }

    expect(result.statusCode).toBe(404);
  });

  it("should return bad request without product id path param", async () => {
    const event = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = vi.fn();

    const result = await handler(event, context, callback);

    if (!result) {
      throw new Error("Handler returned void instead of APIGatewayProxyResult");
    }

    expect(result.statusCode).toBe(400);
  });
});
