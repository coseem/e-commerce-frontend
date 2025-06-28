import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IProduct } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private readonly _apiUrl = environment.apiUrl;
    private readonly _http = inject(HttpClient);

    getAll() {
        return this._http.get<IProduct[]>(`${this._apiUrl}/products`);
    }

    getOne(id: string) {
        return this._http.get<IProduct[]>(`${this._apiUrl}/products/` + id);
    }

    create(product: IProduct) {
        return this._http.post<IProduct>(`${this._apiUrl}/products`, product);
    }
}
