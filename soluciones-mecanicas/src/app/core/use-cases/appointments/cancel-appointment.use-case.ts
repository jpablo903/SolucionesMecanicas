import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentRepositoryPort } from '../../ports/out/appointment.repository.port';
import { Appointment, CancelledBy } from '../../domain/entities/appointment.entity';

/**
 * Cancel Appointment Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class CancelAppointmentUseCase {
    constructor(private appointmentRepository: AppointmentRepositoryPort) { }

    /**
     * Cancel an appointment
     */
    execute(appointmentId: string, cancelledBy: CancelledBy = 'client'): Observable<Appointment> {
        return this.appointmentRepository.updateStatus(appointmentId, {
            status: 'cancelled',
            cancelledBy
        });
    }

    /**
     * Cancel multiple appointments
     */
    executeMultiple(appointmentIds: string[], cancelledBy: CancelledBy = 'admin'): Observable<Appointment[]> {
        return this.appointmentRepository.updateStatusBatch(appointmentIds, {
            status: 'cancelled',
            cancelledBy
        });
    }
}
