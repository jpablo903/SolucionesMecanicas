import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { User } from './dashboard.models';

@Component({
    selector: 'app-dashboard-layout',
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {
    sidebarOpen = true;
    currentUser: User | null = null;

    menuItems = [
        { path: '/dashboard/turnos', label: 'Turnos', icon: 'calendar_month' },
        { path: '/dashboard/moto', label: 'Moto', icon: 'two_wheeler' },
        { path: '/dashboard/historial', label: 'Historial', icon: 'receipt_long' },
        { path: '/dashboard/config', label: 'Configuración', icon: 'settings' }
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // Subscribe to current user
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
