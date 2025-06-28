import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            let errorMessage = 'Произошла ошибка';

            if (error.error) {
                const { statusCode, error: errorType, message } = error.error;

                errorMessage = message || errorType || errorMessage;

                if (statusCode === 401) {
                    authService.logout();
                    router.navigate(['/auth/login']).then();
                }

                messageService.add({
                    severity: getSeverity(statusCode),
                    summary: errorType || 'Ошибка',
                    detail: errorMessage,
                    life: 5000
                });
            }

            return throwError(() => error);
        })
    );
};

function getSeverity(statusCode: number): 'error' | 'warn' | 'info' | 'success' {
    if (statusCode >= 500) return 'error';
    if (statusCode === 401 || statusCode === 403) return 'warn';
    if (statusCode >= 400) return 'info';
    if (statusCode >= 299) return 'success';
    return 'error';
}
