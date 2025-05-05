import './scss/styles.scss';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { ApiService } from './components/ApiService';
import { API_URL, CDN_URL } from './utils/constants';
import {
    ProductCardCatalog,
    ProductCardPreview,
    ProductCardBasket,
} from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { OrderContacts } from './components/ContactsForm';
import { Success } from './components/Success';
import { IProductItem, IOrder } from './types';

// Создаем экземпляры основных классов
const events = new EventEmitter(); // Система событий для взаимодействия между компонентами
const api = new ApiService(CDN_URL, API_URL); // Сервис для работы с API

// Шаблоны из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // Шаблон карточки товара в каталоге
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // Шаблон карточки товара в модальном окне
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // Шаблон карточки товара в корзине
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); // Шаблон корзины
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); // Шаблон формы заказа
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Шаблон формы контактов
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); // Шаблон успешного оформления заказа

// Компоненты UI
const page = new Page(document.body, events); // Главная страница приложения
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Модальное окно
const basket = new Basket(cloneTemplate(basketTemplate), events); // Корзина покупок
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events); // Форма заказа
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events); // Форма контактов
const success = new Success(cloneTemplate(successTemplate), events); // Экран успешного завершения заказа

// Модель данных приложения
const appState = new AppState({}, events);

// Загружаем список товаров с сервера
api
    .getProductList()
    .then((items) => {
        appState.setCatalog(items); // Устанавливаем каталог товаров
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error); // Логируем ошибку
    });

// Обработчики событий

// При обновлении товаров — обновить галерею на главной странице
events.on('products:changed', () => {
    page.catalog = appState.catalog.map((item) => {
        const productCardCatalog = new ProductCardCatalog(
            cloneTemplate(cardCatalogTemplate),
            events
        );
        return productCardCatalog.render(item); // Рендерим карточку товара
    });
});

// При выборе товара в каталоге — показать превью товара
events.on('catalog:select', ({ id }: { id: string }) => {
    const item = appState.getProduct(id); // Получаем товар по ID
    appState.setPreview(item); // Устанавливаем предпросмотр товара
});

// Обновление превью товара
events.on('preview:changed', (item: IProductItem) => {
    const productCardPreview = new ProductCardPreview(
        cloneTemplate(cardPreviewTemplate),
        events
    );
    modal.render({
        content: productCardPreview.render({
            ...item,
            button: appState.getButtonText(item), // Текст кнопки "Купить" или "Удалить"
        }),
    });
});

// Добавление/удаление товара из корзины
events.on('button:status', ({ id }: { id: string }) => {
    const item = appState.getProduct(id); // Получаем товар по ID
    appState.isAddedToBusket(item); // Добавляем или удаляем товар из корзины
    modal.close(); // Закрываем модальное окно
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render(), // Рендерим содержимое корзины
    });
});

// Обновление корзины
events.on('basket:changed', () => {
    page.counter = appState.getBasketCount(); // Обновляем счетчик товаров в корзине
    basket.total = appState.getBasketTotal(); // Обновляем общую сумму корзины
    basket.items = appState.basket.map((item) => {
        const productCardBasket = new ProductCardBasket(
            cloneTemplate(cardBasketTemplate),
            events
        );
        productCardBasket.index = appState.getProductIndex(item); // Индекс товара в корзине
        return productCardBasket.render({
            ...item,
        });
    });
});

// Удаление товара из корзины
events.on('basket:delete', ({ id }: { id: string }) => {
    const item = appState.getProduct(id); // Получаем товар по ID
    appState.deleteProductFromBasket(item); // Удаляем товар из корзины
});

// Открытие формы заказа
events.on('order:open', () => {
    orderForm.clearPayment(); // Очищаем способ оплаты
    modal.render({
        content: orderForm.render({
            payment: appState.order.payment, // Способ оплаты
            address: appState.order.address, // Адрес доставки
            valid: appState.validateOrder(), // Валидация формы
            errors: [], // Ошибки валидации
        }),
    });
});

// Изменение полей формы заказа
events.on(
    'input:change',
    (data: {
        field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
        value: string;
    }) => {
        appState.setOrderField(data.field, data.value); // Обновляем поле заказа
    }
);

// Изменение способа оплаты
events.on(
    'payment:change',
    (data: { payment: keyof Pick<IOrder, 'payment'>; button: HTMLElement }) => {
        orderForm.togglePayment(data.button); // Переключаем способ оплаты
        appState.setOrderPayment(data.payment); // Устанавливаем способ оплаты
        appState.validateOrder(); // Проводим валидацию
    }
);

// Обновление ошибок валидации
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
    const { payment, address, email, phone } = errors;

    // Функция для создания строки с ошибками
    const createValidationError = (
        errorsObject: Record<string, string>
    ): string =>
        Object.values(errorsObject)
            .filter((i) => !!i) // Фильтруем пустые ошибки
            .join(' и ');

    // Обновляем форму заказа
    orderForm.valid = !payment && !address;
    orderForm.errors = createValidationError({ payment, address });

    // Обновляем форму контактов
    orderContacts.valid = !email && !phone;
    orderContacts.errors = createValidationError({ email, phone });
});

// Переход к форме контактов
events.on('order:submit', () => {
    modal.render({
        content: orderContacts.render({
            email: appState.order.email, // Email пользователя
            phone: appState.order.phone, // Телефон пользователя
            valid: appState.validateOrder(), // Валидация формы
            errors: [], // Ошибки валидации
        }),
    });
});

// Отправка заказа
events.on('contacts:submit', () => {
    api
        .orderItems(appState.getOrderData()) // Отправляем данные заказа на сервер
        .then(() => {
            modal.render({
                content: success.render({
                    total: appState.getBasketTotal(), // Общая сумма заказа
                }),
            });
            appState.clearBasket(); // Очищаем корзину
            appState.clearOrder(); // Очищаем данные заказа
        })
        .catch((err) => {
            console.error(err); // Логируем ошибку
        });
});

// Закрытие успешного заказа
events.on('order:finished', () => {
    modal.close(); // Закрываем модальное окно
});

// Блокировка страницы при открытом модальном окне
events.on('modal:open', () => {
    page.locked = true; // Блокируем страницу
});

events.on('modal:close', () => {
    page.locked = false; // Разблокируем страницу
});