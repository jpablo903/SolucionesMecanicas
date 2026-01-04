import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from './features/dashboard/dashboard.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
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
        const newUser: Omit<User, 'id'> = {
            email,
            password, // In production, this should be hashed on the backend
            firstName: 'Nuevo',
            lastName: 'Usuario',
            phone: '',
            createdAt: new Date().toISOString()
        };

        return this.http.post<User>(this.apiUrl, newUser).pipe(
            tap(user => {
                localStorage.setItem('userId', user.id);
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(user);
            })
        );
    }

    /**
     * Login with email and password
     */
    login(email: string, password: string): Observable<User> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length > 0) {
                    return users[0];
                } else {
                    throw new Error('Invalid credentials');
                }
            }),
            tap(user => {
                localStorage.setItem('userId', user.id);
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(user);
            })
        );
    }

    /**
     * Get current user by ID
     */
    getCurrentUser(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }

    /**
     * Update user profile (firstName, lastName, phone)
     */
    updateUserProfile(userId: string, data: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${userId}`, data).pipe(
            tap(user => this.currentUserSubject.next(user))
        );
    }

    /**
     * Change user password
     */
    changePassword(userId: string, newPassword: string): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${userId}`, { password: newPassword }).pipe(
            tap(user => this.currentUserSubject.next(user))
        );
    }

    /**
     * Logout current user
     */
    logout(): void {
        localStorage.removeItem('userId');
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
    }

    /**
     * Get current user ID from localStorage
     */
    getCurrentUserId(): string | null {
        return localStorage.getItem('userId');
    }
}
