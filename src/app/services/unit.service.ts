import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUnit } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private readonly _apiUrl = environment.apiUrl;
  private readonly _http = inject(HttpClient);

  getAll() {
    return this._http.get<IUnit[]>(`${this._apiUrl}/unit`);
  }
}
