import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MotorcycleRepositoryPort } from '../../../core/ports/out/motorcycle.repository.port';
import { Motorcycle, CreateMotorcycleDTO, UpdateMotorcycleDTO } from '../../../core/domain/entities/motorcycle.entity';
import { getApiUrl } from '../../config/environment';

/**
 * HTTP implementation of the Motorcycle Repository Port
 */
@Injectable({
    providedIn: 'root'
})
export class MotorcycleHttpRepository extends MotorcycleRepositoryPort {
    private readonly baseUrl = getApiUrl('motorcycles');

    constructor(private http: HttpClient) {
        super();
    }

    findById(id: string): Observable<Motorcycle> {
        return this.http.get<Motorcycle>(`${this.baseUrl}/${id}`);
    }

    findAll(): Observable<Motorcycle[]> {
        return this.http.get<Motorcycle[]>(this.baseUrl);
    }

    findByUserId(userId: string): Observable<Motorcycle[]> {
        return this.http.get<Motorcycle[]>(`${this.baseUrl}?userId=${userId}`);
    }

    licensePlateExists(licensePlate: string): Observable<boolean> {
        return this.http.get<Motorcycle[]>(`${this.baseUrl}?licensePlate=${licensePlate}`).pipe(
            map(motos => motos.length > 0)
        );
    }

    create(motorcycle: CreateMotorcycleDTO): Observable<Motorcycle> {
        return this.http.post<Motorcycle>(this.baseUrl, motorcycle);
    }

    update(id: string, data: UpdateMotorcycleDTO): Observable<Motorcycle> {
        return this.http.patch<Motorcycle>(`${this.baseUrl}/${id}`, data);
    }

    replace(motorcycle: Motorcycle): Observable<Motorcycle> {
        return this.http.put<Motorcycle>(`${this.baseUrl}/${motorcycle.id}`, motorcycle);
    }
}
