import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleRepositoryPort } from '../../../core/ports/out/schedule.repository.port';
import { ScheduleConfig } from '../../../core/domain/entities/schedule-config.entity';
import { getApiUrl } from '../../config/environment';

/**
 * HTTP implementation of the Schedule Repository Port
 */
@Injectable({
    providedIn: 'root'
})
export class ScheduleHttpRepository extends ScheduleRepositoryPort {
    private readonly baseUrl = getApiUrl('scheduleConfig');

    constructor(private http: HttpClient) {
        super();
    }

    getConfig(): Observable<ScheduleConfig> {
        return this.http.get<ScheduleConfig>(this.baseUrl);
    }

    updateConfig(config: ScheduleConfig): Observable<ScheduleConfig> {
        return this.http.put<ScheduleConfig>(this.baseUrl, config);
    }
}
