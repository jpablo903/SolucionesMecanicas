import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentRepositoryPort } from '../../ports/out/appointment.repository.port';
import { Appointment, CreateAppointmentDTO } from '../../domain/entities/appointment.entity';

/**
 * Create Appointment Use Case
 */
@Injectable({
    providedIn: 'root'
})
export class CreateAppointmentUseCase {
    constructor(private appointmentRepository: AppointmentRepositoryPort) { }

    /**
     * Create a new appointment
     */
    execute(appointment: CreateAppointmentDTO): Observable<Appointment> {
        return this.appointmentRepository.create(appointment);
    }
}
