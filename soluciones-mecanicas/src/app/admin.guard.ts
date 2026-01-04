import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        take(1),
        map(user => {
            if (user && user.role === 'admin') {
                return true;
            }

            // Redirect to dashboard if logged in but not admin, or login if not logged in
            if (user) {
                return router.createUrlTree(['/dashboard']);
            }
            return router.createUrlTree(['/login']);
        })
    );
};
