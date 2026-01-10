import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User, CreateUserDTO } from '../../domain/entities/user.entity';

/**
 * Register Use Case - Handles new user registration
 */
@Injectable({
    providedIn: 'root'
})
export class RegisterUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Execute registration with email and password
     * Auto-assigns default names and stores userId on success
     */
    execute(email: string, password: string): Observable<User> {
        const newUser: CreateUserDTO = {
            email,
            password,
            firstName: 'Nuevo',
            lastName: 'Usuario',
            phone: '',
            createdAt: new Date().toISOString(),
            role: 'client',
            active: true
        };

        return this.userRepository.create(newUser).pipe(
            tap(user => {
                localStorage.setItem('userId', user.id);
            })
        );
    }
}
