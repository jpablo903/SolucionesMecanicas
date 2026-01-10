import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User } from '../../domain/entities/user.entity';

/**
 * Update User Status Use Case (Admin)
 */
@Injectable({
    providedIn: 'root'
})
export class UpdateUserStatusUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Update user active status
     */
    execute(userId: string, active: boolean): Observable<User> {
        return this.userRepository.update(userId, { active });
    }
}
