import { Injectable } from '@angular/core';
import { Observable, switchMap, forkJoin, of } from 'rxjs';
import { AppointmentRepositoryPort } from '../../ports/out/appointment.repository.port';
import { Appointment } from '../../domain/entities/appointment.entity';

/**
 * Check Absent Appointments Use Case
 * Marks appointments as 'absent' if they are past their scheduled time + 15 min tolerance
 */
@Injectable({
    providedIn: 'root'
})
export class CheckAbsentAppointmentsUseCase {
    private readonly TOLERANCE_MINUTES = 15;

    constructor(private appointmentRepository: AppointmentRepositoryPort) { }

    /**
     * Check and mark absent appointments
     */
    execute(): Observable<Appointment[]> {
        return this.appointmentRepository.findAll().pipe(
            switchMap(appointments => {
                const now = new Date();
                const updates: Observable<Appointment>[] = [];

                appointments.forEach(apt => {
                    if (apt.status === 'pending' || apt.status === 'confirmed') {
                        const aptDate = new Date(apt.date);
                        const [hours, minutes] = apt.timeSlot.split(':').map(Number);

                        const aptDateTime = new Date(aptDate);
                        aptDateTime.setHours(hours, minutes, 0, 0);

                        const toleranceTime = new Date(aptDateTime.getTime() + this.TOLERANCE_MINUTES * 60000);

                        if (now > toleranceTime) {
                            updates.push(
                                this.appointmentRepository.updateStatus(apt.id!, { status: 'absent' })
                            );
                        }
                    }
                });

                if (updates.length > 0) {
                    return forkJoin(updates);
                }
                return of([]);
            })
        );
    }
}
