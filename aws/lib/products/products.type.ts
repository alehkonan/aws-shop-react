export type ProductDto = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};

export type CreateProductDto = Omit<ProductDto, "id">;
