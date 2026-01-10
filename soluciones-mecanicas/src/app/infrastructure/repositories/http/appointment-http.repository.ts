import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, map } from 'rxjs';
import { AppointmentRepositoryPort } from '../../../core/ports/out/appointment.repository.port';
import {
    Appointment,
    CreateAppointmentDTO,
    UpdateAppointmentStatusDTO,
    AppointmentStatus
} from '../../../core/domain/entities/appointment.entity';
import { getApiUrl } from '../../config/environment';

/**
 * HTTP implementation of the Appointment Repository Port
 */
@Injectable({
    providedIn: 'root'
})
export class AppointmentHttpRepository extends AppointmentRepositoryPort {
    private readonly baseUrl = getApiUrl('appointments');

    constructor(private http: HttpClient) {
        super();
    }

    findById(id: string): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
    }

    findAll(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.baseUrl);
    }

    findByUserId(userId: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}?userId=${userId}`);
    }

    findByDate(date: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}?date=${date}`);
    }

    findByStatus(status: AppointmentStatus): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}?status=${status}`);
    }

    create(appointment: CreateAppointmentDTO): Observable<Appointment> {
        const appointmentWithDate = {
            ...appointment,
            createdAt: new Date().toISOString()
        };
        return this.http.post<Appointment>(this.baseUrl, appointmentWithDate);
    }

    updateStatus(id: string, data: UpdateAppointmentStatusDTO): Observable<Appointment> {
        return this.http.patch<Appointment>(`${this.baseUrl}/${id}`, data);
    }

    updateStatusBatch(ids: string[], data: UpdateAppointmentStatusDTO): Observable<Appointment[]> {
        if (ids.length === 0) {
            return of([]);
        }
        const requests = ids.map(id => this.updateStatus(id, data));
        return forkJoin(requests);
    }
}
