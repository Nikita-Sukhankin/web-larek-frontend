import { Form } from './Form';
import { EventEmitter } from './base/events';
import { OrderPayment } from '../types';

/**
 * Класс OrderForm реализует форму выбора способа оплаты и ввода адреса
 * Наследуется от базового класса Form с типизацией OrderPayment
 */
export class OrderForm extends Form<OrderPayment> {
    // Кнопка выбора оплаты картой
    protected _cardButton: HTMLButtonElement;
    // Кнопка выбора оплаты наличными
    protected _cashButton: HTMLButtonElement;
    // Поле ввода адреса доставки
    protected _address: HTMLInputElement;

    /**
     * Конструктор класса OrderForm
     * @param container - HTML-форма, содержащая элементы заказа
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);

        // Инициализация элементов формы
        this._cardButton = container.elements.namedItem('card') as HTMLButtonElement;
        this._cashButton = container.elements.namedItem('cash') as HTMLButtonElement;
        this._address = container.elements.namedItem('address') as HTMLInputElement;

        // Назначение обработчиков событий для кнопок оплаты
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                this.handlePaymentClick(this._cardButton);
            });
        }

        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                this.handlePaymentClick(this._cashButton);
            });
        }
    }

    /**
     * Обрабатывает клик по кнопке способа оплаты
     * @param button - Нажатая кнопка оплаты
     */
    private handlePaymentClick(button: HTMLButtonElement) {
        this.events.emit('payment:change', {
            payment: button.name,
            button: button
        });
    }

    /**
     * Устанавливает значение адреса доставки
     * @param value - Адрес для установки
     */
    set address(value: string) {
        this._address.value = value;
    }

    /**
     * Активирует выбранный способ оплаты
     * @param value - Элемент кнопки для активации
     */
    togglePayment(value: HTMLElement) {
        this.clearPayment(); // Сначала сбрасываем предыдущий выбор
        this.toggleClass(value, 'button_alt-active', true); // Активируем новый
    }

    /**
     * Сбрасывает выбор способа оплаты
     * Убирает активные стили со всех кнопок
     */
    clearPayment() {
        this.toggleClass(this._cardButton, 'button_alt-active', false);
        this.toggleClass(this._cashButton, 'button_alt-active', false);
    }
}