import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppointmentRepositoryPort } from '../../ports/out/appointment.repository.port';
import { Appointment } from '../../domain/entities/appointment.entity';

/**
 * Get User Appointments Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class GetUserAppointmentsUseCase {
    constructor(private appointmentRepository: AppointmentRepositoryPort) { }

    /**
     * Get all appointments for a user, optionally filtered by status
     */
    execute(userId: string, options?: { activeOnly?: boolean }): Observable<Appointment[]> {
        return this.appointmentRepository.findByUserId(userId).pipe(
            map(appointments => {
                if (options?.activeOnly) {
                    return appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
                }
                return appointments;
            }),
            map(appointments =>
                appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            )
        );
    }
}
