# Проектная работа "Веб-ларек"
"Web-larek" — ваш надёжный помощник в веб-разработке. Здесь собрано всё необходимое. Удобный каталог с детальными описаниями, быстрый поиск и лёгкое оформление заказа. Изучайте характеристики товаров в карточках и выбирайте именно то, что нужно для вашего проекта.

## Оглавление
1. Обзор архитектуры
2. Технологический стек
3. Структура проекта
4. Важные файлы
5. Базовые классы
6. Слой представления
7. Типы данных
8. Слой коммуникации
9. Взаимодействие компонентов
10. UML
11. Установка и запуск

## Обзор архитектуры
Проект реализован с использованием паттерна MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственности между ключевыми компонентами системы:

1. Модели (Model) - отвечают за работу с данными и бизнес-логику:
    - ProductModel - управляет каталогом товаров: загрузка данных с сервера, фильтрация, кэширование.
    - BasketModel - контролирует состояние корзины: добавление/удаление товаров, расчет суммы.

2. Представления (View) - Обеспечивают отображение пользовательского интерфейса:
    - MainPageView - главная страница с галереей товаров, управляет элементами интерфейса (кнопка корзины, счетчик).
    - ProductCard - универсальный компонент для отображения товара в трех режимах: галерея, модальное окно, корзина.
    - BasketView - отображает содержимое корзины и общую сумму заказа.
3. Презентер (EventEmitter) - координирует взаимодействие между слоями через систему событий:
    - Централизованная шина событий для обмена данными.
    - Обеспечивает слабую связность компонентов.
    - Обрабатывает пользовательские действия (клики, фильтрацию) и обновляет UI.
    
    ## Технологический стек
- HTML: Разметка веб-страниц с помощью тегов.
- SCSS: Препроцессор CSS с переменными, миксинами и функциями.
- TypeScript: Надстройка над JavaScript с статической типизацией.
- Webpack: Модуль-сборщик для объединения файлов, управления зависимостями и оптимизации кода.

## Структура проекта
- src/ — исходные файлы проекта.
- components/ — папка с JS компонентами.
- base/ — папка с базовым кодом.
- common/ — папка с общими компонентами.
- docs/ — схемы для документации проекта.
- images/ — графические ресурсы.
- pages/ — страницы приложения.
- public/ — статические ресурсы.
- scss/ — стили проекта.
- types/ — типы TypeScript.
- utils/ — вспомогательные утилиты.
- vendor/ — сторонние библиотеки.

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы.
- src/types/index.ts — файл с типами.
- src/index.ts — точка входа приложения.
- src/scss/styles.scss — корневой файл стилей.
- src/utils/constants.ts — файл с константами.
- src/utils/utils.ts — файл с утилитами.

## Базовые классы

### 1. `EventEmitter`
Реализует паттерн "Наблюдатель" для управления событиями приложения: (реализует `IEvents`):
   - `on(event: string, callback: Function)` — Регистрирует обработчик для указанного события
   - `emit(event: string, ...args: any[])` Инициирует событие с передачей данных
   - `trigger(event: string)` — Создает функцию-обертку для удобного вызова события

### 2. `Api`
Базовый класс для HTTP-запросов:
   - `get(endpoint: string)` — Выполняет GET-запрос к эндпоинту
   - `post(endpoint: string, data: object, method = 'POST')` — Отправляет данные POST/PUT методом

### 3. `Component<T>`
Абстрактный класс для UI-компонентов:
   - `toggleClass()`, `setText()`, `setDisabled()` Управление CSS-классами
   - `render(data: T)` — Обновляет компонент новыми данными

### Класс `AppState`
Хранит состояние приложения:
   - `catalog: IProductItem[]` — каталог товаров
   - `preview: string | null` — просматриваемый товар
   - `basket: IProductItem[]` — корзина
   - `order: IOrder | null` — заказ
   - `formErrors: ValidationErrors` — ошибки

**Методы:**
   - Устанавливает каталог и генерирует событие (`setCatalog(items)`)
   - Устанавливает предпросмотр (`setPreview(item)`)
   - Возвращает товар по ID. (`getProduct(id)`)
   - Добавляет товар в корзину (`addProductToBasket(item)`)
   - Удаляет товар из корзины (`deleteProductFromBasket(item)`)
   - Проверяет наличие товара в корзине (`isAddedToBusket(item)`)
   - Возвращает текст кнопки "Купить" или "Удалить". (`getButtonText(item)`)
   - Возвращает количество товаров в корзине (`getBasketTotal()`)
   - Возвращает индекс товара в корзине (`getProductIndex(item)`)
   - Обновляет поле заказа (`setOrderField(field, value)`)
   - Устанавливает способ оплаты (`setOrderPayment(value)`)
   - Возвращает данные заказа (`getOrderData()`)
   - Валидирует форму заказа (`validateOrder()`)
   - Очищает корзину (`clearBasket()`)
   - Очищает данные заказа (`clearOrder()`)

   ## Слой представления (View)

### Основные компоненты
1. **`Modal`** — базовое модальное окно:

      ***`Структура:`***
         - `container: HTMLElement`-  корневой контейнер модального окна
         - `closeButton: HTMLButtonElement` -  элемент закрытия окна
         - `content: HTMLElement` - область для контента

      ***`Функционал:`***
         - `open()`- показывает модальное окно с блокировкой фона
         - `close()` - скрывает модальное окно
         - `render(data)` - заполняет контентом и открывает

      ***`Обработчики событий:`***
         - `click` на `closeButton` - закрытие модального окна
         - `click` вне контента - закрытие модального окна

2. **`ProductCard`** - Базовый класс карточки товара
   **`ProductCardCatalog`** -  для отображения в каталоге.
   **`ProductCardPreview`** - для детального просмотра.
   **`ProductCardBasket`** - для корзины с удалением.

      ***`Элементы:`***
         - `element: HTMLElement`- корневой элемент карточки
         - `button: HTMLButtonElement` - основная кнопка действия
         - `title: HTMLElement` - заголовок товара
         - `price: HTMLElement` - цена товара
         - `image: HTMLImageElement` - изображение товара
         - `category: HTMLElement` - категория товара
         - `description: HTMLElement` - описание товара

      ***`Методы:`***
         - `set title(value)`- Устанавливает название товара
         - `set price(value)`- Устанавливает цену товара
         - `set image(value)`- Устанавливает изображение товара
         - `set category(value)`- Устанавливает категорию товара
         - `set description(value)`- Устанавливает описание товара
         - `set button(value)`- Устанавливает текст кнопки.

      ***`Обработчики событий:`***
         - `click` на карточке - выбор товара (для галереи)
         - `click` на кнопке - действие с товаром (добавить/удалить)
         - `click` на кнопке удаления (deleteButton) - удаление товара из корзины (вызов метода класса карточки)
3. **`Page`** — главная страница:

      ***`Поля:`***
         - `gallery: HTMLElement`- контейнер товаров
         - `basketButton: HTMLButtonElement` -  иконка корзины
         - `basketCounter: HTMLElement` -  счетчик товаров

      ***`Методы:`***
         - `set catalog(items)`- рендерит список товаров
         - `set counter(value)`- обновляет счетчик
         - `set locked(value)`- Блокирует/разблокирует интерфейс

      ***`Обработчики событий:`***
         - `click` на `basketButton` - открытие корзины

4. **`Basket`** — корзина товаров:

      ***`Элементы:`***
         - `list: HTMLUListElement`- список товаров
         - `total: HTMLSpanElement` - сумма заказа
         - `button: HTMLButtonElement` - кнопка оформления

      ***`Функции:`***
         - `set items(items)`-  рендерит список товаров
         - `set total(total)`- показывает итоговую сумму
         - `set selected(count)`- управляет кнопкой оформления

      ***`Обработчики событий:`***
         - `click` на `HTMLButtonElement` - переход к оформлению заказа

5. **`Success`** — успешный заказ

      ***`Поля:`***
         - `closeButton: HTMLButtonElement`- кнопка закрытия
         - `description: HTMLElement` - информация о заказе

      ***`Методы:`***
         - `set total(value)`- установка суммы заказа

      ***`Обработчики событий:`***
         - `click` на `closeButton` - закрытие окна

6. **`OrderForm`** - Форма заказа

   ***`Поля:`***
         - `cashButton: HTMLButtonElement[]` - кнопки выбора оплаты
         - `address: HTMLInputElement` - поле адреса
         - ` cardButton: HTMLButtonElement` - кнопки выбора оплаты

      ***`Функции:`***
         - `togglePayment(value)`- переключает стили оплаты
         - `clearPayment()`- сбрасывает выбор

      ***`Обработчики событий:`***
         - `click` на `_cardButton` - выбор способа оплаты
         - `input` на `_address` - ввод адреса
         - `click` на `_cashButton` - выбор способа оплаты

7. **`ContacntsForm`** -  форма контактов 

      ***`Элементы:`***
         - `form: HTMLFormElement`- контейнер формы
         - `emailInput: HTMLInputElement` - поле email
         - `phoneInput: HTMLInputElement` -  поле телефона
         - `submitButton: HTMLButtonElement` -  кнопка отправки

      ***`Методы:`***
         - `render(data: Contacts)`- отображение формы
         - `setErrors(errors: ValidationErrors)`- отображение ошибок

      ***`Обработчики событий:`***
         - `input` на полях формы - ввод данных
         - `submit` формы - отправка данных

 8. **`Form`** -  отображение общих элементов форм заказа

      ***`Поля:`***
         - `form: HTMLFormElement`- форма контактов
         - `emailInput: HTMLInputElement` - поле email
         - `phoneInput: HTMLInputElement` -  поле телефона
         - `submitButton: HTMLButtonElement` -  кнопка отправки

      ***`Методы:`***
         - `onInputChange(field: keyof T, value: string)`- Обработчик изменения поля
         - `valid = boolean`- установка доступности кнопки отправки
         - `errors = string`- установка текста ошибок

      ***`Обработчики событий:`***
         - `input` на полях формы - ввод данных
         - `submit` формы - отправка данных        

## Типы данных:

### Для Карточек:
```
interface IProductItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button: string;
}
```

### Для Заказа:

```
interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```
### Потверждение заказа:
```
export interface OrderConfirmation extends IOrder {
  total: number;
  items: string[];
}
```

### Интерфейс для модели данных карточек:

```
interface IProductData {
  total: number;
  items: IProductItem[];
}
```

### Тип элемента каталога:


```
type ICatalogItem = Omit<IProductItem, 'description'>;

```

### Тип карточки в корзине:


```
type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;

```

### Тип карточки в корзине:


```
type IProductCategory = { [key: string]: string };

```

### Тип корзины:


```
type IBasketItem {
  items: IBasketItem[];
  total: number | null;
}


```

## Слой коммуникации

### Класс `ApiService`
Наследует `Api`, реализует:
   - Получение каталога товаров
   - Отправка заказа
   - Формирование URL изображений

## Взаимодействие компонентов

**Ключевые события:**
   - `products:changed` - обновление каталога
   - `catalog:select` - выбор товара в каталоге
   - `preview:changed` - просмотр товара
   - `modal:open/close` - открытие/закрытие модального окна
   - `basket:changed` -  изменение корзины
   - `product:select`, `basket:open` — действия
   - `order:open` — открытие формы заказа
   - `button:status` —  изменение статуса кнопки (добавить/удалить)
   - `basket:open` — открытие корзины
   - `basket:delete` — удаление товара из корзины
   - `input:change` — изменение полей формы
   - `order:submit` — отправка формы заказа
   - `contacts:submit` — отправка контактных данных
   - `order:finished` — завершение заказа

 ## UML
 ![UML](src/docs/UMl.png)  

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```