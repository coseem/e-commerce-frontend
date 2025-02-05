import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (token) {
        return true; // ✅ Пользователь авторизован
    } else {
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } }).then();
        return false; // 🚫 Перенаправление на страницу логина
    }
};
