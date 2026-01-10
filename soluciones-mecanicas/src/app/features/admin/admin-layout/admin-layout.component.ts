import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <!-- Sidebar -->
      <aside [class.w-64]="sidebarOpen" [class.w-20]="!sidebarOpen"
        class="admin-sidebar bg-gray-800 border-r border-gray-700 shadow-xl flex flex-col transition-all duration-300 ease-in-out">
        <div class="p-6 border-b border-gray-700">
          <h1 class="text-2xl font-bold text-white" *ngIf="sidebarOpen">Admin Panel</h1>
          <h1 class="text-lg font-bold text-white text-center" *ngIf="!sidebarOpen">AP</h1>
          <p class="text-sm text-gray-400" *ngIf="sidebarOpen">Soluciones Mecánicas</p>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a routerLink="/admin" routerLinkActive="bg-blue-600/20 text-blue-400" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">dashboard</span>
            <span class="font-medium" *ngIf="sidebarOpen">Panel Principal</span>
          </a>

          <a routerLink="/admin/turnos" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">calendar_month</span>
            <span class="font-medium" *ngIf="sidebarOpen">Turnos & Horarios</span>
          </a>
          
          <a routerLink="/admin/clientes" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">group</span>
            <span class="font-medium" *ngIf="sidebarOpen">Clientes</span>
          </a>
          
          <a routerLink="/admin/motos" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">two_wheeler</span>
            <span class="font-medium" *ngIf="sidebarOpen">Motos</span>
          </a>

          <a routerLink="/admin/historial" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">history</span>
            <span class="font-medium" *ngIf="sidebarOpen">Historial</span>
          </a>
        </nav>

        <div class="p-4 border-t border-gray-700">
          <a routerLink="/dashboard" class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <span class="material-symbols-outlined" [class.mr-3]="sidebarOpen">logout</span>
            <span class="font-medium" *ngIf="sidebarOpen">Salir al Sitio</span>
          </a>
        </div>

        <!-- Toggle Sidebar Button (Desktop) -->
        <button (click)="toggleSidebar()"
          class="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full items-center justify-center hover:bg-gray-700 transition-all">
          <span class="material-symbols-outlined text-sm text-gray-400">{{ sidebarOpen ? 'chevron_left' : 'chevron_right' }}</span>
        </button>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Header -->
        <header class="md:hidden h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <button (click)="toggleSidebar()" class="text-white">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <span class="text-white font-bold text-lg">Admin Panel</span>
          <div class="w-6"></div>
        </header>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-4 md:p-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="sidebarOpen" (click)="toggleSidebar()" class="md:hidden fixed inset-0 bg-black/50 z-40"></div>
    </div>
  `,
  styles: [`
    .admin-sidebar {
      position: relative;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 50;
        transform: translateX(-100%);
      }

      .admin-sidebar.w-64 {
        transform: translateX(0);
      }
    }
  `]
})
export class AdminLayout {
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

