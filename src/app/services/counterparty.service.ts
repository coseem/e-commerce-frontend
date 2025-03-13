import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../interfaces/product.interface';
import { ICounterparty } from '../interfaces/counterparty.model';

@Injectable({
  providedIn: 'root'
})
export class CounterpartyService {
  private apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<ICounterparty[]>(`${this.apiUrl}/counterparties`);
  }

  getOne(id: string) {
    return this.http.get<ICounterparty[]>(`${this.apiUrl}/counterparties/` + id);
  }

  create(product: IProduct) {
    return this.http.post<ICounterparty>(`${this.apiUrl}/counterparties`, product);
  }
}
