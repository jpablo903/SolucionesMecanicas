/**
 * Motorcycle Entity - Domain model for motorcycles
 */
export interface Motorcycle {
    id: string;
    userId: string;
    brand: string;
    model: string;
    version?: string;
    year: number;
    licensePlate: string;
    displayName: string;
    active?: boolean;
}

/**
 * DTO for creating a new motorcycle
 */
export type CreateMotorcycleDTO = Omit<Motorcycle, 'id'>;

/**
 * DTO for updating motorcycle
 */
export type UpdateMotorcycleDTO = Partial<Omit<Motorcycle, 'id' | 'userId'>>;
