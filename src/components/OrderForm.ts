import { Form } from './Form';
import { EventEmitter } from './base/events';
import { OrderPayment } from '../types';

export class OrderForm extends Form<OrderPayment> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);

        this._cardButton = container.elements.namedItem('card') as HTMLButtonElement;
        this._cashButton = container.elements.namedItem('cash') as HTMLButtonElement;
        this._address = container.elements.namedItem('address') as HTMLInputElement;

        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                this.handlePaymentClick('card');
            });
        }

        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                this.handlePaymentClick('cash');
            });
        }
    }

    private handlePaymentClick(paymentType: string) {
        this.events.emit('payment:change', {
            payment: paymentType
        });
    }

    set address(value: string) {
        this._address.value = value;
    }

    set payment(paymentType: string) {
        this.clearPayment();
        if (paymentType === 'card') {
            this.toggleClass(this._cardButton, 'button_alt-active', true);
        } else if (paymentType === 'cash') {
            this.toggleClass(this._cashButton, 'button_alt-active', true);
        }
    }

    clearPayment() {
        this.toggleClass(this._cardButton, 'button_alt-active', false);
        this.toggleClass(this._cashButton, 'button_alt-active', false);
    }
}