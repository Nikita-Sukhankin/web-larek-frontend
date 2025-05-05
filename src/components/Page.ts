import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

/**
 * Класс Page представляет главную страницу приложения
 * Управляет основными элементами интерфейса:
 * - Галереей товаров
 * - Корзиной и счетчиком товаров
 * - Блокировкой интерфейса
 */
export class Page extends Component<HTMLElement> {
    // Ссылка на контейнер галереи товаров
    protected _gallery: HTMLElement;
    
    // Элемент для отображения количества товаров в корзине
    protected _basketCounter: HTMLElement;
    
    // Кнопка корзины в шапке сайта
    protected _basketButton: HTMLButtonElement;

    /**
     * Конструктор класса Page
     * @param container - Корневой DOM-элемент страницы
     * @param events - Объект для работы с событиями
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Инициализация DOM-элементов
        this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
        this._basketCounter = ensureElement<HTMLElement>(
            '.header__basket-counter', 
            this.container
        );
        this._basketButton = ensureElement<HTMLButtonElement>(
            '.header__basket',
            this.container
        );

        // Обработчик клика по кнопке корзины
        this._basketButton.addEventListener('click', () => {
            // Генерация события открытия корзины
            this.events.emit('basket:open');
        });
    }

    /**
     * Устанавливает список товаров в галерею
     * @param items - Массив DOM-элементов карточек товаров
     */
    set catalog(items: HTMLElement[]) {
        // Очищаем галерею и добавляем новые элементы
        this._gallery.replaceChildren(...items);
    }

    /**
     * Обновляет счетчик товаров в корзине
     * @param value - Количество товаров
     */
    set counter(value: number) {
        // Устанавливаем текстовое значение счетчика
        this.setText(this._basketCounter, String(value));
    }

    /**
     * Блокирует/разблокирует интерфейс страницы
     * @param value - Флаг блокировки (true/false)
     */
    set locked(value: boolean) {
        // Добавляем/удаляем класс блокировки
        if (value) {
            this.container.classList.add('page__wrapper_locked');
        } else {
            this.container.classList.remove('page__wrapper_locked');
        }
    }
}