import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { Appointment } from '../../dashboard/dashboard.models';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../admin.service';

interface AppointmentWithDetails extends Appointment {
    clientName?: string;
}

@Component({
    selector: 'app-admin-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mx-auto pb-12">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 class="text-3xl font-bold text-white flex items-center">
            <span class="material-symbols-outlined mr-3 text-4xl">history</span>
            Historial General
        </h2>
        
        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por cliente o patente..." 
                class="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-lg">
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Moto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Servicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr *ngFor="let apt of filteredHistory" class="hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ apt.date | date:'shortDate' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ apt.timeSlot }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{{ apt.clientName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ apt.motorcycle.brand }} {{ apt.motorcycle.model }}
                  <span class="block text-xs text-gray-600">{{ apt.motorcycle.licensePlate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ apt.service.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full border" [ngClass]="{
                        'bg-green-500/20 text-green-400 border-green-500': apt.status === 'completed',
                        'bg-red-500/20 text-red-400 border-red-500': apt.status === 'cancelled'
                    }">
                      <ng-container *ngIf="apt.status === 'cancelled'">
                        {{ apt.cancelledBy === 'admin' ? 'Cancelado Admin' : 'Cancelado Usuario' }}
                      </ng-container>
                      <ng-container *ngIf="apt.status === 'completed'">Realizado</ng-container>
                    </span>
                </td>
              </tr>
               <tr *ngIf="filteredHistory.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                      {{ searchTerm ? 'No se encontraron resultados.' : 'No hay historial disponible.' }}
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class AdminHistory implements OnInit {
    historyAppointments: AppointmentWithDetails[] = [];
    searchTerm: string = '';
    loading = true;

    constructor(
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
                    clientName: usersMap.get(apt.userId) || 'Desconocido'
                }));
            })
        ).subscribe({
            next: (processedAppointments) => {
                // GENERAL HISTORY (Completed or Cancelled - ANY Date)
                this.historyAppointments = processedAppointments
                    .filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
                    .sort((a, b) => {
                        // Date DESC (Newest first)
                        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                        if (dateDiff !== 0) return dateDiff;
                        // Time DESC
                        return b.timeSlot.localeCompare(a.timeSlot);
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

    get filteredHistory() {
        if (!this.searchTerm) return this.historyAppointments;
        const lowerTerm = this.searchTerm.toLowerCase();
        return this.historyAppointments.filter(apt =>
            apt.clientName?.toLowerCase().includes(lowerTerm) ||
            apt.motorcycle.licensePlate.toLowerCase().includes(lowerTerm)
        );
    }
}
