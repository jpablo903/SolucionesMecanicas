import { Injectable } from '@angular/core';

/**
 * Logout Use Case - Handles user logout
 */
@Injectable({
    providedIn: 'root'
})
export class LogoutUseCase {
    /**
     * Execute logout - clears stored user data
     */
    execute(): void {
        localStorage.removeItem('userId');
    }
}
