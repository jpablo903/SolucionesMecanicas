import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Motorcycle } from '../dashboard/dashboard.models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    // Motorcycles
    getAllMotos(): Observable<Motorcycle[]> {
        return this.http.get<Motorcycle[]>(`${this.apiUrl}/motorcycles`);
    }

    updateMoto(moto: Motorcycle): Observable<Motorcycle> {
        return this.http.put<Motorcycle>(`${this.apiUrl}/motorcycles/${moto.id}`, moto);
    }

    // Helper to check for duplicate patent
    checkPatentUnique(licensePlate: string): Observable<Motorcycle[]> {
        return this.http.get<Motorcycle[]>(`${this.apiUrl}/motorcycles?licensePlate=${licensePlate}`);
    }

    // Schedule Config
    getScheduleConfig(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/scheduleConfig`);
    }

    updateScheduleConfig(config: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/scheduleConfig`, config);
    }

    // Appointments
    getAppointments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/appointments`);
    }

    cancelAppointment(id: string, cancelledBy: 'admin' | 'client' = 'admin'): Observable<any> {
        return this.http.patch(`${this.apiUrl}/appointments/${id}`, { status: 'cancelled', cancelledBy });
    }

    cancelMultipleAppointments(ids: string[], cancelledBy: 'admin' | 'client' = 'admin'): Observable<any[]> {
        if (ids.length === 0) return new Observable(obs => { obs.next([]); obs.complete(); });
        const requests = ids.map(id => this.cancelAppointment(id, cancelledBy));
        return forkJoin(requests);
    }

    // Check for absent appointments (15 min tolerance)
    checkAbsentAppointments(): Observable<any> {
        return this.getAppointments().pipe(
            switchMap(appointments => {
                const now = new Date();
                const updates: Observable<any>[] = [];

                appointments.forEach(apt => {
                    if (apt.status === 'pending' || apt.status === 'confirmed') {
                        const aptDate = new Date(apt.date);
                        const [hours, minutes] = apt.timeSlot.split(':').map(Number);

                        // Set appointment time (using local date logic assuming date is strictly date)
                        const aptDateTime = new Date(aptDate);
                        aptDateTime.setHours(hours, minutes, 0, 0);

                        // Add 15 minutes tolerance
                        const toleranceTime = new Date(aptDateTime.getTime() + 15 * 60000);

                        if (now > toleranceTime) {
                            // Mark as absent
                            updates.push(this.http.patch(`${this.apiUrl}/appointments/${apt.id}`, { status: 'absent' }));
                        }
                    }
                });

                if (updates.length > 0) {
                    return forkJoin(updates);
                } else {
                    return new Observable(obs => { obs.next([]); obs.complete(); });
                }
            })
        );
    }
}
