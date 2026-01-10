import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MotorcycleRepositoryPort } from '../../ports/out/motorcycle.repository.port';
import { Motorcycle } from '../../domain/entities/motorcycle.entity';

/**
 * Get All Motorcycles Use Case (Admin)
 */
@Injectable({
    providedIn: 'root'
})
export class GetAllMotorcyclesUseCase {
    constructor(private motorcycleRepository: MotorcycleRepositoryPort) { }

    /**
     * Get all motorcycles
     */
    execute(): Observable<Motorcycle[]> {
        return this.motorcycleRepository.findAll();
    }
}
