import { Observable } from 'rxjs';
import {
    Appointment,
    CreateAppointmentDTO,
    UpdateAppointmentStatusDTO,
    AppointmentStatus
} from '../../domain/entities/appointment.entity';

/**
 * Appointment Repository Port - Abstract interface for appointment data access
 */
export abstract class AppointmentRepositoryPort {
    /**
     * Find an appointment by ID
     */
    abstract findById(id: string): Observable<Appointment>;

    /**
     * Get all appointments
     */
    abstract findAll(): Observable<Appointment[]>;

    /**
     * Get appointments for a specific user
     */
    abstract findByUserId(userId: string): Observable<Appointment[]>;

    /**
     * Get appointments for a specific date
     */
    abstract findByDate(date: string): Observable<Appointment[]>;

    /**
     * Get appointments by status
     */
    abstract findByStatus(status: AppointmentStatus): Observable<Appointment[]>;

    /**
     * Create a new appointment
     */
    abstract create(appointment: CreateAppointmentDTO): Observable<Appointment>;

    /**
     * Update appointment status
     */
    abstract updateStatus(id: string, data: UpdateAppointmentStatusDTO): Observable<Appointment>;

    /**
     * Update multiple appointments status (batch operation)
     */
    abstract updateStatusBatch(ids: string[], data: UpdateAppointmentStatusDTO): Observable<Appointment[]>;
}
