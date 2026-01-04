import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth.service';
import { User, Appointment } from '../dashboard.models';

@Component({
    selector: 'app-historial',
    imports: [CommonModule],
    templateUrl: './historial.html',
    styleUrl: './historial.css',
})
export class Historial implements OnInit {
    currentUser: User | null = null;
    historyAppointments: Appointment[] = [];
    loading = true;

    filterStatus: 'all' | 'completed' | 'cancelled' = 'all';

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.loadHistory();
            } else {
                this.loading = false;
            }
        });
    }

    loadHistory() {
        if (!this.currentUser) return;
        this.loading = true;
        this.http.get<Appointment[]>(`http://localhost:3000/appointments?userId=${this.currentUser.id}`).subscribe({
            next: (apts) => {
                this.historyAppointments = apts
                    .filter(a => a.status === 'completed' || a.status === 'cancelled')
                    .sort((a, b) => {
                        // Date Descending (Newest first)
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading history', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    get filteredAppointments() {
        if (this.filterStatus === 'all') {
            return this.historyAppointments;
        }
        return this.historyAppointments.filter(apt => apt.status === this.filterStatus);
    }

    setFilter(status: 'all' | 'completed' | 'cancelled') {
        this.filterStatus = status;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    }

    getStatusText(appointment: Appointment): string {
        switch (appointment.status) {
            case 'completed': return 'Realizado';
            case 'cancelled':
                return appointment.cancelledBy === 'admin' ? 'Cancelado por Administración' : 'Cancelado';
            default: return appointment.status;
        }
    }

    formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('es-AR', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getFormattedPrice(price: number): string {
        return price > 0 ? `$${price.toLocaleString()}` : 'Consultar';
    }
}
