import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User, UpdateUserDTO } from '../../domain/entities/user.entity';

/**
 * Update User Profile Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class UpdateUserProfileUseCase {
    constructor(private userRepository: UserRepositoryPort) { }

    /**
     * Update user profile data
     */
    execute(userId: string, data: UpdateUserDTO): Observable<User> {
        return this.userRepository.update(userId, data);
    }
}
