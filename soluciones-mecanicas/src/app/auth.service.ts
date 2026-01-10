import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Domain entities
import { User } from './core/domain/entities/user.entity';

// Use Cases
import { LoginUseCase } from './core/use-cases/auth/login.use-case';
import { RegisterUseCase } from './core/use-cases/auth/register.use-case';
import { LogoutUseCase } from './core/use-cases/auth/logout.use-case';
import { UpdateUserProfileUseCase } from './core/use-cases/users/update-user-profile.use-case';
import { ChangePasswordUseCase } from './core/use-cases/users/change-password.use-case';
import { GetAllUsersUseCase } from './core/use-cases/users/get-all-users.use-case';
import { UpdateUserStatusUseCase } from './core/use-cases/users/update-user-status.use-case';

// Repository Port (for direct queries not covered by use cases)
import { UserRepositoryPort } from './core/ports/out/user.repository.port';

/**
 * Auth Service - Facade that coordinates authentication-related use cases
 * and maintains reactive state for the current user.
 * 
 * This service acts as the bridge between the presentation layer (components)
 * and the core domain (use cases), following the Hexagonal Architecture pattern.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        // Use Cases
        private loginUseCase: LoginUseCase,
        private registerUseCase: RegisterUseCase,
        private logoutUseCase: LogoutUseCase,
        private updateUserProfileUseCase: UpdateUserProfileUseCase,
        private changePasswordUseCase: ChangePasswordUseCase,
        private getAllUsersUseCase: GetAllUsersUseCase,
        private updateUserStatusUseCase: UpdateUserStatusUseCase,
        // Repository for direct queries
        private userRepository: UserRepositoryPort
    ) {
        // Load current user if logged in
        if (this.hasToken()) {
            this.loadCurrentUser();
        }
    }

    private hasToken(): boolean {
        return localStorage.getItem('userId') !== null;
    }

    private loadCurrentUser(): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.getCurrentUser(userId).subscribe({
                next: (user) => this.currentUserSubject.next(user),
                error: () => this.logout()
            });
        }
    }

    /**
     * Register a new user with email and password
     * Auto-assigns firstName="Nuevo" and lastName="Usuario"
     */
    register(email: string, password: string): Observable<User> {
        return this.registerUseCase.execute(email, password).pipe(
            tap(user => {
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(user);
            })
        );
    }

    /**
     * Login with email and password
     */
    login(email: string, password: string): Observable<User> {
        return this.loginUseCase.execute(email, password).pipe(
            tap(user => {
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(user);
            })
        );
    }

    /**
     * Get current user by ID
     */
    getCurrentUser(userId: string): Observable<User> {
        return this.userRepository.findById(userId);
    }

    /**
     * Update user profile (firstName, lastName, phone)
     */
    updateUserProfile(userId: string, data: Partial<User>): Observable<User> {
        return this.updateUserProfileUseCase.execute(userId, data).pipe(
            tap(user => this.currentUserSubject.next(user))
        );
    }

    /**
     * Change user password
     */
    changePassword(userId: string, newPassword: string): Observable<User> {
        return this.changePasswordUseCase.execute(userId, newPassword).pipe(
            tap(user => this.currentUserSubject.next(user))
        );
    }

    /**
     * Logout current user
     */
    logout(): void {
        this.logoutUseCase.execute();
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
    }

    /**
     * Get current user ID from localStorage
     */
    getCurrentUserId(): string | null {
        return localStorage.getItem('userId');
    }

    /**
     * Check if current user is admin
     */
    isAdmin(): boolean {
        const user = this.currentUserSubject.getValue();
        return user?.role === 'admin';
    }

    /**
     * Get all users (Admin only)
     */
    getAllUsers(): Observable<User[]> {
        return this.getAllUsersUseCase.execute();
    }

    /**
     * Update user active status (Admin only)
     */
    updateUserStatus(userId: string, active: boolean): Observable<User> {
        return this.updateUserStatusUseCase.execute(userId, active);
    }
}
