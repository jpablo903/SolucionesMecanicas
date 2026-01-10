import { Observable } from 'rxjs';
import { Motorcycle, CreateMotorcycleDTO, UpdateMotorcycleDTO } from '../../domain/entities/motorcycle.entity';

/**
 * Motorcycle Repository Port - Abstract interface for motorcycle data access
 */
export abstract class MotorcycleRepositoryPort {
    /**
     * Find a motorcycle by ID
     */
    abstract findById(id: string): Observable<Motorcycle>;

    /**
     * Get all motorcycles
     */
    abstract findAll(): Observable<Motorcycle[]>;

    /**
     * Get motorcycles for a specific user
     */
    abstract findByUserId(userId: string): Observable<Motorcycle[]>;

    /**
     * Check if license plate already exists
     */
    abstract licensePlateExists(licensePlate: string): Observable<boolean>;

    /**
     * Create a new motorcycle
     */
    abstract create(motorcycle: CreateMotorcycleDTO): Observable<Motorcycle>;

    /**
     * Update an existing motorcycle
     */
    abstract update(id: string, data: UpdateMotorcycleDTO): Observable<Motorcycle>;

    /**
     * Full update of a motorcycle
     */
    abstract replace(motorcycle: Motorcycle): Observable<Motorcycle>;
}
