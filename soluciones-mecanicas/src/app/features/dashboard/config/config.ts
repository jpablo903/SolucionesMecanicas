import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { User } from '../dashboard.models';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-config',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './config.html',
    styleUrl: './config.css',
})
export class Config implements OnInit {
    currentUser: User | null = null;
    profileForm!: FormGroup;
    passwordForm!: FormGroup;
    profileLoading = false;
    passwordLoading = false;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        // Get current user
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.initializeForms(user);
            }
        });
    }

    initializeForms(user: User) {
        // Profile form
        this.profileForm = this.fb.group({
            firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
            lastName: [user.lastName, [Validators.required, Validators.minLength(2)]],
            phone: [user.phone, [Validators.pattern(/^[0-9]{10}$/)]],
            email: [{ value: user.email, disabled: true }] // Email is read-only
        });

        // Password form
        this.passwordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');
        return newPassword && confirmPassword && newPassword.value === confirmPassword.value
            ? null : { passwordMismatch: true };
    }

    updateProfile() {
        if (this.profileForm.invalid || !this.currentUser) {
            this.profileForm.markAllAsTouched();
            return;
        }

        if (this.currentUser.active === false) {
            Swal.fire({
                title: 'Restringido',
                text: 'Tu cuenta está restringida. No puedes modificar tu perfil.',
                icon: 'error',
                background: '#1f2937',
                color: '#fff'
            });
            return;
        }

        this.profileLoading = true;

        const updates = {
            firstName: this.profileForm.get('firstName')?.value,
            lastName: this.profileForm.get('lastName')?.value,
            phone: this.profileForm.get('phone')?.value
        };

        this.authService.updateUserProfile(this.currentUser.id, updates).subscribe({
            next: (user) => {
                this.profileLoading = false;
                Swal.fire({
                    title: '¡Guardado!',
                    text: 'Cambios guardados correctamente',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: (error) => {
                this.profileLoading = false;
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar el perfil',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#fff'
                });
                console.error('Update error:', error);
            }
        });
    }

    changePassword() {
        if (this.passwordForm.invalid || !this.currentUser) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        if (this.currentUser.active === false) {
            Swal.fire({
                title: 'Restringido',
                text: 'Tu cuenta está restringida. No puedes cambiar tu contraseña.',
                icon: 'error',
                background: '#1f2937',
                color: '#fff'
            });
            return;
        }

        this.passwordLoading = true;

        const newPassword = this.passwordForm.get('newPassword')?.value;

        this.authService.changePassword(this.currentUser.id, newPassword).subscribe({
            next: (user) => {
                this.passwordLoading = false;
                this.passwordForm.reset();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Contraseña cambiada correctamente',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: (error) => {
                this.passwordLoading = false;
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cambiar la contraseña',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#fff'
                });
                console.error('Password change error:', error);
            }
        });
    }
}
