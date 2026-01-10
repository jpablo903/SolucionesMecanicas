import { Observable } from 'rxjs';
import { ScheduleConfig } from '../../domain/entities/schedule-config.entity';

/**
 * Schedule Repository Port - Abstract interface for schedule configuration access
 */
export abstract class ScheduleRepositoryPort {
    /**
     * Get the current schedule configuration
     */
    abstract getConfig(): Observable<ScheduleConfig>;

    /**
     * Update the schedule configuration
     */
    abstract updateConfig(config: ScheduleConfig): Observable<ScheduleConfig>;
}
