# Проектная работа "Веб-ларек"
"Web-larek" — ваш надёжный помощник в веб-разработке. Здесь собрано всё необходимое. Удобный каталог с детальными описаниями, быстрый поиск и лёгкое оформление заказа. Изучайте характеристики товаров в карточках и выбирайте именно то, что нужно для вашего проекта.

## Оглавление
1. Архитектура
2. Технологический стек
3. Структура проекта
4. Важные файлы
5. Базовые классы системы
6. Слой моделей данных
7. Слой представления
8. Взаимодействие компонентов
9. Типы данных
10. Процессы в приложении
11. Установка и запуск

## Архитектура
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

## Базовые классы системы
### Api (HTTP-клиент)
Базовый класс для работы с серверным API, инкапсулирующий логику HTTP-запросов. 

1. Конструктор - принимает базовый URL API и настройки запросов. 

2. Основные методы:
    - handleResponse() — унифицированная обработка ответов сервера.
    - get() — выполнение GET-запросов с поддержкой параметров.
    - post() — отправка POST-запросов с телом запроса.

### EventEmitter
Реализация паттерна "Наблюдатель" для управления событиями приложения. 

1. Конструктор - не требует параметров для создания экземпляра

2. Основные методы:
    - Подписываться на события (on).
    - Отписываться от событий (off).
    - Генерировать события (emit).
    - Глобальную обработку всех событий (onAll, offAll).

### Component<T>
Базовый компонент для работы с DOM. 

1. Конструктор - принимает корневой DOM-элемент (контейнер), в котором будет размещаться компонент.

2. Основные методы : 
    - Управление классами (toggleClass).
    - Работа с текстом (setText).
    - Контроль состояния элементов (setDisabled, setHidden, setVisible).
    - Загрузка изображений (setImage).
    - Базовый рендеринг (render).

## Слой моделей данных
### AppState
Централизованное хранилище состояния приложения.

1. Конструктор : не переопределен.

2. Структура данных :
    - Каталог товаров (catalog).
    - Состояние корзины (basket).
    - Данные заказа (order).
    - Ошибки валидации (formErrors).

3. Основные методы:
    - Управление каталогом (setCatalog, setPreview).
    - Работа с корзиной (addToBasket, deleteFromBasket, getBasketTotal).
    - Оформление заказа (setOrderField, resetOrder).
    - Валидация (validateOrder, validateContacts).

## Слой представления
### Page
Базовый контейнер приложения, управляющий: отображением каталога товаров, индикатором состояния корзины, блокировкой интерфейса.

1. Конструктор - принимает корневой DOM-элемент и систему событий для межкомпонентного взаимодействия.

2. Интерфейс управления состоянием :
    - set counter(value: number) 
    - set catalog(items: HTMLElement[]) 
    - set locked(value: boolean) 

### Modal
Универсальный компонент модальных окон с методами, обеспечивает отображение различного контента во всплывающем окне с базовой функциональностью открытия/закрытия. 

1. Конструктор - принимает контейнер модального окна и систему событий для взаимодействия между компонентами.

2. Основные методы :
    - Управление содержимым (set content).
    - Открытие/закрытие (open, close).
    - Комплексное обновление (render).

### Basket
Компонент управления корзиной товаров(отображение списка добавленных товаров, расчет и отображение общей стоимости, контроль состояния кнопки оформления заказа, взаимодействие с другими компонентами через систему событий)

1. Конструктор - принимает DOM-контейнер и систему событий для компонента.

2. Основные методы :
    - Контроль доступности кнопки оформления заказа(updateButtonState).

3. Сеттеры :
    - set price(total: number).
    - set items(items: HTMLElement[]).

### Form
Базовый компонент форм.

1. Конструктор - принимает HTML-форму и систему событий для обработки действий.

2. Основные методы :
    - Обработка изменений полей (onInputChange).
    - Управление валидацией (valid, errors).
    - Комплексное обновление формы (render).

3. Сеттеры :
    - set valid(isValid: boolean).
    - set errors(messages: string).

### Класс Success.
Компонент для отображения экрана успешного завершения заказа.

1. Структура :
    {
        _close: HTMLElement;      // Кнопка закрытия/подтверждения
        _totalPrice: HTMLElement; // Блок с отображением итоговой суммы
        events: IEvents;          // Система обработки событий
    }

2. Основные методы :
    - set total(value: string | number). 
    - set onClose(callback: () => void). 

## Взаимодействие компонентов
### Основной поток данных

1. ProductModel загружает каталог товаров и уведомляет через EventEmitter.

2. MainPageView получает данные и создает ProductCard для каждого товара.

3. При взаимодействии пользователя ProductCard генерирует события:
    - product:add — добавление в корзину.
    - product:view — просмотр деталей.

4. BasketModel обрабатывает изменения корзины и уведомляет представления.

5. BasketView и MainPageView синхронизируют интерфейс.

### Ключевые сценарии

1. Добавление товара в корзину:
    - Пользователь кликает "Добавить" в ProductCard.
    - Генерируется событие product:add.
    - BasketModel обновляет состояние и сохраняет в localStorage.
    - Через EventEmitter обновляются MainPageView (счетчик) и BasketView (список).

2. Оформление заказа:
    - Пользователь заполняет CheckoutForm.
    - OrderModel валидирует данные.
    - При успешной проверке заказ отправляется на сервер.
    - Корзина очищается (BasketModel.clear()).
    - Показывается экран успешного оформления (Success).
    - Типы данных

## Типы данных
### Основные интерфейсы:
```
export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface OrderData {
    items: CartItem[];
    address: string;
    email: string;
    phone: string;
    paymentMethod: 'card' | 'cash';
}
```
### Интерфейсы моделей:
```
export interface IProductModel {
    items: Product[];
    loadProducts(): Promise<void>;
    getProduct(id: string): Product | undefined;
    filterProducts(criteria: Record<string, unknown>): Product[];
}

export interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
    clear(): void;
    getTotal(): number;
}

export interface IOrderModel {
    createOrder(data: OrderData): Promise<void>;
    validateOrder(data: OrderData): boolean;
}
```
### Интерфейсы представлений:
```
export interface IView {
    render(data?: object): HTMLElement;
}

export interface IMainPageView extends IView {
    updateBasketCounter(count: number): void; 
    setProducts(products: Product[]): void;   
    setBasketClickHandler(handler: () => void): void; 
}

export interface IProductCard extends IView {
    constructor(
        template: HTMLTemplateElement,
        handlers: {                    
            basket?: () => void,
            details?: () => void
        }
    );
    render(product: Product): HTMLElement; 
}

export interface IBasketView extends IView {
    updateItems(items: CartItem[]): void; 
    updateTotal(sum: number): void;      
}

export interface ICheckoutForm extends IView {
    setSubmitHandler(handler: (data: OrderData) => void): void;
    showValidationErrors(errors: string[]): void; 
}
```
### Дополнительные типы:
```
// События EventEmitter
export type AppEvents = {
    'product:add': { productId: string };
    'product:view': { productId: string };
    'basket:update': { items: Map<string, number> };
    'order:submit': OrderData;
};

// Конфигурация карточки товара
export type ProductCardConfig = {
    template: 'gallery' | 'modal' | 'basket';
    handlers: {
        basketClick?: () => void;
        detailsClick?: () => void;
    };
};
```
## Процессы в приложении
### Загрузка главной страницы

1. Инициализация UI:
    - MainPageView создает элементы интерфейса: кнопку корзины, счетчик товаров (скрытый по умолчанию), контейнер для галереи товаров.
2. Загрузка данных:
    - ProductModel выполняет запрос к API для получения каталога товаров.
    - После получения данных генерирует событие products:loaded с массивом товаров.
3. Отрисовка товаров:
    - MainPageView подписывается на products:loaded.
    - Для каждого товара создает экземпляр ProductCard в режиме "галерея".

### Работа с корзиной

1. Добавление товара:
    - Пользователь кликает "Добавить" в ProductCard.
    - Генерируется событие product:add.
    - BasketModel увеличивает количество товара, сохраняет состояние в localStorage и уведомляет представления.
2. Удаление товара:
    - BasketModel уменьшает количество товара или удаляет его.
    - Если корзина пуста, уведомляет представления о необходимости скрыть счетчик.

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