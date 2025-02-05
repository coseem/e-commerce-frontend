import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICountry } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<ICountry[]>(`${this.apiUrl}/country`);
  }
}
