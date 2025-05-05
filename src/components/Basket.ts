import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

/**
 * Класс Basket реализует функционал корзины товаров
 * Наследуется от базового Component с типом HTMLElement
 */
export class Basket extends Component<HTMLElement> {
    // Контейнер для списка товаров в корзине
    protected _list: HTMLElement;
    
    // Элемент для отображения общей суммы
    protected _total: HTMLElement;
    
    // Кнопка оформления заказа
    protected _button: HTMLButtonElement;

    // Храним количество товаров в корзине
    private _itemCount: number = 0;

    /**
     * Конструктор класса Basket
     * @param container - Корневой элемент корзины
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Инициализация элементов корзины
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // Изначально блокируем кнопку
        this.setDisabled(this._button, true);

        // Обработчик клика по кнопке оформления заказа
        this._button.addEventListener('click', () => {
            events.emit('order:open'); // Генерация события открытия формы заказа
        });
    }

    /**
     * Устанавливает список товаров в корзине
     * @param items - Массив элементов товаров
     */
    set items(items: HTMLElement[]) {
        this._itemCount = items.length;
        
        if (items.length) {
            // Если есть товары - отображаем их
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            // Если корзина пуста - показываем сообщение
            this._list.textContent = 'Корзина пуста';
            this.setDisabled(this._button, true);
        }
    }

    /**
     * Устанавливает общую сумму заказа
     * @param total - Сумма заказа в синапсах
     */
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    /**
     * Управляет состоянием кнопки оформления заказа
     * @param count - Количество товаров в корзине
     */
    set selected(count: number) {
        this._itemCount = count;
        this.setDisabled(this._button, count === 0);
    }

    /**
     * Возвращает количество товаров в корзине
     */
    get itemCount(): number {
        return this._itemCount;
    }
}