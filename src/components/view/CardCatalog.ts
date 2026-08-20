import { ICardCatalog } from "../../types/view";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export class CardCatalog extends Card<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.container.addEventListener("click", onClick);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }
}
