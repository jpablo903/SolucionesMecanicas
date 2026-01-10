import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User } from '../../domain/entities/user.entity';

/**
 * Get All Users Use Case (Admin)
 */
@Injectable({
    providedIn: 'root'
})
export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Get all users, optionally filtered to clients only
     */
    execute(options?: { clientsOnly?: boolean }): Observable<User[]> {
        return this.userRepository.findAll().pipe(
            map(users => {
                if (options?.clientsOnly) {
                    return users.filter(u => u.role === 'client');
                }
                return users;
            })
        );
    }
}
