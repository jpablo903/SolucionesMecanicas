import { Observable } from 'rxjs';
import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/entities/user.entity';

/**
 * User Repository Port - Abstract interface for user data access
 * This is the contract that any user repository implementation must follow
 */
export abstract class UserRepositoryPort {
    /**
     * Find a user by their ID
     */
    abstract findById(id: string): Observable<User>;

    /**
     * Find a user by email and password (for authentication)
     * Returns null if credentials don't match
     */
    abstract findByCredentials(email: string, password: string): Observable<User | null>;

    /**
     * Check if email already exists
     */
    abstract emailExists(email: string): Observable<boolean>;

    /**
     * Get all users
     */
    abstract findAll(): Observable<User[]>;

    /**
     * Create a new user
     */
    abstract create(user: CreateUserDTO): Observable<User>;

    /**
     * Update an existing user
     */
    abstract update(id: string, data: UpdateUserDTO): Observable<User>;
}
