import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly _apiUrl = environment.apiUrl;
  private readonly _http = inject(HttpClient);

  getAll() {
    return this._http.get<ICategory[]>(`${this._apiUrl}/category`);
  }

  getOne(id: string) {
    return this._http.get<ICategory>(`${this._apiUrl}/category/` + id);
  }

  create(category: ICategory) {
    return this._http.post<ICategory>(`${this._apiUrl}/category`, category);
  }

  update(category: ICategory) {
    return this._http.patch<ICategory>(`${this._apiUrl}/category/` + category.id, category);
  }

  remove(id: number) {
    return this._http.delete<void>(`${this._apiUrl}/category/` + id);
  }
}
