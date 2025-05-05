import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс для данных модального окна
interface ModalComponent {
    content: HTMLElement; // Содержимое модального окна
}

/**
 * Класс Modal реализует функционал модального окна
 * Наследуется от базового Component с типизацией ModalComponent
 */
export class Modal extends Component<ModalComponent> {
    // Контейнер для содержимого модального окна
    protected _content: HTMLElement;
    // Кнопка закрытия модального окна
    protected _closeButton: HTMLButtonElement;

    /**
     * Конструктор класса Modal
     * @param container - Корневой элемент модального окна
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Инициализация элементов модального окна
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        // Настройка обработчиков событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    /**
     * Устанавливает содержимое модального окна
     * @param value - HTML-элемент для отображения
     */
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    /**
     * Открывает модальное окно
     */
    open(): void {
        // Добавляем класс активности
        this.container.classList.add('modal_active');
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
        // Генерируем событие открытия
        this.events.emit('modal:open');
    }

    /**
     * Закрывает модальное окно
     */
    close(): void {
        // Убираем класс активности
        this.container.classList.remove('modal_active');
        // Восстанавливаем прокрутку страницы
        document.body.style.overflow = '';
        document.body.style.width = '';
        // Очищаем содержимое
        this._content.replaceChildren();
        // Генерируем событие закрытия
        this.events.emit('modal:close');
    }

    /**
     * Отрисовывает и открывает модальное окно
     * @param data - Данные для отображения
     * @returns Корневой элемент модального окна
     */
    render(data: ModalComponent): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}