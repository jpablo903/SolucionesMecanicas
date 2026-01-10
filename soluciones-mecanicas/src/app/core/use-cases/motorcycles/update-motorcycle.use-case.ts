import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotorcycleRepositoryPort } from '../../ports/out/motorcycle.repository.port';
import { Motorcycle } from '../../domain/entities/motorcycle.entity';

/**
 * Update Motorcycle Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class UpdateMotorcycleUseCase {
    constructor(private motorcycleRepository: MotorcycleRepositoryPort) { }

    /**
     * Update a motorcycle (full replacement)
     */
    execute(motorcycle: Motorcycle): Observable<Motorcycle> {
        return this.motorcycleRepository.replace(motorcycle);
    }
}
