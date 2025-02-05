import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IProduct } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
    private apiUrl = environment.apiUrl;
    private readonly http = inject(HttpClient);

    getAll() {
        return this.http.get<IProduct[]>(`${this.apiUrl}/products`);
    }

    getOne(id: string) {
        return this.http.get<IProduct[]>(`${this.apiUrl}/products/` + id);
    }

    create(product: IProduct) {
        return this.http.post<IProduct>(`${this.apiUrl}/products`, product);
    }
}
