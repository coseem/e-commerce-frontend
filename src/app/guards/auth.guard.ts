import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (token) {
        return true;
    } else {
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } }).then();
        return false;
    }
};
