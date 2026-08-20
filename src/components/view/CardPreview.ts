import { Card } from "./Card";
import { ICardPreview } from "../../types/view";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
export class CardPreview extends Card<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

constructor(container: HTMLElement, protected events: IEvents) { 
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:action");
    });

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }
}
