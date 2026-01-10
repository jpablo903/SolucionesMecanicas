import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\+\-\(\)]+$/)]],
      motoModel: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepare form data for Netlify
    const formData = new URLSearchParams();
    formData.append('form-name', 'contact');
    formData.append('name', this.contactForm.value.name);
    formData.append('email', this.contactForm.value.email);
    formData.append('phone', this.contactForm.value.phone);
    formData.append('motoModel', this.contactForm.value.motoModel || '');
    formData.append('message', this.contactForm.value.message);

    // Submit to Netlify Forms
    this.http.post('/', formData.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '¡Mensaje enviado exitosamente! Te contactaremos pronto.';
        this.contactForm.reset();
        this.submitted = false;

        // Clear message after 5 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error submitting form:', error);
        this.errorMessage = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';

        // Clear error after 5 seconds
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }
}
