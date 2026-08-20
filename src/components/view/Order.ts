import { Form } from "./Form";
import { IOrder } from "../../types/view";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Order extends Form<IOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    const formName = (container as HTMLFormElement).name;

    this.cardButton = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container,
    );
    this.addressElement = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit(`${formName}:change`, {
        field: "payment",
        value: "card",
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit(`${formName}:change`, {
        field: "payment",
        value: "cash",
      });
    });
  }
  set card(value: boolean) {
    this.cardButton.classList.toggle("button_alt-active", value);
  }

  set cash(value: boolean) {
    this.cashButton.classList.toggle("button_alt-active", value);
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
}
// .