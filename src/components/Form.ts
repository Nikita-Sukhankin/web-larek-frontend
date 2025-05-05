import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

/**
 * Интерфейс состояния формы
 * @property valid - Флаг валидности формы
 * @property errors - Массив сообщений об ошибках
 */
interface IForm {
    valid: boolean;
    errors: string[];
}

/**
 * Абстрактный класс Form - базовый класс для всех форм в приложении
 * @template T - Тип данных формы
 */
export abstract class Form<T> extends Component<IForm> {
    // Кнопка отправки формы
    protected _submit: HTMLButtonElement;
    
    // Блок для отображения ошибок
    protected _errors: HTMLElement;
    
    // Массив дополнительных кнопок формы (например, переключатели оплаты)
    protected _buttons: HTMLButtonElement[];

    /**
     * Конструктор класса Form
     * @param container - HTML-элемент формы
     * @param events - Объект для работы с событиями
     */
    constructor(
        protected container: HTMLFormElement,
        protected events: EventEmitter
    ) {
        super(container);

        // Инициализация элементов формы
        this._submit = ensureElement<HTMLButtonElement>(
            'button[type=submit]',
            this.container
        );
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._buttons = Array.from(
            this.container.querySelectorAll<HTMLButtonElement>('.button_alt')
        );

        // Обработчик изменений полей ввода
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    /**
     * Обрабатывает изменение значения поля ввода
     * @param field - Имя измененного поля
     * @param value - Новое значение поля
     */
    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`input:change`, {
            field,
            value
        });
    }

    /**
     * Устанавливает состояние валидности формы
     * @param value - Флаг валидности
     */
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    /**
     * Устанавливает текст ошибок формы
     * @param value - Текст ошибки
     */
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    /**
     * Отрисовывает форму с переданным состоянием
     * @param state - Состояние формы (валидность, ошибки и значения полей)
     * @returns HTML-элемент формы
     */
    render(state: Partial<T> & IForm): HTMLFormElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}