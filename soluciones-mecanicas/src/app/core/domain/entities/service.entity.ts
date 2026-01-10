/**
 * Service Entity - Domain model for services offered
 */
export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    icon: string;
}
