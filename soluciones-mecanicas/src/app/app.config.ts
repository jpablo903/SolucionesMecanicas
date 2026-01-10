import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// Hexagonal Architecture - Ports
import { UserRepositoryPort } from './core/ports/out/user.repository.port';
import { AppointmentRepositoryPort } from './core/ports/out/appointment.repository.port';
import { MotorcycleRepositoryPort } from './core/ports/out/motorcycle.repository.port';
import { ScheduleRepositoryPort } from './core/ports/out/schedule.repository.port';

// Hexagonal Architecture - HTTP Repository Implementations
import { UserHttpRepository } from './infrastructure/repositories/http/user-http.repository';
import { AppointmentHttpRepository } from './infrastructure/repositories/http/appointment-http.repository';
import { MotorcycleHttpRepository } from './infrastructure/repositories/http/motorcycle-http.repository';
import { ScheduleHttpRepository } from './infrastructure/repositories/http/schedule-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(
      routes,
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          // Scroll to top on navigation
          window.scrollTo(0, 0);
        }
      })
    ),

    // Hexagonal Architecture - Bind Ports to Implementations
    { provide: UserRepositoryPort, useClass: UserHttpRepository },
    { provide: AppointmentRepositoryPort, useClass: AppointmentHttpRepository },
    { provide: MotorcycleRepositoryPort, useClass: MotorcycleHttpRepository },
    { provide: ScheduleRepositoryPort, useClass: ScheduleHttpRepository },
  ]
};
