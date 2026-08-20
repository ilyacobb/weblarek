import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IContacts } from "../../types/view";

export class Contacts extends Form<IContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailElement = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.phoneElement = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }
}
