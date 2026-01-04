import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { User } from '../dashboard.models';

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
    loading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

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
            alert('Tu cuenta está restringida. No puedes modificar tu perfil.');
            return;
        }

        this.loading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const updates = {
            firstName: this.profileForm.get('firstName')?.value,
            lastName: this.profileForm.get('lastName')?.value,
            phone: this.profileForm.get('phone')?.value
        };

        this.authService.updateUserProfile(this.currentUser.id, updates).subscribe({
            next: (user) => {
                this.loading = false;
                this.successMessage = 'Perfil actualizado correctamente';
                setTimeout(() => this.successMessage = null, 5000);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = 'Error al actualizar el perfil';
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
            alert('Tu cuenta está restringida. No puedes cambiar tu contraseña.');
            return;
        }

        this.loading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const newPassword = this.passwordForm.get('newPassword')?.value;

        this.authService.changePassword(this.currentUser.id, newPassword).subscribe({
            next: (user) => {
                this.loading = false;
                this.successMessage = 'Contraseña actualizada correctamente';
                this.passwordForm.reset();
                setTimeout(() => this.successMessage = null, 5000);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = 'Error al cambiar la contraseña';
                console.error('Password change error:', error);
            }
        });
    }
}
