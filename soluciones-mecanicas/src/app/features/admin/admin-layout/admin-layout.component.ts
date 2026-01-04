import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-900 text-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 border-r border-gray-700 shadow-xl hidden md:flex flex-col">
        <div class="p-6 border-b border-gray-700">
          <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
          <p class="text-sm text-gray-400">Soluciones Mecánicas</p>
        </div>
        
        <nav class="flex-1 p-4 space-y-2">
          <a routerLink="/admin" routerLinkActive="bg-blue-600/20 text-blue-400" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined mr-3">dashboard</span>
            <span class="font-medium">Panel Principal</span>
          </a>

          <a routerLink="/admin/turnos" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined mr-3">calendar_month</span>
            <span class="font-medium">Turnos & Horarios</span>
          </a>
          
          <a routerLink="/admin/clientes" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined mr-3">group</span>
            <span class="font-medium">Clientes</span>
          </a>
          
          <a routerLink="/admin/motos" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined mr-3">two_wheeler</span>
            <span class="font-medium">Motos</span>
          </a>

          <a routerLink="/admin/historial" routerLinkActive="bg-blue-600/20 text-blue-400" class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors group">
            <span class="material-symbols-outlined mr-3">history</span>
            <span class="font-medium">Historial</span>
          </a>
        </nav>

        <div class="p-4 border-t border-gray-700">
          <a routerLink="/dashboard" class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <span class="material-symbols-outlined mr-3">logout</span>
            <span class="font-medium">Salir al Sitio</span>
          </a>
        </div>
      </aside>

      <!-- Mobile Header (Visible only on small screens) -->
      <div class="md:hidden fixed top-0 w-full bg-gray-800 shadow-sm z-10 p-4 flex justify-between items-center text-white">
         <h1 class="text-xl font-bold">Admin</h1>
         <!-- Mobile menu button could go here -->
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 bg-gray-900">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayout { }
