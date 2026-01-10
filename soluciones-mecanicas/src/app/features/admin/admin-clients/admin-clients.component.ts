import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../admin.service';
import { User, Motorcycle } from '../../dashboard/dashboard.models';
import { map, forkJoin } from 'rxjs';

@Component({
    selector: 'app-admin-clients',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 class="text-3xl font-bold text-white flex items-center">
                <span class="material-symbols-outlined mr-3 text-4xl">group</span>
                Administrar Clientes
            </h2>
            
            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por correo o teléfono..." 
                    class="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-lg">
            </div>
        </div>
        
        <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-900">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-gray-800 divide-y divide-gray-700">
                        <ng-container *ngFor="let client of filteredClients">
                            <!-- Client Row -->
                            <tr [class.bg-red-900-20]="!client.active" class="hover:bg-gray-700/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <button (click)="toggleExpand(client.id)" class="text-gray-400 hover:text-white transition-colors">
                                        <span class="material-symbols-outlined transition-transform duration-200" 
                                              [class.rotate-90]="isExpanded(client.id)">
                                            chevron_right
                                        </span>
                                    </button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <div class="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-800">
                                                {{ client.firstName.charAt(0) }}{{ client.lastName.charAt(0) }}
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-200">{{ client.firstName }} {{ client.lastName }}</div>
                                            <div class="text-xs text-gray-500">Registrado: {{ client.createdAt | date:'shortDate' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {{ client.email }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {{ client.phone || 'No registrado' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                        [ngClass]="client.active ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'">
                                        {{ client.active ? 'Activo' : 'Inactivo' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button (click)="toggleStatus(client)" 
                                        class="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                        {{ client.active ? 'Desactivar' : 'Activar' }}
                                    </button>
                                </td>
                            </tr>
                            
                            <!-- Expanded Motos Row -->
                            <tr *ngIf="isExpanded(client.id)" class="bg-gray-900/50">
                                <td colspan="6" class="px-6 py-4">
                                    <div class="ml-12 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                        <h4 class="text-sm font-bold text-gray-300 mb-3 flex items-center">
                                            <span class="material-symbols-outlined text-lg mr-2">two_wheeler</span>
                                            Motos de {{ client.firstName }}
                                        </h4>
                                        
                                        <div *ngIf="getClientMotos(client.id).length > 0; else noMotos" class="space-y-2">
                                            <div *ngFor="let moto of getClientMotos(client.id)" 
                                                class="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700 hover:border-blue-500/50 transition-colors">
                                                <div>
                                                    <p class="text-sm font-medium text-gray-200">{{ moto.brand }} {{ moto.model }} {{ moto.version }}</p>
                                                    <p class="text-xs text-gray-500">{{ moto.licensePlate }} • {{ moto.year }}</p>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="text-xs px-2 py-1 rounded-full"
                                                        [ngClass]="moto.active !== false ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'">
                                                        {{ moto.active !== false ? 'Activa' : 'Inactiva' }}
                                                    </span>
                                                    <button (click)="toggleMotoStatus(moto)" 
                                                        class="text-xs text-gray-400 hover:text-white underline">
                                                        {{ moto.active !== false ? 'Desactivar' : 'Activar' }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <ng-template #noMotos>
                                            <p class="text-sm text-gray-500 italic">Este cliente no tiene motos registradas.</p>
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                        </ng-container>

                        <tr *ngIf="filteredClients.length === 0">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                {{ searchTerm ? 'No se encontraron clientes con ese criterio.' : 'No se encontraron clientes.' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .rotate-90 { transform: rotate(90deg); }
        .bg-red-900-20 { background-color: rgba(127, 29, 29, 0.2); }
    `]
})
export class AdminClients implements OnInit {
    clients: User[] = [];
    allMotos: Motorcycle[] = [];
    expandedClientIds: Set<string> = new Set();
    isLoading = true;
    searchTerm = '';

    get filteredClients(): User[] {
        if (!this.searchTerm.trim()) {
            return this.clients;
        }
        const term = this.searchTerm.toLowerCase().trim();
        return this.clients.filter(client =>
            client.email.toLowerCase().includes(term) ||
            (client.phone && client.phone.toLowerCase().includes(term))
        );
    }

    constructor(
        private authService: AuthService,
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        forkJoin({
            users: this.authService.getAllUsers().pipe(map(users => users.filter(u => u.role !== 'admin'))),
            motos: this.adminService.getAllMotos()
        }).subscribe({
            next: (data) => {
                this.clients = data.users;
                this.allMotos = data.motos;
                this.isLoading = false;
                this.cdr.detectChanges(); // Force update to prevent "double click" issue
            },
            error: (err) => {
                console.error('Error loading data', err);
                this.isLoading = false;
            }
        });
    }

    toggleExpand(clientId: string): void {
        if (this.expandedClientIds.has(clientId)) {
            this.expandedClientIds.delete(clientId);
        } else {
            this.expandedClientIds.add(clientId);
        }
    }

    isExpanded(clientId: string): boolean {
        return this.expandedClientIds.has(clientId);
    }

    getClientMotos(userId: string): Motorcycle[] {
        return this.allMotos.filter(m => m.userId === userId);
    }

    toggleStatus(client: User): void {
        const newStatus = !client.active;
        if (confirm(`¿Estás seguro de que deseas ${newStatus ? 'activar' : 'desactivar'} a ${client.firstName}?`)) {
            this.authService.updateUserStatus(client.id, newStatus).subscribe({
                next: (updatedClient) => {
                    const index = this.clients.findIndex(c => c.id === updatedClient.id);
                    if (index !== -1) {
                        this.clients[index] = updatedClient;
                        this.cdr.detectChanges();
                    }
                },
                error: (err) => console.error('Error updating status', err)
            });
        }
    }

    toggleMotoStatus(moto: Motorcycle): void {
        const newStatus = moto.active === false;
        const updatedMoto = { ...moto, active: newStatus };

        this.adminService.updateMoto(updatedMoto).subscribe({
            next: (res) => {
                const index = this.allMotos.findIndex(m => m.id === res.id);
                if (index !== -1) {
                    this.allMotos[index] = res;
                    this.cdr.detectChanges();
                }
            },
            error: (err) => console.error('Error updating moto status', err)
        });
    }
}
