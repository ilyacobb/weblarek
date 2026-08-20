import { IApi } from "../../types";
import { IProductsResponse } from "../../types";
import { TOrderRequest } from "../../types";
import { IOrderResult } from "../../types";

export class ProductsApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsList(): Promise<IProductsResponse> {
    const result = await this.api.get<IProductsResponse>("/product/");
    return result;
  }

  async postOrder(order: TOrderRequest): Promise<IOrderResult> {
    const result = await this.api.post<IOrderResult>("/order", order);
    return result;
  }
}
