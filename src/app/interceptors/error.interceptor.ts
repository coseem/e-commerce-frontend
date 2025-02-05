import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error) => {
            let errorMessage = 'Произошла ошибка';

            if (error.error) {
                const { statusCode, error: errorType, message } = error.error;

                errorMessage = message || errorType || errorMessage;

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
    return 'success';
}
