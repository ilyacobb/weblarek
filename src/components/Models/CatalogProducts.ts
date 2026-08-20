import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogProducts {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    return this.products;
  }

  saveSelected(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selected");
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:changed");
  }

  getSelected(): IProduct | null {
    return this.selectedProduct;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
}
