/**
 * User Entity - Domain model for users
 */
export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    role: UserRole;
    active: boolean;
}

export type UserRole = 'admin' | 'client';

/**
 * DTO for creating a new user (without id)
 */
export type CreateUserDTO = Omit<User, 'id'>;

/**
 * DTO for updating user profile
 */
export type UpdateUserDTO = Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'password' | 'active'>>;

/**
 * DTO for login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}
