import { Component } from "../base/Component";
import { IForm } from "../../types/view";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Form<T extends IForm = IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    const formName = (container as HTMLFormElement).name;

    this.submitButton = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.events.emit(`${formName}:submit`);
    });

    this.container.addEventListener("input", (event: Event) => {
    this.container.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit(`${formName}:change`, {
        field: target.name,
        value: target.value,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
