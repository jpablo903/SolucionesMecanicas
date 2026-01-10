import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { ScheduleConfig } from '../../dashboard/dashboard.models';

@Component({
    selector: 'app-admin-turnos',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mx-auto pb-10">
        <h2 class="text-3xl font-bold mb-6 text-white">Gestión de Turnos y Horarios</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Calendar Management -->
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 class="text-xl font-bold mb-4 flex items-center text-blue-400">
                    <span class="material-symbols-outlined mr-2">calendar_month</span>
                    Disponibilidad por Días
                </h3>
                <p class="text-gray-400 text-sm mb-4">Click en un día para gestionar sus horarios o bloquearlo completamente.</p>
                
                <div class="flex justify-between items-center mb-4 text-white">
                    <button (click)="changeMonth(-1)" class="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span class="font-bold text-lg capitalize">{{ currentMonthName }} {{ currentYear }}</span>
                    <button (click)="changeMonth(1)" class="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center text-sm">
                    <div *ngFor="let day of weekDays" class="font-medium text-gray-500 py-2">{{ day }}</div>
                    <div *ngFor="let blank of blankDays" class="py-2"></div>
                    <div *ngFor="let day of daysInMonth" 
                        (click)="selectDay(day)"
                        class="py-2 rounded cursor-pointer transition-all relative"
                        [ngClass]="{
                            'bg-red-900/40 text-red-400 border border-red-800': isDayGloballyBlocked(day),
                            'bg-blue-600 text-white': isSelectedDay(day),
                            'hover:bg-gray-700 text-gray-300': !isDayGloballyBlocked(day) && !isSelectedDay(day),
                            'border border-blue-500': isToday(day)
                        }">
                        {{ day }}
                        <div *ngIf="isDayGloballyBlocked(day)" class="absolute top-0 right-0 -mt-1 -mr-1">
                            <span class="material-symbols-outlined text-xs">block</span>
                        </div>
                        <div *ngIf="hasSpecificBlocks(day) && !isDayGloballyBlocked(day)" class="absolute bottom-0 right-0 mb-1 mr-1 h-2 w-2 rounded-full bg-orange-400"></div>
                    </div>
                </div>
            </div>

            <!-- Hours Management -->
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <div *ngIf="selectedDate; else globalConfigMode">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold flex items-center text-blue-400">
                            <span class="material-symbols-outlined mr-2">schedule</span>
                            Horarios del {{ selectedDate | date:'shortDate' }}
                        </h3>
                        <button (click)="clearSelection()" class="text-sm text-gray-400 hover:text-white underline">
                            Volver a Global
                        </button>
                    </div>

                    <div class="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                         <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" 
                                [checked]="isDayGloballyBlocked(selectedDayNum!)" 
                                (change)="toggleDayBlock(selectedDayNum!)"
                                class="form-checkbox h-5 w-5 text-red-600 rounded border-gray-600 bg-gray-700 focus:ring-red-500">
                            <span class="text-gray-200 font-medium">Bloquear TODO el día</span>
                         </label>
                         <p class="text-xs text-gray-500 mt-2 ml-8">Esto cancelará todos los turnos de este día.</p>
                    </div>

                    <div *ngIf="!isDayGloballyBlocked(selectedDayNum!)">
                        <p class="text-gray-400 text-sm mb-4">Bloquea horarios específicos SOLO para este día.</p>
                         <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            <button *ngFor="let hour of availableHours" 
                                (click)="toggleSpecificHour(hour)"
                                class="py-2 px-3 rounded-lg text-sm font-medium transition-all shadow-sm border"
                                [ngClass]="{
                                    'bg-red-900/30 border-red-800 text-red-400': isSpecificHourBlocked(hour),
                                    'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500': !isSpecificHourBlocked(hour)
                                }">
                                <div class="flex items-center justify-center">
                                    {{ hour }}
                                    <span *ngIf="isSpecificHourBlocked(hour)" class="material-symbols-outlined text-sm ml-1">block</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <ng-template #globalConfigMode>
                    <h3 class="text-xl font-bold mb-4 flex items-center text-orange-400">
                        <span class="material-symbols-outlined mr-2">settings</span>
                        Configuración Global Semanal
                    </h3>
                    <p class="text-gray-400 text-sm mb-4">Los bloqueos aquí se aplican a <strong>TODOS</strong> los días (ej. Almuerzo).</p>
                    
                    <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <button *ngFor="let hour of availableHours" 
                            (click)="toggleGlobalHour(hour)"
                            class="py-2 px-3 rounded-lg text-sm font-medium transition-all shadow-sm border"
                            [ngClass]="{
                                'bg-red-900/30 border-red-800 text-red-400': isGlobalHourBlocked(hour),
                                'bg-gray-700 border-gray-600 text-gray-300 hover:border-orange-500': !isGlobalHourBlocked(hour)
                            }">
                            <div class="flex items-center justify-center">
                                {{ hour }}
                                <span *ngIf="isGlobalHourBlocked(hour)" class="material-symbols-outlined text-sm ml-1">block</span>
                            </div>
                        </button>
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
    `
})
export class AdminTurnos implements OnInit {
    scheduleConfig: ScheduleConfig = { blockedDays: [], blockedHours: [], specificBlocks: [] };

    currentDate = new Date();
    currentMonth = this.currentDate.getMonth();
    currentYear = this.currentDate.getFullYear();

    selectedDate: Date | null = null;
    selectedDayNum: number | null = null;

    weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    availableHours = Array.from({ length: 15 }, (_, i) => {
        const h = i + 7; // Start at 7
        return `${h < 10 ? '0' + h : h}:00`;
    }); // 07:00 to 21:00

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadConfig();
    }

    loadConfig(): void {
        this.adminService.getScheduleConfig().subscribe({
            next: (config) => {
                this.scheduleConfig = {
                    blockedDays: config.blockedDays || [],
                    blockedHours: config.blockedHours || [],
                    specificBlocks: config.specificBlocks || []
                };
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading config', err)
        });
    }

    get currentMonthName(): string {
        return new Date(this.currentYear, this.currentMonth).toLocaleString('es-ES', { month: 'long' });
    }

    get daysInMonth(): number[] {
        const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    }

    get blankDays(): number[] {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        return Array.from({ length: firstDay }, (_, i) => i);
    }

    changeMonth(delta: number): void {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.clearSelection();
    }

    isToday(day: number): boolean {
        const today = new Date();
        return day === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
    }

    configDate(day: number): string {
        const d = new Date(this.currentYear, this.currentMonth, day);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    }

    // Selection Logic
    selectDay(day: number): void {
        this.selectedDayNum = day;
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    }

    isSelectedDay(day: number): boolean {
        return this.selectedDayNum === day;
    }

    clearSelection(): void {
        this.selectedDate = null;
        this.selectedDayNum = null;
    }

    // Logic for Global Blocks
    isDayGloballyBlocked(day: number): boolean {
        const dateStr = this.configDate(day);
        return this.scheduleConfig.blockedDays.includes(dateStr);
    }

    toggleDayBlock(day: number): void {
        const dateStr = this.configDate(day);
        const index = this.scheduleConfig.blockedDays.indexOf(dateStr);

        if (index > -1) {
            this.scheduleConfig.blockedDays.splice(index, 1);
        } else {
            this.scheduleConfig.blockedDays.push(dateStr);
            this.cancelDayAppointments(dateStr); // Auto-Cancel logic
        }
        this.saveConfig();
        // Force refresh specific blocks if switching back
        if (!this.scheduleConfig.specificBlocks) this.scheduleConfig.specificBlocks = [];
    }

    isGlobalHourBlocked(hour: string): boolean {
        const storedFormat = hour.replace(':', '');
        return this.scheduleConfig.blockedHours.includes(storedFormat);
    }

    toggleGlobalHour(hour: string): void {
        const storedFormat = hour.replace(':', '');
        const index = this.scheduleConfig.blockedHours.indexOf(storedFormat);

        if (index > -1) {
            this.scheduleConfig.blockedHours.splice(index, 1);
        } else {
            this.scheduleConfig.blockedHours.push(storedFormat);
            // Warning: Global block cancels FUTURE appointments for this slot on ALL days?
            // User requirement: "si ... el admin cancela un horario ... la misma si cancela un horario y ya habia un turno en ese horario."
            // Yes, imply global block affects all future.
            this.cancelGlobalHourAppointments(storedFormat);
        }
        this.saveConfig();
    }

    // Logic for Specific Blocks
    getSpecificBlock(dateStr: string) {
        return this.scheduleConfig.specificBlocks.find(b => b.date === dateStr);
    }

    hasSpecificBlocks(day: number): boolean {
        const dateStr = this.configDate(day);
        const block = this.getSpecificBlock(dateStr);
        return !!block && block.hours.length > 0;
    }

    isSpecificHourBlocked(hour: string): boolean {
        if (!this.selectedDayNum) return false;
        if (this.isGlobalHourBlocked(hour)) return true; // Visual inheritance

        const dateStr = this.configDate(this.selectedDayNum);
        const block = this.getSpecificBlock(dateStr);
        const storedFormat = hour.replace(':', '');
        return block ? block.hours.includes(storedFormat) : false;
    }

    toggleSpecificHour(hour: string): void {
        if (!this.selectedDayNum) return;
        const dateStr = this.configDate(this.selectedDayNum);
        const storedFormat = hour.replace(':', '');

        // Use global block if possible? No, specific overrides or adds to?
        // If global is set, we can't unset it specifically here (simple implementation).
        if (this.isGlobalHourBlocked(hour)) {
            alert('Este horario está bloqueado globalmente.');
            return;
        }

        let block = this.getSpecificBlock(dateStr);
        if (!block) {
            block = { date: dateStr, hours: [] };
            this.scheduleConfig.specificBlocks.push(block);
        }

        const index = block.hours.indexOf(storedFormat);
        if (index > -1) {
            block.hours.splice(index, 1);
        } else {
            block.hours.push(storedFormat);
            this.cancelSpecificAppointment(dateStr, storedFormat);
        }

        // Cleanup empty blocks
        if (block.hours.length === 0) {
            this.scheduleConfig.specificBlocks = this.scheduleConfig.specificBlocks.filter(b => b.date !== dateStr);
        }

        this.saveConfig();
    }


    // --- Cancellation Logic ---

    cancelDayAppointments(dateStr: string) {
        this.adminService.getAppointments().subscribe(apts => {
            const toCancel = apts.filter(a =>
                (a.status === 'pending' || a.status === 'confirmed') &&
                new Date(a.date).toISOString().startsWith(dateStr) // Simple date match
            );
            if (toCancel.length > 0) {
                this.adminService.cancelMultipleAppointments(toCancel.map(a => a.id).filter((id): id is string => !!id)).subscribe({
                    next: () => alert(`Se han cancelado ${toCancel.length} turnos para el día ${dateStr}.`),
                    error: (e) => console.error(e)
                });
            }
        });
    }

    cancelGlobalHourAppointments(timeSlot: string) {
        // Need to cancel all future appointments in this slot
        this.adminService.getAppointments().subscribe(apts => {
            const today = new Date();
            const toCancel = apts.filter(a =>
                (a.status === 'pending' || a.status === 'confirmed') &&
                a.timeSlot.replace(':', '') === timeSlot && // Compare normalized
                new Date(a.date) >= today
            );

            if (toCancel.length > 0) {
                if (confirm(`Bloquear este horario globalmente cancelará ${toCancel.length} turnos existentes. ¿Continuar?`)) {
                    this.adminService.cancelMultipleAppointments(toCancel.map(a => a.id).filter((id): id is string => !!id)).subscribe({
                        next: () => console.log('Turnos cancelados'),
                        error: (e) => console.error(e)
                    });
                }
            }
        });
    }

    cancelSpecificAppointment(dateStr: string, timeSlot: string) {
        this.adminService.getAppointments().subscribe(apts => {
            const toCancel = apts.filter(a =>
                (a.status === 'pending' || a.status === 'confirmed') &&
                new Date(a.date).toISOString().startsWith(dateStr) &&
                a.timeSlot.replace(':', '') === timeSlot // Compare normalized '1400' with '1400'
            );
            if (toCancel.length > 0) {
                this.adminService.cancelMultipleAppointments(toCancel.map(a => a.id).filter((id): id is string => !!id)).subscribe({
                    next: () => alert(`Se ha cancelado el turno existente para este horario.`),
                    error: (e) => console.error(e)
                });
            }
        });
    }

    saveConfig(): void {
        this.adminService.updateScheduleConfig(this.scheduleConfig).subscribe({
            next: () => console.log('Config saved'),
            error: (err) => console.error('Error saving config', err)
        });
    }
}
