import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginRequest, ILoginResponse } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private http = inject(HttpClient);
    private readonly TOKEN_KEY = 'auth_token';

    login(user: ILoginResponse): Observable<ILoginRequest> {
        return this.http.post<ILoginRequest>(`${this.apiUrl}/login`, user);
    }

    // Сохраняем токен (например, после логина)
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // Получаем токен для интерцептора
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Удаляем токен при логауте
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
