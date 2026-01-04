import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Simular autenticación
    setTimeout(() => {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Mock login: aceptar cualquier email/password válido
      if (email && password) {
        this.authService.login(email);
        this.loading = false;
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.loading = false;
        this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
      }
    }, 1500);
  }
}
