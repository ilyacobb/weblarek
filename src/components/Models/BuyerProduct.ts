import { IBuyer } from "../../types";
import { TPayment } from "../../types";
import { TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerProduct {
  protected payment: TPayment = "";
  protected address: string = "";
  protected email: string = "";
  protected phone: string = "";

  constructor(protected events: IEvents) {}

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearBuyer(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.events.emit("buyer:changed");
  }

  saveData(data: Partial<IBuyer>): void {
    const merged = { ...this.getData(), ...data };
    this.payment = merged.payment;
    this.address = merged.address;
    this.email = merged.email;
    this.phone = merged.phone;
    this.events.emit("buyer:changed");
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите емэйл";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
