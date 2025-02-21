import { Product } from "./products.type.ts";

// TODO get data from BD
const mockProducts: Product[] = [
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
    price: 149.99,
    count: 5,
  },
];

export class ProductsService {
  async getAllProducts(): Promise<Product[]> {
    return mockProducts;
  }

  async getProductById(productId: string): Promise<Product | undefined> {
    return mockProducts.find((product) => product.id === productId);
  }
}
