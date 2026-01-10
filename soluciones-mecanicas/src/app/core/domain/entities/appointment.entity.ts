import { Motorcycle } from './motorcycle.entity';
import { Service } from './service.entity';

/**
 * Appointment Status - possible states for an appointment
 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'absent';

/**
 * Cancelled By - who cancelled the appointment
 */
export type CancelledBy = 'admin' | 'client';

/**
 * Appointment Entity - Domain model for appointments/turnos
 */
export interface Appointment {
    id?: string;
    userId: string;
    motorcycle: Motorcycle;
    service: Service;
    date: Date;
    timeSlot: string; // '07:00', '15:00' format
    totalPrice: number;
    status: AppointmentStatus;
    cancelledBy?: CancelledBy;
    createdAt?: string;
}

/**
 * DTO for creating a new appointment
 */
export type CreateAppointmentDTO = Omit<Appointment, 'id' | 'createdAt'>;

/**
 * DTO for updating appointment status
 */
export interface UpdateAppointmentStatusDTO {
    status: AppointmentStatus;
    cancelledBy?: CancelledBy;
}

/**
 * Time Slot - for available appointment times
 */
export interface TimeSlot {
    time: string;
    available: boolean;
}
