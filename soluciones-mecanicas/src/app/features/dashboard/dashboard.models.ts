export interface Motorcycle {
    id: string;
    userId: string;
    brand: string;
    model: string;
    version?: string;
    year: number;
    licensePlate: string;
    displayName: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    icon: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface Appointment {
    id?: string;
    userId: string;
    motorcycle: Motorcycle;
    service: Service;
    date: Date;
    timeSlot: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
}

export interface ServiceHistory {
    id: string;
    userId: string;
    appointmentId: string;
    motorcycle: Motorcycle;
    service: Service;
    date: string;
    status: 'completed' | 'cancelled';
    price: number;
    notes?: string;
}
