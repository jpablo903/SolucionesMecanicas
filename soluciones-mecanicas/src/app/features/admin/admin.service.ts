import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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
}
