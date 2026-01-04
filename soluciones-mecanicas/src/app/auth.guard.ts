import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
        map(isLoggedIn => {
            if (isLoggedIn) {
                return true;
            } else {
                // Redirect to login if not authenticated
                return router.createUrlTree(['/login']);
            }
        })
    );
};
