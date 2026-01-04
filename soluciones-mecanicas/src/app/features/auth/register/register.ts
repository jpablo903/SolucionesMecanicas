import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage: string | null = null;
  termsAccepted = false;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onGoogleRegister() {
    // Placeholder para Google OAuth - se implementará con backend
    console.log('Google register clicked');
  }

  onFacebookRegister() {
    // Placeholder para Facebook OAuth - se implementará con backend
    console.log('Facebook register clicked');
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Simular registro
    setTimeout(() => {
      const { nombre, apellido, email } = this.registerForm.value;

      // Mock registro: aceptar cualquier dato válido
      if (nombre && apellido && email) {
        this.loading = false;
        // Guardar datos de usuario (opcional)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', `${nombre} ${apellido}`);
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.loading = false;
        this.errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      }
    }, 1500);
  }
}
