import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { ICardBasket } from "../../types/view";

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}
