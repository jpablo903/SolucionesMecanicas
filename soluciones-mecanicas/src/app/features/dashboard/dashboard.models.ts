export interface Motorcycle {
    id: string;
    brand: string;
    model: string;
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
    motorcycle: Motorcycle;
    service: Service;
    date: Date;
    timeSlot: string;
    totalPrice: number;
}
