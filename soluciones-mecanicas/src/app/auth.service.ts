import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    private currentUserEmailSubject = new BehaviorSubject<string>(this.getStoredEmail());

    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    currentUserEmail$ = this.currentUserEmailSubject.asObservable();

    constructor() { }

    private hasToken(): boolean {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    private getStoredEmail(): string {
        return localStorage.getItem('userEmail') || '';
    }

    login(email: string): void {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        this.isLoggedInSubject.next(true);
        this.currentUserEmailSubject.next(email);
    }

    logout(): void {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        this.isLoggedInSubject.next(false);
        this.currentUserEmailSubject.next('');
    }
}
