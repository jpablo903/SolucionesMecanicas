import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';
import Swal from 'sweetalert2';

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

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;

        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola, ${user.firstName}`,
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
        console.error('Login error:', error);

        Swal.fire({
          title: 'Error de acceso',
          text: 'Email o contraseña incorrectos',
          icon: 'error',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
