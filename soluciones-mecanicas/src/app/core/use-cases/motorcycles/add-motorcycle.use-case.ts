import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotorcycleRepositoryPort } from '../../ports/out/motorcycle.repository.port';
import { Motorcycle, CreateMotorcycleDTO } from '../../domain/entities/motorcycle.entity';

/**
 * Add Motorcycle Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class AddMotorcycleUseCase {
    constructor(private motorcycleRepository: MotorcycleRepositoryPort) { }

    /**
     * Add a new motorcycle for a user
     */
    execute(motorcycle: CreateMotorcycleDTO): Observable<Motorcycle> {
        return this.motorcycleRepository.create(motorcycle);
    }
}
