/**
 * Dashboard Models - Re-exports from Core Domain Entities
 * 
 * This file provides backwards compatibility for existing components
 * that import from dashboard.models.ts
 * 
 * @deprecated Import directly from '@app/core/domain/entities' instead
 */

// Re-export all entities from core domain (using type export for interfaces)
export type {
    User,
    UserRole,
    CreateUserDTO,
    UpdateUserDTO,
    LoginCredentials
} from '../../core/domain/entities/user.entity';

export type {
    Motorcycle,
    CreateMotorcycleDTO,
    UpdateMotorcycleDTO
} from '../../core/domain/entities/motorcycle.entity';

export type {
    Service
} from '../../core/domain/entities/service.entity';

export type {
    Appointment,
    AppointmentStatus,
    CancelledBy,
    CreateAppointmentDTO,
    UpdateAppointmentStatusDTO,
    TimeSlot
} from '../../core/domain/entities/appointment.entity';

export type {
    ScheduleConfig,
    SpecificBlock
} from '../../core/domain/entities/schedule-config.entity';
