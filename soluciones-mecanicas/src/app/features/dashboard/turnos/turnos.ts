import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth.service';
import { User, Appointment } from '../dashboard.models';
import { AdminService } from '../../admin/admin.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-turnos',
    imports: [CommonModule, RouterLink],
    templateUrl: './turnos.html',
    styleUrl: './turnos.css',
})
export class Turnos implements OnInit {
    currentUser: User | null = null;
    appointments: Appointment[] = [];
    successMessage: string | null = null;
    loading = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
        private adminService: AdminService, // Note: We might need to make AdminService public or duplicate logic if modularity is strict.
        // Assuming AdminService is provided in root, it should be accessible.
        private cdr: ChangeDetectorRef
    ) {
        // Check for success message from navigation state
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['message']) {
            this.successMessage = navigation.extras.state['message'];
            // Clear message after 5 seconds
            setTimeout(() => {
                this.successMessage = null;
                this.cdr.detectChanges();
            }, 5000);
        }
    }

    ngOnInit() {
        // Trigger absent check logic
        this.adminService.checkAbsentAppointments().subscribe(() => {
            // Get current user
            this.authService.currentUser$.subscribe(user => {
                this.currentUser = user;
                if (user) {
                    this.loadAppointments();
                } else {
                    this.loading = false;
                }
            });
        });
    }

    loadAppointments() {
        if (!this.currentUser) return;
        this.loading = true;
        this.http.get<Appointment[]>(`http://localhost:3000/appointments?userId=${this.currentUser.id}`).subscribe({
            next: (apts) => {
                this.appointments = apts
                    .filter(a => a.status === 'pending' || a.status === 'confirmed')
                    .sort((a, b) => {
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading appointments', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    cancelAppointment(appointment: Appointment) {
        Swal.fire({
            title: '¿Cancelar turno?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // red-500
            cancelButtonColor: '#3b82f6', // blue-500
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Volver',
            background: '#1f2937', // gray-800
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                // Optimistic update
                const originalStatus = appointment.status;
                appointment.status = 'cancelled';

                this.http.patch(`http://localhost:3000/appointments/${appointment.id}`, { status: 'cancelled', cancelledBy: 'client' }).subscribe({
                    next: () => {
                        this.cdr.detectChanges();
                        Swal.fire({
                            title: 'Cancelado',
                            text: 'El turno ha sido cancelado.',
                            icon: 'success',
                            background: '#1f2937',
                            color: '#fff',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: (err) => {
                        console.error('Error cancelling', err);
                        // Revert
                        appointment.status = originalStatus;
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo cancelar el turno.',
                            icon: 'error',
                            background: '#1f2937',
                            color: '#fff'
                        });
                        this.cdr.detectChanges();
                    }
                });
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    }

    getStatusText(appointment: Appointment): string {
        switch (appointment.status) {
            case 'confirmed': return 'Confirmado';
            case 'pending': return 'Pendiente';
            case 'cancelled':
                return appointment.cancelledBy === 'admin' ? 'Cancelado por Administración' : 'Cancelado';
            case 'completed': return 'Realizado';
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
