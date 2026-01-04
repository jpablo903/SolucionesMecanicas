import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Motorcycle, Service, TimeSlot, Appointment, ScheduleConfig } from '../dashboard.models';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin/admin.service'; // Reusing service for config fetch

@Component({
  selector: 'app-solicitar-turno',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './solicitar-turno.html',
  styleUrl: './solicitar-turno.css',
})
export class SolicitarTurno implements OnInit {
  motorcycles: Motorcycle[] = [];
  loadingMotos = true;

  services: Service[] = [
    { id: '1', name: 'Service Oficial', description: 'Mantenimiento preventivo según kilometraje.', price: 45000, duration: '~2 hs', icon: 'build' },
    { id: '2', name: 'Cambio de Aceite', description: 'Cambio de aceite y filtro + revisión básica.', price: 22000, duration: '~45 min', icon: 'oil_barrel' },
    { id: '3', name: 'Neumáticos', description: 'Cambio o reparación de cubiertas.', price: 0, duration: 'Variable', icon: 'tire_repair' },
    { id: '4', name: 'Revisión General', description: 'Chequeo de seguridad pre-viaje.', price: 15000, duration: '~1 h', icon: 'health_and_safety' }
  ];

  // Config State
  scheduleConfig: ScheduleConfig = { blockedDays: [], blockedHours: [], specificBlocks: [] };
  takenAppointments: Appointment[] = [];

  // Calendar data
  currentMonth: Date = new Date();
  today: Date = new Date();
  monthName: string = '';
  calendarDays: number[] = [];
  emptyDays: number[] = [];

  // Selected values
  selectedMotorcycleId: string = '';
  selectedMotorcycle: Motorcycle | null = null;
  selectedService: Service | null = null;
  selectedDate: number | null = null;
  selectedTime: string | null = null;

  // Time slots (base)
  availableTimeSlots: TimeSlot[] = [];

  // UI State
  confirmationMessage: string | null = null;
  currentUser: any = null;
  loadingConfig = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private adminService: AdminService, // Use AdminService to get config
    private cdr: ChangeDetectorRef
  ) {
    // Reset today's time to midnight for accurate comparison
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadMotorcycles();
    this.loadConfig();
    this.selectedService = this.services[0];
    this.updateCalendar();
  }

  loadConfig() {
    this.loadingConfig = true;
    this.adminService.getScheduleConfig().subscribe(config => {
      this.scheduleConfig = config;
      this.loadingConfig = false;
      this.cdr.detectChanges();
      // After config loads, we might need to re-validate selected date/time if user picked one
    });
  }

  loadAppointmentsForDate(date: Date) {
    const dateStr = this.formatDate(date);
    // Fetch appointments for this date
    this.http.get<Appointment[]>(`http://localhost:3000/appointments?date_like=${dateStr}&status_ne=cancelled`).subscribe(apts => {
      // Strict client-side filtering to prevent cross-day blocking issues
      this.takenAppointments = apts.filter(a => {
        const apptDateStr = this.formatDate(new Date(a.date));
        return apptDateStr === dateStr;
      });
      this.generateTimeSlots(date);
      this.cdr.detectChanges();
    });
  }

  loadMotorcycles() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.loadingMotos = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<Motorcycle[]>(`http://localhost:3000/motorcycles?userId=${userId}`).subscribe({
      next: (motos) => {
        this.motorcycles = motos;
        this.loadingMotos = false;
        if (motos.length > 0) {
          this.selectedMotorcycleId = motos[0].id;
          this.selectedMotorcycle = motos[0];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
        this.loadingMotos = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.monthName = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    this.emptyDays = Array(firstDay).fill(0);
    this.calendarDays = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  canGoPreviousMonth(): boolean {
    const prevMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    const today = new Date();
    today.setDate(1);
    return prevMonth >= today;
  }

  selectMotorcycle(event: any) {
    const id = event.target.value;
    if (id === 'add') {
      this.router.navigate(['/dashboard/moto']);
      return;
    }
    this.selectedMotorcycleId = id;
    this.selectedMotorcycle = this.motorcycles.find(m => m.id === id) || null;
  }

  selectService(service: Service) {
    this.selectedService = service;
  }

  isServiceSelected(service: Service): boolean {
    return this.selectedService?.id === service.id;
  }

  previousMonth() {
    if (this.canGoPreviousMonth()) {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
      this.updateCalendar();
    }
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateCalendar();
  }

  selectDate(day: number) {
    if (!this.isDayDisabled(day)) {
      this.selectedDate = day;
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      this.selectedTime = null; // Reset time
      this.loadAppointmentsForDate(date);
    }
  }

  isDateSelected(day: number): boolean {
    return this.selectedDate === day;
  }

  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  }

  isDayDisabled(day: number): boolean {
    const dateToCheck = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);

    // Past date check
    if (dateToCheck < this.today) return true;

    // Config block check
    const dateStr = this.formatDate(dateToCheck);
    if (this.scheduleConfig.blockedDays.includes(dateStr)) return true;

    return false;
  }

  generateTimeSlots(date: Date) {
    const dateStr = this.formatDate(date);
    // Base hours 07:00 to 21:00
    const hours = Array.from({ length: 15 }, (_, i) => {
      const h = i + 7;
      return `${h < 10 ? '0' + h : h}:00`;
    });

    this.availableTimeSlots = hours.map(h => {
      const rawHour = h.replace(':', '');
      let isAvailable = true;

      // Check Global Block
      if (this.scheduleConfig.blockedHours.includes(rawHour)) {
        isAvailable = false;
      }

      // Check Specific Block
      const specificBlock = this.scheduleConfig.specificBlocks?.find(b => b.date === dateStr);
      if (specificBlock && specificBlock.hours.includes(rawHour)) {
        isAvailable = false;
      }

      // Check Existing Appointments
      const taken = this.takenAppointments.find(a => a.timeSlot === h); // Assuming appointment stores '07:00' format? 
      // Wait, Appointment model says timeSlot: string. Admin layout stores '07:00' but checks '0700'.
      // My previous logic in AdminTurnos uses '07:00' for display and '0700' for storage comparison.
      // Let's ensure consistent format. Appointment.timeSlot should probably match the display format '07:00' OR raw.
      // SolicitarTurno.ts:42 used '08:00 AM'. It was inconsistent.
      // Let's standardise on '07:00' format for Apppointment.timeSlot.
      if (taken) isAvailable = false;

      return { time: h, available: isAvailable };
    });
  }

  getSelectedDateText(): string {
    if (!this.selectedDate) {
      return 'Selecciona una fecha';
    }
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.selectedDate);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${this.selectedDate} de ${months[date.getMonth()]}`;
  }

  selectTimeSlot(slot: TimeSlot) {
    if (slot.available) {
      this.selectedTime = slot.time;
    }
  }

  isTimeSelected(time: string): boolean {
    return this.selectedTime === time;
  }

  getTotalPrice(): number {
    return this.selectedService?.price || 0;
  }

  getFormattedPrice(price: number): string {
    return price > 0 ? `$${price.toLocaleString()}` : 'Consultar';
  }

  confirmAppointment() {
    if (this.currentUser && this.currentUser.active === false) {
      alert('Tu cuenta está restringida. No puedes solicitar nuevos turnos.');
      return;
    }

    if (!this.selectedMotorcycle || !this.selectedService || !this.selectedDate || !this.selectedTime) {
      alert('Por favor completa todos los campos');
      return;
    }

    const appointment: Appointment = {
      userId: localStorage.getItem('userId') || '',
      motorcycle: this.selectedMotorcycle!,
      service: this.selectedService,
      date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.selectedDate),
      timeSlot: this.selectedTime,
      totalPrice: this.getTotalPrice(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to API
    this.http.post('http://localhost:3000/appointments', appointment).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/turnos'], {
          state: { message: '¡Turno confirmado exitosamente! Te enviaremos un recordatorio por email.' }
        });
      },
      error: (err) => {
        console.error('Error creating appointment', err);
        alert('Hubo un error al confirmar el turno. Por favor intenta nuevamente.');
      }
    });
  }
}
