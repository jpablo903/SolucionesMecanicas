import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth.service';
import { Motorcycle } from '../dashboard.models';

@Component({
    selector: 'app-moto',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './moto.html',
    styleUrl: './moto.css',
})
export class Moto implements OnInit {
    motorcycles: Motorcycle[] = [];
    showModal = false;
    motoForm!: FormGroup;
    loading = false;
    loadingMotorcycles = true;
    editingMotoId: string | null = null;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    private apiUrl = 'http://localhost:3000/motorcycles';

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.loadMotorcycles();
    }

    initializeForm() {
        this.motoForm = this.fb.group({
            brand: ['', [Validators.required, Validators.minLength(2)]],
            model: ['', [Validators.required, Validators.minLength(2)]],
            version: [''],
            year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
            licensePlate: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    loadMotorcycles() {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            this.loadingMotorcycles = false;
            this.cdr.detectChanges();
            return;
        }

        this.loadingMotorcycles = true;
        this.http.get<Motorcycle[]>(`${this.apiUrl}?userId=${userId}`).subscribe({
            next: (motos) => {
                this.motorcycles = motos;
                this.loadingMotorcycles = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading motorcycles:', error);
                this.errorMessage = 'Error al cargar las motos';
                this.loadingMotorcycles = false;
                this.cdr.detectChanges();
            }
        });
    }

    openModal() {
        this.showModal = true;
        this.editingMotoId = null;
        this.motoForm.reset();
    }

    closeModal() {
        this.showModal = false;
        this.editingMotoId = null;
        this.motoForm.reset();
    }

    editMoto(moto: Motorcycle) {
        this.editingMotoId = moto.id;
        this.motoForm.patchValue({
            brand: moto.brand,
            model: moto.model,
            version: moto.version || '',
            year: moto.year,
            licensePlate: moto.licensePlate
        });
        this.showModal = true;
    }

    saveMoto() {
        if (this.motoForm.invalid) {
            this.motoForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const userId = this.authService.getCurrentUserId();
        const formValue = this.motoForm.value;

        const motoData: Partial<Motorcycle> = {
            userId: userId || '',
            brand: formValue.brand,
            model: formValue.model,
            version: formValue.version || '',
            year: parseInt(formValue.year),
            licensePlate: formValue.licensePlate,
            displayName: `${formValue.brand} ${formValue.model} (${formValue.year}) - ${formValue.licensePlate}`
        };

        if (this.editingMotoId) {
            // Update existing
            this.http.patch<Motorcycle>(`${this.apiUrl}/${this.editingMotoId}`, motoData).subscribe({
                next: (updatedMoto) => {
                    this.loading = false;
                    const index = this.motorcycles.findIndex(m => m.id === this.editingMotoId);
                    if (index !== -1) {
                        this.motorcycles[index] = updatedMoto;
                    }
                    this.successMessage = 'Moto actualizada correctamente';
                    this.closeModal();
                    setTimeout(() => this.successMessage = null, 3000);
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = 'Error al actualizar la moto';
                    console.error('Update error:', error);
                }
            });
        } else {
            // Create new
            this.http.post<Motorcycle>(this.apiUrl, motoData).subscribe({
                next: (newMoto) => {
                    this.loading = false;
                    this.motorcycles.push(newMoto);
                    this.successMessage = 'Moto agregada correctamente';
                    this.closeModal();
                    setTimeout(() => this.successMessage = null, 3000);
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = 'Error al agregar la moto';
                    console.error('Create error:', error);
                }
            });
        }
    }

    deleteMoto(moto: Motorcycle) {
        if (!confirm(`¿Estás seguro de que deseas eliminar ${moto.brand} ${moto.model}?`)) {
            return;
        }

        this.http.delete(`${this.apiUrl}/${moto.id}`).subscribe({
            next: () => {
                this.motorcycles = this.motorcycles.filter(m => m.id !== moto.id);
                this.successMessage = 'Moto eliminada correctamente';
                setTimeout(() => this.successMessage = null, 3000);
            },
            error: (error) => {
                this.errorMessage = 'Error al eliminar la moto';
                console.error('Delete error:', error);
            }
        });
    }
}
