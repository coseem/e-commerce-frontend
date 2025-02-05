import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<ICategory[]>(`${this.apiUrl}/category`);
  }

  getOne(id: string) {
    return this.http.get<ICategory>(`${this.apiUrl}/category/` + id);
  }

  create(category: ICategory) {
    return this.http.post<ICategory>(`${this.apiUrl}/category`, category);
  }

  update(category: ICategory) {
    return this.http.patch<ICategory>(`${this.apiUrl}/category/` + category.id, category);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/category/` + id);
  }
}
