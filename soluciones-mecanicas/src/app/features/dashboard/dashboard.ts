import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motorcycle, Service, TimeSlot, Appointment } from './dashboard.models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Mock Data
  motorcycles: Motorcycle[] = [
    {
      id: '1',
      brand: 'Honda',
      model: 'CB500F',
      year: 2021,
      licensePlate: 'AB 123 CD',
      displayName: 'Honda CB500F (2021) - AB 123 CD'
    },
    {
      id: '2',
      brand: 'Yamaha',
      model: 'MT-03',
      year: 2019,
      licensePlate: 'JK 999 LM',
      displayName: 'Yamaha MT-03 (2019) - JK 999 LM'
    }
  ];

  services: Service[] = [
    { id: '1', name: 'Service Oficial', description: 'Mantenimiento preventivo según kilometraje.', price: 45000, duration: '~2 hs', icon: 'build' },
    { id: '2', name: 'Cambio de Aceite', description: 'Cambio de aceite y filtro + revisión básica.', price: 22000, duration: '~45 min', icon: 'oil_barrel' },
    { id: '3', name: 'Neumáticos', description: 'Cambio o reparación de cubiertas.', price: 0, duration: 'Variable', icon: 'tire_repair' },
    { id: '4', name: 'Revisión General', description: 'Chequeo de seguridad pre-viaje.', price: 15000, duration: '~1 h', icon: 'health_and_safety' }
  ];

  // Calendar data
  currentMonth: Date = new Date(2023, 9, 1); // October 2023
  monthName: string = '';
  calendarDays: number[] = [];

  // Selected values
  selectedMotorcycleId: string = '1';
  selectedMotorcycle: Motorcycle | null = null;
  selectedService: Service | null = null;
  selectedDate: number | null = 14; //Default selected day
  selectedTime: string | null = '10:00 AM';

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

  ngOnInit() {
    // Initialize default selections
    this.selectedMotorcycle = this.motorcycles[0];
    this.selectedService = this.services[0];

    this.updateCalendar();
  }

  updateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Get month name in Spanish
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.monthName = `${months[month]} ${year}`;

    // Generate calendar days (simplified - just numbers for October)
    this.calendarDays = Array.from({ length: 19 }, (_, i) => i + 2);
  }

  selectMotorcycle(event: any) {
    const id = event.target.value;
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
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateCalendar();
  }

  selectDate(day: number) {
    this.selectedDate = day;
  }

  isDateSelected(day: number): boolean {
    return this.selectedDate === day;
  }

  isDayDisabled(day: number): boolean {
    // Disable weekends (days 5, 6, 12, 13, 19)
    return [5, 6, 12, 13, 19].includes(day);
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
      motorcycle: this.selectedMotorcycle,
      service: this.selectedService,
      date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.selectedDate),
      timeSlot: this.selectedTime,
      totalPrice: this.getTotalPrice()
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    this.confirmationMessage = '¡Turno confirmado exitosamente! Te enviaremos un recordatorio por email.';

    // Clear message after 5 seconds
    setTimeout(() => {
      this.confirmationMessage = null;
    }, 5000);
  }
}
