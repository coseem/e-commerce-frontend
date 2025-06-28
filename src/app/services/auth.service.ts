import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginRequest, ILoginResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _apiUrl = environment.apiUrl + '/auth';
    private readonly _http = inject(HttpClient);
    private readonly _TOKEN_KEY = 'auth_token';

    login(user: ILoginResponse): Observable<ILoginRequest> {
        return this._http.post<ILoginRequest>(`${this._apiUrl}/login`, user);
    }

    // Сохраняем токен (например, после логина)
    setToken(token: string): void {
        localStorage.setItem(this._TOKEN_KEY, token);
    }

    // Получаем токен для интерцептора
    getToken(): string | null {
        return localStorage.getItem(this._TOKEN_KEY);
    }

    // Удаляем токен при логауте
    logout(): void {
        localStorage.removeItem(this._TOKEN_KEY);
    }
}
