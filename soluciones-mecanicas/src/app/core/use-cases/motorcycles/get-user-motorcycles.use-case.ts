import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotorcycleRepositoryPort } from '../../ports/out/motorcycle.repository.port';
import { Motorcycle } from '../../domain/entities/motorcycle.entity';

/**
 * Get User Motorcycles Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class GetUserMotorcyclesUseCase {
    constructor(private motorcycleRepository: MotorcycleRepositoryPort) { }

    /**
     * Get all motorcycles for a user
     */
    execute(userId: string): Observable<Motorcycle[]> {
        return this.motorcycleRepository.findByUserId(userId);
    }
}
