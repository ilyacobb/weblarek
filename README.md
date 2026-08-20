# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/Models/ — модели данных
- src/components/Api/ — слой коммуникации с сервером 
- src/components/view/ — компоненты представления
- src/types/index.ts — типы моделей и данных, общие для приложения
- src/types/view.ts — типы для render() компонентов представления

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные

Содержит данные интерфейсов Товара и Покупателя

`interface IProduct` - интерфейс Товара, который приходит с сервера через GET /product/, а его id попадает в список items при отправке заказа через POST/order.

`id: string` - идентификационный номер товара.
`title: string` - название товара.
`image: string` - изображение товара.
`category: string` - к какой категории относится товар.
`price: number | null` - цена товара, null - товар не доступен к покупке.
`description: string` - описание товара.

`interface IBuyer` - интерфейс покупателя, данные которого пользователь вводит в формах order и contacts (способ оплаты и адрес / email и телефон), а затем они отправляются на сервер в запросе POST/order.

`payment: TPayment` - содержит в себе способы оплаты. 'card' | 'cash' | '' (карта | наличные | пустая строка, если способ оплаты не выбран)
`address: string` - адрес покупателя.
`email: string` - электронная почта покупателя.
`phone: string` - номер телефона.

`type TPayment` - 'card' | 'cash' | '' (карта | наличные | пустая строка, если способ оплаты не выбран).
`type TBuyerErrors = Partial<Record<keyof IBuyer, string>>` - ключи автоматически берутся из полей интерфейса IBuyer (payment, address, email, phone).

`interface IProductsResponse` - объект, который возвращает сервер в ответ на GET /product/.
`total: number` - общее количество товаров на сервере.
`items: IProduct[]` - массив товаров.

`type TOrderRequest = IBuyer & { total: number; items: string[] }` - данные заказа, которые отправляются на сервер в запросе POST /order.

`interface IOrderResult` - объект, которым сервер подтверждает успешное оформление заказа в ответ на POST /order.
`id: string` - идентификатор созданного заказа.
`total: number` - итоговая сумма заказа, подтверждённая сервером.

`type TFieldChangeEvent = { field: keyof IBuyer; value: string }` — тип
полезной нагрузки событий изменения полей форм (order:change, contacts:change).

#### Типы слоя представления

Содержит интерфейсы данных, которые принимает `render()` компонентов
представления. Эти типы отделены от `types/index.ts`, так как описывают
не бизнес-данные приложения, а форму, ожидаемую конкретным View-компонентом.

`interface IHeader { counter: number }` — данные для Header.

`interface IGallery { catalog: HTMLElement[] }` — данные для Gallery.

`interface IModal { content: HTMLElement }` — данные для Modal.

`interface ICard { title: string; price: number | null }` — общие поля
для всех вариантов карточки.

`interface ICardCatalog extends ICard { image: string; category: string }` —
данные для CardCatalog.

`interface ICardPreview extends ICard { image: string; category: string;
description: string; buttonText: string; buttonDisabled: boolean }` —
данные для CardPreview.

`interface ICardBasket extends ICard { index: number }` — данные для CardBasket.

`interface IBasket { price: number; items: HTMLElement[]; valid: boolean }` —
данные для Basket.

`interface ISuccess { total: number }` — данные для Success.

`interface IForm { valid: boolean; errors: string }` — общие поля для форм.

`interface IOrder extends IForm, Pick<IBuyer, 'address'> { card: boolean;
cash: boolean }` — данные для Order; поле address взято из IBuyer через Pick,
чтобы не дублировать модель.

`interface IContacts extends IForm, Pick<IBuyer, 'email' | 'phone'> {}` —
данные для Contacts, аналогично собраны из IBuyer.

##### Модели данных

###### Класс CatalogProducts

Каталог товаров на главное странице, включающий в себя массив товаров.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий для оповещения об изменениях данных.

Поля класса:
`products: IProduct[]` - Массив товаров.
`selectedProduct: IProduct | null` - Выбранная карточка.

Методы:
`getProducts(): IProduct[]` - Список товаров.
`saveSelected(product: IProduct): void` - Сохранение выбранной карточки.
`getSelected(): IProduct | null` - Получение выбранной карточки.
`getProductById(id: string): IProduct | undefined` - получение одного товара по id.
`setProducts(products: IProduct[]): void` - Сохранение массива товаров. Этот метод принимает на вход массив товаров, ничего не возвращает.

События:
`catalog:selected` — генерируется в saveSelected при сохранении выбранного товара.
`catalog:changed` — генерируется в setProducts при обновлении списка товаров.

###### Класс BasketProducts

Управляет содержимым корзины покупателя. Хранит выбранные товары, позволяет добавлять и удалять позиции

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий для оповещения об изменениях данных.

Поля класса:
`products: IProduct[]` - Массив товаров.

Методы класса:
`addProduct(product: IProduct): void` - Добавить товар.
`removeProduct(productId: string): void` - Удалить товар.
`getItemCount(): number` - Количетсво товаров.
`getItems(): IProduct[]` - Список товаров. Возвращает массив всех позиций в корзине.
`getTotalPrice(): number` - Возвращает общую стоимость всех товаров в корзине.
`hasProduct(productId: string): boolean` - Узнать наличие товара. Возвращает true - если товар есть, иначе false.
`clearBasket(): void` - метод очистки корзины после успешного оформления заказа.

События:
`basket:changed` — генерируется в addProduct, removeProduct и clearBasket
при любом изменении содержимого корзины.

###### Класс BuyerProduct

Форма заполнения данных покупателя, хранит в себе контактные данные и способы оплаты.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий для оповещения об изменениях данных.

Поля класса:
`payment: TPayment` - содержит в себе способы оплаты. 'card' | 'cash' | '' (карта | наличные | пустая строка, если способ оплаты не выбран)
`address: string` - адрес покупателя.
`email: string` - электронная почта покупателя.
`phone: string` - номер телефона.
`type TPayment` - 'card' | 'cash' | '' (карта | наличные | пустая строка, если способ оплаты не выбран).

Методы класса:
`validate(): TBuyerErrors` - Проверка данных на корректность.
`getData(): IBuyer` - Получение данных.
`saveData(data: Partial<IBuyer>): void` - Сохранение данных.
`clearBuyer(): void` - метод очистки данных покупателя.

События:
`buyer:changed` — генерируется в saveData и clearBuyer при любом изменении
данных покупателя.

###### Слой коммуникации

###### Класс ProductsApi

Этот класс будет использовать композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и будет получать с сервера объект с массивом товаров.

Конструктор:
`constructor(api: IApi)` - принимает готовый объект, реализующий интерфейс IApi.

Поля класса:
`api: IApi` - хранит ссылку на объект, реализующий интерфейс IApi, через который выполняются запросы к серверу.

Методы класс:
`getProductsList(): Promise<IProductsResponse>` - выполняет GET-запрос на эндпоинт /product/ и возвращает промис с объектом вида {total, items}. items-массив товаров, полученных с сервера.

`postOrder(orderData: TOrderRequest): Promise<IOrderResult>` - выполняет POST-запрос на эндпоинт /order передавая данные заказа (способ оплаты, адрес, контакты покупателя, сумму и список id товаров), и возвращает промис с объектом-подтверждением покупки.

###### Класс Header<T> extends Component<T>

Управление верхней панели(шапки). Отвечает за отображение количества товаров в корзине и кнопку открытия корзины.

Конструктор:

`constructor(container : HTMLElement, protected events: IEvents)` - вызывает конструктор родителя Component, находит внутри container общие DOM-элементы через ensureElement.

Поля класса:

`protected basketButton: HTMLButtonElement` - элемент кнопки корзины.
`protected counterElement: HTMLElement` - элемент счетчика корзины.

Методы:

`set counter(value: number)` - устанавливает количество товаров в корзине.

События:
при клике на `basketButton` генерируется событие basket:open без дополнительных данных.

###### Класс Gallery<T> extends Component<T>

Отображение каталога товаров.

Конструктор:
`constructor(container: HTMLElement)` - вызывает конструктор родителя Component, находит внутри container общие DOM-элементы через ensureElement.

Методы:
`set catalog(items: HTMLElement[])` - заполняет каталог переданными элементами.

###### Класс Modal<T> extends Component<T>

Управление модальным окном. Открытие, закрытие и установка содержимого.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор
родителя Component, находит `contentElement` и `modalButton` через ensureElement. Подписывает клик по `modalButton` и клик по фону (`container`, но не по его
содержимому — через сравнение `event.target === event.currentTarget`) на
вызов `this.close()`.

Поля класса:
`protected modalButton: HTMLButtonElement` — кнопка закрытия модального окна. 
`protected contentElement: HTMLElement` — контейнер содержимого модального окна.

Методы:
`set content(value: HTMLElement)` — заменяет содержимое contentElement
на переданный элемент (через replaceChildren).
`open(): void` — открывает модальное окно.
`close(): void` — закрывает модальное окно.

Класс не генерирует событие `modal:close` — закрытие по клику на крестик или
по фону выполняется прямым вызовом собственного метода `close()`, без
посредничества Presenter'а.

###### Класс Card<T extends ICard = ICard> extends Component<T>

Базовый класс карточки товара. Отвечает только за общее для всех вариантов
карточки — заголовок и цену. Изображение и категория есть не у всех карточек
(в карточке корзины их нет), поэтому вынесены в наследников, где эти элементы
присутствуют всегда.

Конструктор:
`constructor(container: HTMLElement)` — вызывает конструктор родителя Component,
находит `titleElement` и `priceElement` через ensureElement.

Поля класса:
`protected titleElement: HTMLElement` — элемент заголовка карточки.
`protected priceElement: HTMLElement` — элемент цены карточки.

Методы:
`set title(value: string)` — устанавливает текст заголовка.
`set price(value: number | null)` — устанавливает текст цены в формате
"N синапсов"; если value === null, устанавливает текст "Бесценно".

###### Класс CardCatalog extends Card

Карточка товара для отображения в каталоге.

Конструктор:
`constructor(container: HTMLElement, onClick: () => void)` — вызывает конструктор
родителя Card, находит `imageElement` и `categoryElement` через ensureElement,
подписывает клик по всему контейнеру на вызов переданного onClick.

Поля класса:
`protected imageElement: HTMLImageElement` — элемент изображения карточки.
`protected categoryElement: HTMLElement` — элемент категории карточки.

Методы:
`set image(value: string)` — устанавливает src и alt через this.setImage().
`set category(value: string)` — устанавливает текст категории и полностью
заменяет className элемента на CSS-модификатор из categoryMap

События:
При клике по контейнеру карточки вызывается обработчик `onClick`, переданный
в конструктор.

###### Класс CardPreview extends Card<ICardPreview>

Карточка товара для отображения в модальном окне превью. Содержит изображение,
категорию, описание и кнопку добавления/удаления товара из корзины.

Конструктор:
`constructor(container: HTMLElement, onClick: () => void)` — вызывает конструктор
родителя Card, находит `descriptionElement`, `buttonElement`, `imageElement`
и `categoryElement` через ensureElement, подписывает клик по `buttonElement`
на вызов переданного onClick.

Поля класса:
`protected descriptionElement: HTMLElement` — элемент текстового описания товара.
`protected buttonElement: HTMLButtonElement` — кнопка действия
(добавить/удалить из корзины/недоступно).
`protected imageElement: HTMLImageElement` — элемент изображения карточки.
`protected categoryElement: HTMLElement` — элемент категории карточки.

Методы:
`set description(value: string)` — устанавливает текст описания товара.
`set buttonText(value: string)` — устанавливает текст кнопки.
`set buttonDisabled(value: boolean)` — блокирует/разблокирует кнопку.
`set image(value: string)` — устанавливает src и alt через this.setImage().
`set category(value: string)` — устанавливает текст категории и className
через categoryMap, аналогично CardCatalog.

События:
при клике на `buttonElement` вызывается обработчик `onClick`, переданный в конструктор.

###### Класс CardBasket extends Card<ICardBasket>

Карточка товара в списке корзины, с возможностью удаления.

Конструктор:
`constructor(container: HTMLElement, onClick: () => void)` — вызывает конструктор
родителя Card, подписывает его на клик по `deleteButton`.

Поля класса:
`protected indexElement: HTMLElement` — элемент порядкового номера товара в списке.
`protected deleteButton: HTMLButtonElement` — кнопка удаления товара из корзины.

Методы:
`set index(value: number)` — устанавливает порядковый номер (текстом в indexElement).

События:
при клике на `deleteButton` вызывается обработчик `onClick`, переданный в конструктор.

###### Класс Success<T> extends Component<T>

Модальное окно об успешном оформлении заказа. Показывает общую сумму
списанных синапсов и кнопку закрытия окна.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор
родителя Component.

Поля класса:
`protected closeButton: HTMLButtonElement` — кнопка закрытия окна.
`protected descriptionElement: HTMLElement` — элемент с текстом общей суммы списания.

Методы:
`set total(value: number)` — устанавливает текст вида
"Списано N синапсов", где N — переданная сумма.

События:
при клике на `closeButton` генерируется событие `success:close` без
дополнительных данных.

###### Класс Basket<T> extends Component<T>

Управление корзиной товаров. Отображение списка товаров, общая стоимость
и кнопка оформления заказа.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор
родителя Component.

Поля класса:
`protected priceElement: HTMLElement` — элемент общей стоимости.
`protected basketButton: HTMLButtonElement` — кнопка оформления заказа.
`protected listElement: HTMLElement` — контейнер списка товаров.

Методы:
`set price(value: number)` — устанавливает текст общей стоимости в формате
"N синапсов".
`set items(value: HTMLElement[])` — заменяет содержимое listElement на
переданный список (через replaceChildren). Текст "Корзина пуста" при пустом
списке обеспечивается стилями (CSS-псевдоэлемент `::before` для пустого
`.basket__list`), компонент не создаёт для него отдельную разметку.
`set valid(value: boolean)` — включает/выключает атрибут disabled у
basketButton в зависимости от того, есть ли товары в корзине.

События:
при клике на `basketButton` генерируется событие `basket:order` без
дополнительных данных.

###### Класс Form<T> extends Component<T>

Базовый класс для форм с валидацией. Отвечает за общее для всех форм поведение:
показ ошибок, блокировку кнопки submit, генерацию событий изменения полей и отправки.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор родителя
Component, находит внутри container общие DOM-элементы через ensureElement.

Поля класса:
`protected submitButton: HTMLButtonElement` — кнопка отправки формы.
`protected errorsElement: HTMLElement` — элемент отображения текста ошибки.

Методы:
`set valid(value: boolean)` — включает/выключает атрибут disabled у submitButton
в зависимости от валидности формы.
`set errors(value: string)` — устанавливает текст ошибки в errorElement
(пустая строка — ошибок нет, ничего не отображается).

События:
`${container.name}:change` — при вводе в любое поле формы, с данными { field, value }.
`${container.name}:submit` — при отправке формы (клик на submitButton).

###### Класс Order extends Form<IOrder>

Форма оплаты и адреса доставки. Управляет способом оплаты и полем адреса.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор
родителя Form, находит cardButton/cashButton/addressElement через ensureElement.

Клик по `cardButton`/`cashButton` (`type="button"`, `input` для них не работает)
вручную генерирует `order:change` с `{ field: 'payment', value: 'card' | 'cash' }`.

Поля класса:
`protected cardButton: HTMLButtonElement` — кнопка выбора оплаты картой.
`protected cashButton: HTMLButtonElement` — кнопка выбора оплаты наличными.
`protected addressElement: HTMLInputElement` — поле ввода адреса.

Методы:
`set card(value: boolean)` — добавляет/удаляет класс активности у cardButton.
`set cash(value: boolean)` — добавляет/удаляет класс активности у cashButton.
`set address(value: string)` — устанавливает значение поля адреса.

###### Класс Contacts extends Form<IContacts>

Форма контактов покупателя. Управляет полями email и телефона.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` — вызывает конструктор
родителя Form, находит emailElement и phoneElement через ensureElement.

Поля класса:
`protected emailElement: HTMLInputElement` — поле ввода email.
`protected phoneElement: HTMLInputElement` — поле ввода телефона.

Методы:
`set email(value: string)` — устанавливает значение поля email.
`set phone(value: string)` — устанавливает значение поля телефона.

###### События

`catalog:changed` — генерируется в CatalogProducts.setProducts при обновлении
списка товаров. Presenter создаёт карточки CardCatalog для каждого товара
и передаёт их в Gallery.

`catalog:selected` — генерируется в CatalogProducts.saveSelected при
сохранении выбранного товара. Presenter создаёт CardPreview и открывает Modal.

`basket:changed` — генерируется в BasketProducts.addProduct, removeProduct
и clearBasket при любом изменении содержимого корзины. Presenter обновляет
счётчик в Header и перерисовывает Basket.

`buyer:changed` — генерируется в BuyerProduct.saveData и clearBuyer при
изменении данных покупателя. Presenter пересчитывает валидность и ошибки
для Order и Contacts.

`basket:open` - клик по кнопке корзины в Header, без данных.
Presenter открывает Modal с Basket.

`card:select` - клик по карточке в каталоге (через onClick от Presenter),
данные { id: string }. Presenter находит товар по id в CatalogProducts,
сохраняет его как выбранный и открывает Modal с CardPreview.

`card:toggleBasket` - клик по кнопке в CardPreview (через onClick от Presenter),
данные { id: string }. Presenter сам проверяет BasketProducts.hasProduct(id)
и в зависимости от результата вызывает addProduct или removeProduct,
после чего обновляет buttonText/buttonDisabled в CardPreview.

`basket:remove` - клик по кнопке удаления в CardBasket (через onClick от
Presenter), данные { id: string }. Presenter вызывает
BasketProducts.removeProduct(id) и обновляет список товаров в Basket

`basket:order` - клик по кнопке "Оформить" в Basket, без данных.
Presenter закрывает Modal с корзиной и открывает Modal с формой Order.

`success:close` - клик по кнопке закрытия в Success, без данных.
Presenter закрывает модальное окно и возвращает пользователя на главный экран.

`${container.name}:change` — ввод в любое поле формы Order или Contacts,
данные { field: string, value: string }. Имя события зависит от конкретной
формы: order:change или contacts:change (берётся из атрибута name формы).

`${container.name}:submit` — отправка формы Order или Contacts
(клик на submitButton), без данных. Имя события: order:submit или
contacts:submit.

###### Презентер

Презентер реализован процедурно, без выделения в отдельный класс — весь код
находится в `main.ts`.

Презентер состоит из подписок `events.on(...)` двух типов:
- обработка события View (клика, ввода) — вызывает метод модели, ничего
  не рендерит напрямую;
- обработка события модели (данные изменились) — обновляет нужные
  компоненты через `render()`.

Presenter не генерирует события самостоятельно. Исключение — колбэки
`onClick`, которые Presenter передаёт в конструкторы карточек: по контракту
между View и Presenter такой колбэк обязан вызывать `events.emit(...)`,
это не нарушает правило, а является его частью.

Компоненты в единственном экземпляре (`cardPreview`, `basketView`, `orderView`,
`contactsView`, `successView`) создаются один раз при старте и хранятся в `const`;
обработчики только вызывают их `render()` повторно, без пересоздания. Динамическими
остаются `CardCatalog`/`CardBasket` — они создаются заново под каждый элемент списка,
так как на экране может быть несколько экземпляров одновременно.

Обновление данных и показ в модалке разделены на разные функции: `renderPreview`,
`renderOrder`, `renderContacts`, `renderBasket` только обновляют состояние
соответствующего компонента, а решение о том, показывать ли его в модалке
(`modal.render`/`modal.open`), принимается в конкретном обработчике события —
это не даёт открытию модалки лишний раз пересчитывать данные.
