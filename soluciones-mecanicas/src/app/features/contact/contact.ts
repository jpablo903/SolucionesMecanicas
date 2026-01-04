import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) { }

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

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    // Simular envío del formulario
    setTimeout(() => {
      this.loading = false;
      this.successMessage = '¡Mensaje enviado exitosamente! Te contactaremos pronto.';
      this.contactForm.reset();
      this.submitted = false;

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    }, 2000);
  }
}
