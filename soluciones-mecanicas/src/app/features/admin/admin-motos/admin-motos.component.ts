import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Motorcycle } from '../../dashboard/dashboard.models';

@Component({
    selector: 'app-admin-motos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 class="text-3xl font-bold text-white flex items-center">
                <span class="material-symbols-outlined mr-3 text-4xl">two_wheeler</span>
                Administrar Motos
            </h2>
            
            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por patente..." 
                    class="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-lg">
            </div>
        </div>
        
        <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-900">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Foto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca/Modelo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Patente</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Año</th>
                             <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-gray-800 divide-y divide-gray-700">
                        <tr *ngFor="let moto of filteredMotos" class="hover:bg-gray-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                    <span class="material-symbols-outlined">two_wheeler</span>
                                </div>
                            </td>
                            
                            <!-- Editing Mode -->
                            <ng-container *ngIf="editingId === moto.id; else displayMode">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex gap-2">
                                        <input [(ngModel)]="editingMoto!.brand" class="w-24 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none" placeholder="Marca">
                                        <input [(ngModel)]="editingMoto!.model" class="w-24 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none" placeholder="Modelo">
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input [(ngModel)]="editingMoto!.licensePlate" class="w-24 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input [(ngModel)]="editingMoto!.year" type="number" class="w-20 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                     <!-- Status not editable here, use toggle -->
                                     <span class="text-gray-500 text-xs">--</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button (click)="saveEdit()" class="text-green-400 hover:text-green-300 mr-3">
                                        <span class="material-symbols-outlined">check</span>
                                    </button>
                                    <button (click)="cancelEdit()" class="text-red-400 hover:text-red-300">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </td>
                            </ng-container>

                            <!-- Display Mode -->
                            <ng-template #displayMode>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                    {{ moto.brand }} {{ moto.model }}  <span class="text-gray-500 text-xs ml-1">{{ moto.version }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                    {{ moto.licensePlate }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {{ moto.year }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                        [ngClass]="moto.active !== false ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'">
                                        {{ moto.active !== false ? 'Activa' : 'Inactiva' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button (click)="startEdit(moto)" class="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                                        <span class="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button (click)="toggleStatus(moto)" 
                                        class="text-gray-400 hover:text-white transition-colors"
                                        [title]="moto.active !== false ? 'Desactivar' : 'Activar'">
                                        <span class="material-symbols-outlined text-lg">
                                            {{ moto.active !== false ? 'block' : 'check_circle' }}
                                        </span>
                                    </button>
                                </td>
                            </ng-template>
                        </tr>
                    </tbody>
                </table>
                <div *ngIf="filteredMotos.length === 0" class="px-6 py-4 text-center text-gray-500">
                    {{ searchTerm ? 'No se encontraron motos con esa patente.' : 'No hay motos registradas.' }}
                </div>
            </div>
        </div>
    </div>
    `
})
export class AdminMotos implements OnInit {
    motos: Motorcycle[] = [];
    editingId: string | null = null;
    editingMoto: Motorcycle | null = null;
    originalMoto: Motorcycle | null = null;
    searchTerm = '';

    get filteredMotos(): Motorcycle[] {
        if (!this.searchTerm.trim()) {
            return this.motos;
        }
        const term = this.searchTerm.toLowerCase().trim();
        return this.motos.filter(moto =>
            moto.licensePlate.toLowerCase().includes(term)
        );
    }

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadMotos();
    }

    loadMotos(): void {
        this.adminService.getAllMotos().subscribe({
            next: (data) => {
                this.motos = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading motos', err)
        });
    }

    startEdit(moto: Motorcycle): void {
        this.editingId = moto.id;
        this.editingMoto = { ...moto };
        this.originalMoto = { ...moto };
    }

    cancelEdit(): void {
        this.editingId = null;
        this.editingMoto = null;
        this.originalMoto = null;
    }

    saveEdit(): void {
        if (!this.editingMoto) return;

        // Basic duplicate check if license plate changed
        if (this.originalMoto && this.editingMoto.licensePlate !== this.originalMoto.licensePlate) {
            this.adminService.checkPatentUnique(this.editingMoto.licensePlate).subscribe(duplicates => {
                if (duplicates.length > 0) {
                    alert('Ya existe una moto con esa patente.');
                    return;
                }
                this.finalizeSave();
            });
        } else {
            this.finalizeSave();
        }
    }

    finalizeSave(): void {
        this.adminService.updateMoto(this.editingMoto!).subscribe({
            next: (updatedMoto) => {
                const index = this.motos.findIndex(m => m.id === updatedMoto.id);
                if (index !== -1) {
                    this.motos[index] = updatedMoto;
                }
                this.editingId = null;
                this.editingMoto = null;
                this.originalMoto = null;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error updating moto', err)
        });
    }

    toggleStatus(moto: Motorcycle): void {
        const newStatus = moto.active === false;
        const updatedMoto = { ...moto, active: newStatus };

        this.adminService.updateMoto(updatedMoto).subscribe({
            next: (res) => {
                const index = this.motos.findIndex(m => m.id === res.id);
                if (index !== -1) {
                    this.motos[index] = res;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error updating status', err)
        });
    }
}
