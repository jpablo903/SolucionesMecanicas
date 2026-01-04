import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Motorcycle, Service, TimeSlot, Appointment } from '../dashboard.models';
import { AuthService } from '../../../auth.service';

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

  // Time slots
  timeSlots: TimeSlot[] = [
    { time: '08:00 AM', available: true },
    { time: '09:00 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '14:00 PM', available: true },
    { time: '15:30 PM', available: false }
  ];

  // UI State
  confirmationMessage: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Reset today's time to midnight for accurate comparison
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.loadMotorcycles();
    this.selectedService = this.services[0];
    this.updateCalendar();
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

    // Get month name in Spanish
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.monthName = `${months[month]} ${year}`;

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Create empty cells array for padding (before month starts)
    this.emptyDays = Array(firstDay).fill(0);

    // Generate calendar days
    this.calendarDays = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  canGoPreviousMonth(): boolean {
    const prevMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    const today = new Date();
    today.setDate(1); // Set to first day for month comparison
    return prevMonth >= today;
  }

  selectMotorcycle(event: any) {
    const id = event.target.value;

    // Check if user selected "add new motorcycle"
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
    }
  }

  isDateSelected(day: number): boolean {
    return this.selectedDate === day;
  }

  isDayDisabled(day: number): boolean {
    const dateToCheck = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < this.today;
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
    if (!this.selectedMotorcycle || !this.selectedService || !this.selectedDate || !this.selectedTime) {
      alert('Por favor completa todos los campos');
      return;
    }

    const appointment: Appointment = {
      userId: localStorage.getItem('userId') || '',
      motorcycle: this.selectedMotorcycle,
      service: this.selectedService,
      date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.selectedDate),
      timeSlot: this.selectedTime,
      totalPrice: this.getTotalPrice(),
      status: 'pending'
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Navigate to turnos page with success message
    this.router.navigate(['/dashboard/turnos'], {
      state: { message: '¡Turno confirmado exitosamente! Te enviaremos un recordatorio por email.' }
    });
  }
}
