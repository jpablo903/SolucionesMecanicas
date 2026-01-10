import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User } from '../../domain/entities/user.entity';

/**
 * Change Password Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class ChangePasswordUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Change user password
     */
    execute(userId: string, newPassword: string): Observable<User> {
        return this.userRepository.update(userId, { password: newPassword });
    }
}
