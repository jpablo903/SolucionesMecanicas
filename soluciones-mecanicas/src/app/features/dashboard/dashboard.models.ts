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

export interface ScheduleConfig {
    id?: string; // usually 'default' or similar
    blockedDays: string[]; // ISO date strings 'YYYY-MM-DD'
    blockedHours: string[]; // '0700', '0800', etc. (Global)
    specificBlocks: { date: string, hours: string[] }[]; // Specific date exceptions
}

export interface Appointment {
    id?: string;
    userId: string;
    motorcycle: Motorcycle;
    service: Service;
    date: Date;
    timeSlot: string; // '0700', '1500' format
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    cancelledBy?: 'admin' | 'client'; // To track who cancelled
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
    role: 'admin' | 'client';
    active: boolean;
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
