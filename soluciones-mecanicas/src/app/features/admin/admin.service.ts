import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Domain entities
import { Motorcycle } from '../dashboard/dashboard.models';
import { Appointment } from '../../core/domain/entities/appointment.entity';
import { ScheduleConfig } from '../../core/domain/entities/schedule-config.entity';

// Use Cases
import { GetAllMotorcyclesUseCase } from '../../core/use-cases/motorcycles/get-all-motorcycles.use-case';
import { UpdateMotorcycleUseCase } from '../../core/use-cases/motorcycles/update-motorcycle.use-case';
import { CancelAppointmentUseCase } from '../../core/use-cases/appointments/cancel-appointment.use-case';
import { CheckAbsentAppointmentsUseCase } from '../../core/use-cases/appointments/check-absent-appointments.use-case';

// Repository Ports (for operations not fully covered by use cases)
import { AppointmentRepositoryPort } from '../../core/ports/out/appointment.repository.port';
import { MotorcycleRepositoryPort } from '../../core/ports/out/motorcycle.repository.port';
import { ScheduleRepositoryPort } from '../../core/ports/out/schedule.repository.port';

/**
 * Admin Service - Facade that coordinates admin-related use cases
 * and provides access to admin-specific operations.
 * 
 * This service acts as the bridge between admin components
 * and the core domain (use cases), following the Hexagonal Architecture pattern.
 */
@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(
        // Use Cases
        private getAllMotorcyclesUseCase: GetAllMotorcyclesUseCase,
        private updateMotorcycleUseCase: UpdateMotorcycleUseCase,
        private cancelAppointmentUseCase: CancelAppointmentUseCase,
        private checkAbsentAppointmentsUseCase: CheckAbsentAppointmentsUseCase,
        // Repository Ports for direct operations
        private appointmentRepository: AppointmentRepositoryPort,
        private motorcycleRepository: MotorcycleRepositoryPort,
        private scheduleRepository: ScheduleRepositoryPort
    ) { }

    // ========== Motorcycles ==========

    getAllMotos(): Observable<Motorcycle[]> {
        return this.getAllMotorcyclesUseCase.execute();
    }

    updateMoto(moto: Motorcycle): Observable<Motorcycle> {
        return this.updateMotorcycleUseCase.execute(moto);
    }

    checkPatentUnique(licensePlate: string): Observable<boolean> {
        return this.motorcycleRepository.licensePlateExists(licensePlate);
    }

    // ========== Schedule Config ==========

    getScheduleConfig(): Observable<ScheduleConfig> {
        return this.scheduleRepository.getConfig();
    }

    updateScheduleConfig(config: ScheduleConfig): Observable<ScheduleConfig> {
        return this.scheduleRepository.updateConfig(config);
    }

    // ========== Appointments ==========

    getAppointments(): Observable<Appointment[]> {
        return this.appointmentRepository.findAll();
    }

    cancelAppointment(id: string, cancelledBy: 'admin' | 'client' = 'admin'): Observable<Appointment> {
        return this.cancelAppointmentUseCase.execute(id, cancelledBy);
    }

    cancelMultipleAppointments(ids: string[], cancelledBy: 'admin' | 'client' = 'admin'): Observable<Appointment[]> {
        return this.cancelAppointmentUseCase.executeMultiple(ids, cancelledBy);
    }

    checkAbsentAppointments(): Observable<Appointment[]> {
        return this.checkAbsentAppointmentsUseCase.execute();
    }

    /**
     * Reactivate an absent appointment back to pending status
     */
    reactivateAppointment(id: string, newDate: string, newTimeSlot: string): Observable<Appointment> {
        return this.appointmentRepository.updateStatus(id, {
            status: 'pending'
        });
    }
}
