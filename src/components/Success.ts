import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс описывает структуру данных для успешного заказа
interface ISuccess {
    total: number;  // Общая сумма заказа
}

/**
 * Класс Success реализует отображение экрана успешного оформления заказа
 * Наследуется от базового Component с указанием типа данных ISuccess
 */
export class Success extends Component<ISuccess> {
    // Элемент для отображения описания с суммой заказа
    protected _description: HTMLElement;
    
    // Кнопка закрытия окна успешного заказа
    protected _closeButton: HTMLButtonElement;

    /**
     * Конструктор класса
     * @param container - Родительский DOM-элемент
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Инициализация элементов интерфейса
        this._description = ensureElement<HTMLElement>(
            '.order-success__description',
            this.container
        );
        this._closeButton = ensureElement<HTMLButtonElement>(
            '.order-success__close',
            this.container
        );

        // Назначение обработчика события на кнопку закрытия
        this._closeButton.addEventListener('click', () => {
            // Генерация события о завершении заказа
            this.events.emit('order:finished');
        });
    }

    /**
     * Сеттер для установки суммы заказа
     * Форматирует и отображает сумму в описании
     * @param value - Сумма заказа
     */
    set total(value: number) {
        // Установка текста с форматированием суммы
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}