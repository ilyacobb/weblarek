import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasket } from "../../types/view";

export class Basket extends Component<IBasket> {
  protected priceElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected listElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) { 
    super(container); 

    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );

    this.basketButton.addEventListener("click", () => { 
      this.events.emit("basket:order"); 
    }); 
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set valid(value: boolean) {
    this.basketButton.disabled = !value;
  }
}
