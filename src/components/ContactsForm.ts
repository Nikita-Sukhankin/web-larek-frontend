import { Form } from './Form';
import { EventEmitter } from './base/events';
import { Contacts } from '../types';

/**
 * Класс OrderContacts реализует форму ввода контактных данных
 * Наследуется от базового класса Form с типизацией Contacts
 */
export class OrderContacts extends Form<Contacts> {
    // Поле ввода email
    protected _email: HTMLInputElement;
    // Поле ввода телефона
    protected _phone: HTMLInputElement;

    /**
     * Конструктор класса OrderContacts
     * @param container - HTML-элемент формы контактов
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);

        // Инициализация полей формы
        this._email = this.container.elements.namedItem('email') as HTMLInputElement;
        this._phone = this.container.elements.namedItem('phone') as HTMLInputElement;
    }

    /**
     * Устанавливает значение email
     * @param value - Email для установки
     */
    set email(value: string) {
        this._email.value = value;
    }

    /**
     * Устанавливает значение телефона
     * @param value - Телефон для установки
     */
    set phone(value: string) {
        this._phone.value = value;
    }
}