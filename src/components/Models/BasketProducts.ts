import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketProducts {
  protected products: IProduct[] = [];

  constructor(protected events: IEvents) {}

  addProduct(product: IProduct): void {
  //  if (product.price !== null) {
  // basketModel.addProduct(product) };
     this.products.push(product);
    this.events.emit("basket:changed");
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter((product) => product.id !== productId);
    this.events.emit("basket:changed");
  }

  getItemCount(): number {
    return this.products.length;
  }

  getItems(): IProduct[] {
    return this.products;
  }

  getTotalPrice(): number {
    return this.products.reduce(
      (total, product) => total + (product.price || 0),
      0,
    );
  }

  hasProduct(productId: string): boolean {
    return this.products.some((product) => product.id === productId);
  }

  clearBasket(): void {
    this.products = [];
    this.events.emit("basket:changed");
  }
}
