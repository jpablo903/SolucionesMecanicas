import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User } from '../../domain/entities/user.entity';

/**
 * Login Use Case - Handles user authentication
 */
@Injectable({
    providedIn: 'root'
})
export class LoginUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Execute login with email and password
     * Stores userId in localStorage on success
     */
    execute(email: string, password: string): Observable<User> {
        return this.userRepository.findByCredentials(email, password).pipe(
            map(user => {
                if (!user) {
                    throw new Error('Invalid credentials');
                }
                return user;
            }),
            tap(user => {
                localStorage.setItem('userId', user.id);
            })
        );
    }
}
