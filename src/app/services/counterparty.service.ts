import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICounterParty } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CounterpartyService {
  private readonly _apiUrl = environment.apiUrl;
  private readonly _http = inject(HttpClient);

  getAll() {
    return this._http.get<ICounterParty[]>(`${this._apiUrl}/counterparties`);
  }

  getOne(id: string) {
    return this._http.get<ICounterParty[]>(`${this._apiUrl}/counterparties/` + id);
  }

  create(counterparty: ICounterParty) {
    return this._http.post<ICounterParty>(`${this._apiUrl}/counterparties`, counterparty);
  }
}
