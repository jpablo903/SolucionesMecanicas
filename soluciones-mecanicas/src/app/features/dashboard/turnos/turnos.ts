import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { User, Appointment } from '../dashboard.models';

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

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // Check for success message from navigation state
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['message']) {
            this.successMessage = navigation.extras.state['message'];
            // Clear message after 5 seconds
            setTimeout(() => this.successMessage = null, 5000);
        }
    }

    ngOnInit() {
        // Get current user
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.loadAppointments();
            }
        });
    }

    loadAppointments() {
        // Load appointments from localStorage (filtered by userId)
        const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
        this.appointments = allAppointments.filter(apt => apt.userId === this.currentUser?.id);
    }

    cancelAppointment(index: number) {
        if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
            this.appointments[index].status = 'cancelled';
            // Update localStorage
            const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
            const globalIndex = allAppointments.findIndex(apt =>
                apt.userId === this.currentUser?.id &&
                apt.date === this.appointments[index].date &&
                apt.timeSlot === this.appointments[index].timeSlot
            );
            if (globalIndex !== -1) {
                allAppointments[globalIndex].status = 'cancelled';
                localStorage.setItem('appointments', JSON.stringify(allAppointments));
            }
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'confirmed': return 'Confirmado';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    }

    formatDate(date: Date): string {
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
