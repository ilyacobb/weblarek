import "./scss/styles.scss";
import { CatalogProducts } from "./components/Models/CatalogProducts";
import { BasketProducts } from "./components/Models/BasketProducts";
import { BuyerProduct } from "./components/Models/BuyerProduct";
import { ProductsApi } from "./components/Api/ProductsApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { Header } from "./components/view/Header";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { CardCatalog } from "./components/view/CardCatalog";
import { CDN_URL } from "./utils/constants";
import { CardPreview } from "./components/view/CardPreview";
import { IProduct, TFieldChangeEvent, TOrderRequest } from "./types";
import { Basket } from "./components/view/Basket";
import { CardBasket } from "./components/view/CardBasket";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";

const events = new EventEmitter();

const productsModel = new CatalogProducts(events);
const basketProducts = new BasketProducts(events);
const buyerProduct = new BuyerProduct(events);

const api = new Api(API_URL);
const productsApi = new ProductsApi(api);

const headerContainer = ensureElement(".header");
const header = new Header(headerContainer, events);

const galleryContainer = ensureElement(".gallery");
const gallery = new Gallery(galleryContainer);

const modalContainer = ensureElement("#modal-container");
const modal = new Modal(modalContainer, events);

const cardPreviewElement = cloneTemplate<HTMLElement>("#card-preview");
const cardPreview = new CardPreview(cardPreviewElement, events);

const basketElement = cloneTemplate<HTMLElement>("#basket");
const basketView = new Basket(basketElement, events);

const orderElement = cloneTemplate<HTMLElement>("#order");
const orderView = new Order(orderElement, events);

const contactsElement = cloneTemplate<HTMLElement>("#contacts");
const contactsView = new Contacts(contactsElement, events);

const successElement = cloneTemplate<HTMLElement>("#success");
const successView = new Success(successElement, events);

function renderPreview(product: IProduct): void {
  const element = cardPreview.render({
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
    description: product.description,
    buttonText:
      product.price === null
        ? "Недоступно"
        : basketProducts.hasProduct(product.id)
          ? "Удалить из корзины"
          : "В корзину",
    buttonDisabled: product.price === null,
  });

  modal.render({ content: element });
}

function renderOrder(): void {
  const buyerData = buyerProduct.getData();
  const errors = buyerProduct.validate();
  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join("; ");

  orderView.render({
    card: buyerData.payment === "card",
    cash: buyerData.payment === "cash",
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: orderErrors,
  });
}

function renderContacts(): void {
  const buyerData = buyerProduct.getData();
  const errors = buyerProduct.validate();
  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join("; ");

  contactsView.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
    errors: contactsErrors,
  });
}

function renderBasket(): HTMLElement {
  const items = basketProducts.getItems();

  const cards = items.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>("#card-basket");
    const card = new CardBasket(cardElement, () => {
      events.emit("basket:remove", { id: product.id });
    });
    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  return basketView.render({
    items: cards,
    price: basketProducts.getTotalPrice(),
    valid: items.length > 0,
  });
}

renderOrder();
renderContacts();
renderBasket();

events.on("catalog:changed", () => {
  const products = productsModel.getProducts();
  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>("#card-catalog");
    const card = new CardCatalog(cardElement, () => {
      events.emit("card:select", { id: product.id });
    });
    return card.render({
      title: product.title,
      price: product.price,
      image: CDN_URL + product.image,
      category: product.category,
    });
  });
  gallery.render({ catalog: cards });
});

productsApi
  .getProductsList()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Ошибка при получении каталога с сервера:", error);
  });

events.on("card:select", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.saveSelected(product);
  }
});

events.on("catalog:selected", () => {
  const product = productsModel.getSelected();
  if (!product) return;
  renderPreview(product);
  modal.open();
});

events.on("card:action", () => {
  const product = productsModel.getSelected();
  if (!product) return;

  if (basketProducts.hasProduct(product.id)) {
    basketProducts.removeProduct(product.id);
  } else {
    basketProducts.addProduct(product);
  }
  modal.close();
});

events.on("basket:changed", () => {
  header.render({ counter: basketProducts.getItemCount() });
  renderBasket();
});

events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on("basket:remove", (data: { id: string }) => {
  basketProducts.removeProduct(data.id);
});

events.on("basket:order", () => {
  modal.render({ content: orderView.render() });
  modal.open();
});

events.on("order:change", (data: TFieldChangeEvent) => {
  buyerProduct.saveData({ [data.field]: data.value });
});

events.on("buyer:changed", () => {
  renderOrder();
  renderContacts();
});

events.on("order:submit", () => {
  modal.render({ content: contactsView.render() });
  modal.open();
});

events.on("contacts:change", (data: TFieldChangeEvent) => {
  buyerProduct.saveData({ [data.field]: data.value });
});

events.on("contacts:submit", () => {
  const order: TOrderRequest = {
    ...buyerProduct.getData(),
    total: basketProducts.getTotalPrice(),
    items: basketProducts.getItems().map((product) => product.id),
  };

  productsApi
    .postOrder(order)
    .then((result) => {
      basketProducts.clearBasket();
      buyerProduct.clearBuyer();

      const element = successView.render({ total: result.total });
      modal.render({ content: element });
      modal.open();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
});
