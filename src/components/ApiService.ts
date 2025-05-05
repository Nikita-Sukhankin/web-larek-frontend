import { Api, ApiListResponse } from './base/api';
import {
    IApiService,
    IProductItem,
    OrderConfirmation,
    OrderDataResult,
} from '../types';

/**
 * Класс ApiService реализует взаимодействие с серверным API
 * Наследуется от базового класса Api и реализует интерфейс IApiService
 */
export class ApiService extends Api implements IApiService {
    // Базовый URL CDN для загрузки изображений
    readonly cdn: string;

    /**
     * Конструктор класса ApiService
     * @param cdn - Базовый URL CDN для изображений
     * @param baseUrl - Базовый URL API
     * @param options - Дополнительные параметры запроса
     */
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    /**
     * Получает данные одного товара по ID
     * @param id - Идентификатор товара
     * @returns Promise с данными товара
     */
    getProductItem(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then((item: IProductItem) => ({
            ...item,
            // Добавляем полный путь к изображению через CDN
            image: this.cdn + item.image
        }));
    }

    /**
     * Получает список всех товаров
     * @returns Promise с массивом товаров
     */
    getProductList(): Promise<IProductItem[]> {
        return this.get('/product').then(
            (data: ApiListResponse<IProductItem>) => 
            data.items.map((item) => ({
                ...item,
                // Заменяем расширение .svg на .png и добавляем CDN
                image: this.cdn + item.image.replace('.svg', '.png')
            }))
        );
    }

    /**
     * Отправляет данные заказа на сервер
     * @param order - Данные заказа
     * @returns Promise с результатом оформления заказа
     */
    orderItems(order: OrderConfirmation): Promise<OrderDataResult> {
        return this.post('/order', order).then(
            (data: OrderDataResult) => data
        );
    }
}