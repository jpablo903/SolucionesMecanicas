import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { Appointment, Service } from '../../dashboard/dashboard.models';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../admin.service';

interface AppointmentWithDetails extends Appointment {
  clientName?: string;
  dateObj?: Date;
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto pb-12">
      <h2 class="text-3xl font-bold mb-6 text-white">Panel Principal</h2>

      <!-- 1. TODAY'S TURNS (Cards) -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4 text-blue-400 flex items-center">
          <span class="material-symbols-outlined mr-2">today</span>
          Turnos de Hoy ({{ today | date:'mediumDate' }})
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="todayAppointments.length > 0; else noTodayTurns">
          <div *ngFor="let appointment of todayAppointments" 
               class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            
            <div class="flex justify-between items-start mb-4">
              <div class="text-2xl font-bold text-white">{{ appointment.timeSlot }}</div>
               <span class="px-2 py-1 text-xs rounded-full border bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  {{ appointment.status | titlecase }}
              </span>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex items-center text-gray-300">
                <span class="material-symbols-outlined text-gray-500 mr-2 text-sm">person</span>
                <span class="font-medium">{{ appointment.clientName || 'Cliente Desconocido' }}</span>
              </div>
              <div class="flex items-center text-gray-300">
                <span class="material-symbols-outlined text-gray-500 mr-2 text-sm">two_wheeler</span>
                <span>{{ appointment.motorcycle.brand }} {{ appointment.motorcycle.model }}</span>
              </div>
              <div class="text-xs text-gray-500 ml-6">{{ appointment.motorcycle.licensePlate }}</div>
              <div class="flex items-center text-gray-300 pt-2 border-t border-gray-700">
                <span class="material-symbols-outlined text-gray-500 mr-2 text-sm">build</span>
                <span>{{ appointment.service.name }}</span>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="flex gap-2 mt-4">
                <button (click)="markAsCompleted(appointment)" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-2 rounded transition-colors flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs mr-1">check</span> Realizado
                </button>
                <button (click)="cancelTurn(appointment)" 
                    class="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-2 rounded transition-colors flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs mr-1">close</span> Cancelar
                </button>
            </div>
          </div>
        </div>

        <ng-template #noTodayTurns>
          <div class="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700 border-dashed">
            <span class="material-symbols-outlined text-4xl text-gray-600 mb-2">event_busy</span>
            <p class="text-gray-400">No hay turnos activos para hoy.</p>
          </div>
        </ng-template>
      </div>

      <!-- 2. UPCOMING TURNS (Table) -->
      <div class="mb-12">
        <h3 class="text-xl font-semibold mb-4 text-purple-400 flex items-center">
          <span class="material-symbols-outlined mr-2">event_upcoming</span>
          Próximos Turnos (Pendientes)
        </h3>

        <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700" *ngIf="upcomingAppointments.length > 0; else noUpcomingTurns">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
              <thead class="bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hora</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Moto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Servicio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr *ngFor="let apt of upcomingAppointments" class="hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ apt.date | date:'shortDate' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-bold">{{ apt.timeSlot }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{{ apt.clientName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ apt.motorcycle.brand }} {{ apt.motorcycle.model }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ apt.service.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                     <button (click)="cancelTurn(apt)" 
                        class="text-red-400 hover:text-red-300 font-medium text-xs flex items-center">
                        <span class="material-symbols-outlined text-sm mr-1">close</span> Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
         <ng-template #noUpcomingTurns>
          <div class="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700 border-dashed">
            <p class="text-gray-400">No hay turnos próximos pendientes.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class AdminHome implements OnInit {
  today = new Date();
  todayAppointments: AppointmentWithDetails[] = [];
  upcomingAppointments: AppointmentWithDetails[] = [];
  loading = true;

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      appointments: this.adminService.getAppointments(),
      users: this.authService.getAllUsers()
    }).pipe(
      map(data => {
        const usersMap = new Map(data.users.map(u => [u.id, `${u.firstName} ${u.lastName}`]));

        return data.appointments.map(apt => ({
          ...apt,
          clientName: usersMap.get(apt.userId) || 'Desconocido',
          dateObj: new Date(apt.date)
        }));
      })
    ).subscribe({
      next: (processedAppointments) => {
        const todayStr = new Date().toDateString();

        // 1. TODAY (Active only)
        this.todayAppointments = processedAppointments
          .filter(apt => new Date(apt.date).toDateString() === todayStr && (apt.status === 'pending' || apt.status === 'confirmed'))
          .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

        // 2. UPCOMING (Pending/Confirmed AND Date > Today)
        this.upcomingAppointments = processedAppointments
          .filter(apt => {
            const aptDate = new Date(apt.date);
            return new Date(apt.date) > new Date() && new Date(apt.date).toDateString() !== todayStr
              && (apt.status === 'pending' || apt.status === 'confirmed');
          })
          .sort((a, b) => {
            const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
            if (dateDiff !== 0) return dateDiff;
            return a.timeSlot.localeCompare(b.timeSlot);
          });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading config', err);
        this.loading = false;
      }
    });
  }

  cancelTurn(appointment: AppointmentWithDetails) {
    if (!confirm('¿Estás seguro de cancelar este turno?')) return;

    if (!appointment.id) return;
    this.adminService.cancelAppointment(appointment.id, 'admin').subscribe(() => {
      appointment.status = 'cancelled';
      appointment.cancelledBy = 'admin';
      this.loadData();
      this.cdr.detectChanges();
    });
  }

  markAsCompleted(appointment: AppointmentWithDetails) {
    if (!appointment.id) return;
    this.http.patch(`${this.apiUrl}/appointments/${appointment.id}`, { status: 'completed' }).subscribe(() => {
      appointment.status = 'completed';
      this.loadData();
      this.cdr.detectChanges();
    });
  }
}
