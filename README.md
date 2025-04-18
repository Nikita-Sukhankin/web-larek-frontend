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

1. Конструктор : 
    constructor(
        baseUrl: string,  // базовый URL API-сервера
        options: RequestInit = {} // стандарртные настройки HTTP-запросов
    )

2. Основные методы : 

    1. handleResponse(response: Response): Promise<any> :
        - Централизованный обработчик всех ответов сервера;
        - Проверяет статус ответа;
        - Обрабатывает сетевые ошибки и проблемы с парсингом;
        - Возвращает унифицированный формат данных для всего приложения;
    
    2. get(endpoint: string, params?: Record<string, any>, options?: RequestInit): Promise<any> :
        - Выполняет GET-запрос к указанному эндпоинту;
        - Параметры :
            * endpoint - путь API;
            * params - query-параметры;
            * options - дополнительные настройки запроса;
        - Особенности :
            * Автоматически добавляет базовый URL;
            * Поддерживает кастомные заголовки;
            * Обрабатывает все типы ошибок;

    3. post(endpoint: string, body: any, options?: RequestInit): Promise<any> :
        - Выполняет POST-запрос с передачей данных;
        - Пареметры :
            * endpoint - путь API;
            * body - данные для отправки;
            * options - дополнительные настройки;

### EventEmitter
Реализация паттерна "Наблюдатель" для управления событиями приложения. 

1. Конструктор - не требует параметров для создания экземпляра

2. Основные методы :
    - on(event: string, callback: (data?: any) => void): void :
        * Регистрирует обработчик для указанного события;
        - Параметры :
            * event - имя события;
            * callback - функция-обработчик, получающая данные события;
    - off(event: string, callback: (data?: any) => void): void : 
        * удаляет конктретный обработчик для указанногот времени;
        * возвращает ошибку если обрабочик не был зарегестрирован; 
    - emit(event: string, data?: any): void :
        * Инициирует указанное событие;
        - Параметры :
            * event - имя события;
            * data - дополнительные данные для передачи обработчикам
    - onAll(callback: (event: string, data?: any) => void): void :
        * Регистрирует глобальный обработчик для всех событий;
        * Получает имя события и данные в параметрах;
        * Полезен для логирования или  отладки; 
    - offAll(): void : 
        * Сбрасывает глобальные обработчики;
    - trigger(event: string): () => void : 
        * При вызове этой функции инициируется указанное событие;

### Component<T>
Базовый компонент для работы с DOM. 

1. Конструктор :
    constructor(protected readonly container: HTMLElement // корневой DOM-элемент, контейнер для компонента
    )

2. Основные методы :
    - toggleClass(element: HTMLElement, className: string, force?: boolean): void :
        * element - целевой DOM-элемент;
        * className - имя класса для переключения;
        * force - необязательный флаг для добавления/удаления класса; 
    - setText(element: HTMLElement | null, value: string): void :
        * Устанавливает текстовое содержимое элемента ;
        * Безопасно обрабатывает случаи, когда элемент не найден;
        * Автоматически экранирует специальные символы;
    - setDisabled(element: HTMLElement, state: boolean): void:
        * Управляет состоянием disable элемента;
        * Работает с формами, кнопками и др интерективными элементами;
    - setHidden(element: HTMLElement): void и setVisible(element: HTMLElement): void :
        * Управляет видимостью через display: none;
        * Сохраняют оригинальное значение display при показе элемента;
    - setImage(element: HTMLImageElement, src: string, alt?: string): void :
        * Устанавливает изображение с обработкой ошибок загрузки;
    - render(data?: Partial<T>): HTMLElement : 
        * Отвечает за обновление DOM при изменении данных; 
        * Возвращает корневой элемент компонента;

## Слой моделей данных
### AppState
Централизованное хранилище состояния приложения.

1. Конструктор : не переопределен.

2. Структура данных :
    ```
    {
    catalog: IProduct[];         // Полный список товаров магазина
    basket: IProduct[];          // Товары в корзине (с дубликатами)
    order: IOrder;               // Данные оформляемого заказа
    preview: string | null;      // ID товара в режиме предпросмотра
    formErrors: FormErrors;      // Ошибки валидации форм (ключ-значение)
    }
    ```

3. Основные методы:
    1. Управление каталогом :
        - setCatalog(items: IProduct[]) - полное обновление каталога;
        - setPreview(item: IProduct) - установка товара для предпросмотра;
    2. Работа с корзиной : 
        - addToBasket(item: IProduct) - добавление товара с проверкой наличия;
        - deleteFromBasket(item: IProduct) - удаление одного экземпляра товара;
        - deleteAllFromBasket() - полная очистка корзины;
        - getBasketAmount() → number - подсчет общего количества позиций;
        - getBasketTotal() → number - расчет итоговой суммы с акциями;
    3. Оформление заказа :
        - setOrderField(field, value) - установка полей доставки/оплаты;
        - setContactsField(field, value) - установка контактных данных;
        - resetOrder() - сброс всех данных заказа;
    4. Валидация :
        - validateOrder() → boolean - проверка обязательных полей доставки;
        - validateContacts() → boolean - валидация; 

## Слой представления
### Page
Базовый контейнер приложения, управляющий: отображением каталога товаров, индикатором состояния корзины, блокировкой интерфейса.

1. Конструктор :
    constructor(
        container: HTMLElement,  // корневой DOM-элемент страницы
        protected events: IEvents // система событий для межкомпонентного взаимодействия
    )

. Интерфейс управления состоянием :
    - set counter(value: number) :
        * Обновляет счетчик товаров в корзине;
        * Автоматически скрывает индификатор при нулевом значении;
        * Поддерживает анимацию изменения значения;
    - set catalog(items: HTMLElement[]) :
        * Рендерит массив карточек товаров в каталоге;
        * Поддерживает ленивуюзагрузку изображений, постепенное появление элементов, обработку пустого состояния каталога;
    - set locked(value: boolean) :
        * Устанавливает состояние блокировки страницы;

### Modal
Универсальный компонент модальных окон с методами, обеспечивает отображение различного контента во всплывающем окне с базовой функциональностью открытия/закрытия. 

1. Конструктор :
    constructor(
        container: HTMLElement, // корневой элемент модального окна
        protected events: IEvents // система событий для взаимодействия с др компонентами
    )

2. Основные методы :
    - set content(value: HTMLElement) :
        * Заменяет текущий конктент модального окна;
        * Очищает предыдущее содержимое;
    - open() :
        * Актививрует модальное окно
    - close() :
        * Деактивирует модальное окно;
        * Автоматически сбрасывает контент;   
    - render(data: IModalData) :
        * Комплексное обновление модального окна;

### Basket
Компонент управления корзиной товаров(отображение списка добавленных товаров, расчет и отображение общей стоимости, контроль состояния кнопки оформления заказа, взаимодействие с другими компонентами через систему событий)

1. Конструктор :
    constructor(
        container: HTMLElement, 
        protected events: IEvents
    )

2. Основные методы :
    - updateButtonState(isActive: boolean): void :
        * Контролирует доступность кнопки оформления заказа;
        * Автоматически вызывается при изменении суммы заказа;

3. Сеттеры :
    - set price(total: number): void :
        * Обновляет отображение общей суммы;
        * Автоматически  вызывает updateButtonState;
    - set items(items: HTMLElement[]): void :
        * Обновляет список товаров в интерфейсе;
        * Синхронизируется с системой событий;

### Form
Базовый компонент форм.

1. Конструктор :
    constructor(
        protected container: HTMLFormElement, //элемент <form>, представляющий саму форму
        protected events: IEvents //система событий для обработки действий
    )

2. Основные методы :
    - onInputChange(field: keyof T, value: string): void :
        * Обработчик изменений полей ввода;
    - render(state: Partial<T> & IFormValidator): void :
        * Комплексное обновление формы;

3. Сеттеры :
    - set valid(isValid: boolean): void :
        * Управление доступностью формы
    - set errors(messages: string): void :
        * Отображение ошибок валидации;   


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
### Класс AppApi.
Специализированный API-клиент для работы с backend-сервисом, расширяющий базовый функционал класса Api. Обеспечивает взаимодействие с API, включая работу с товарами и оформление заказов.

1. Конструктор : 
    constructor(
        baseUrl: string, 
        cdn: string, options?: RequestInit
    )

2. Основные методы :
    - getProducts(): Promise<IProduct[]> : 
        * Получает полный каталог товаров с сервера;
        * Возвращает массив объектов товаров с преобразованными URL-изображений;
        * Обрабатывает случаи пустого каталога, ошибок загрузки, неверного формата данных;
    - getProductById(id: string): Promise<IProduct> :
        * Запрашивает детальную информацию о конкретном товаре ;
        * id - уникальный идентификатор товара;
    - postOrder(order: ICustomer): Promise<TSuccessData> :
        * Отправляет данные на сервер;
        * Обрабатывает различные статусы ответа;

## Типы данных
### Основные интерфейсы:
```
export interface Product {
    id: string;
    title: string;
    price: number | null;
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