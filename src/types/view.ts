import { IBuyer } from "../types/index";

export interface IHeader {
  counter: number;
}

export interface IGallery {
  catalog: HTMLElement[];
}

export interface IModal {
  content: HTMLElement;
}

export interface ICard {
  title: string;
  price: number | null;
}

export interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export interface ICardPreview extends ICard {
  image: string;
  category: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface ICardBasket extends ICard {
  index: number;
}

export interface IBasket {
  price: number;
  items: HTMLElement[];
  valid: boolean;
}

export interface ISuccess {
  total: number;
}

export interface IForm {
  valid: boolean;
  errors: string;
}

export interface IOrder extends IForm, Pick<IBuyer, "address"> {
  card: boolean;
  cash: boolean;
}

export interface IContacts extends IForm, Pick<IBuyer, "email" | "phone"> {}
