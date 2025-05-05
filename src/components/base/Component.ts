/**
 * Абстрактный базовый класс Component для UI-компонентов
 * @template T - Тип данных компонента
 */
export abstract class Component<T> {
    /**
     * Конструктор компонента
     * @param container - Корневой DOM-элемент компонента
     */
    protected constructor(protected readonly container: HTMLElement) {}

    /**
     * Переключает CSS-класс на элементе
     * @param element - DOM-элемент
     * @param className - Имя CSS-класса
     * @param force - Принудительно установить/снять класс (опционально)
     */
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    /**
     * Устанавливает текстовое содержимое элемента
     * @param element - DOM-элемент
     * @param value - Значение для установки (будет преобразовано в строку)
     */
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    /**
     * Скрывает элемент
     * @param element - DOM-элемент для скрытия
     */
    protected setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }

    /**
     * Показывает элемент
     * @param element - DOM-элемент для отображения
     */
    protected setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }

    /**
     * Устанавливает состояние disabled для элемента
     * @param element - DOM-элемент
     * @param state - Состояние (true - disabled, false - enabled)
     */
    setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    /**
     * Устанавливает изображение для элемента
     * @param element - Элемент <img>
     * @param src - URL изображения
     * @param alt - Альтернативный текст (опционально)
     */
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    /**
     * Обновляет компонент с новыми данными
     * @param data - Данные для обновления (опционально)
     * @returns Корневой DOM-элемент компонента
     */
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}