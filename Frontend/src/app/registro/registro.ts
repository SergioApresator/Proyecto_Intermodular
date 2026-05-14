import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuarios } from '../usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro {

  //Injección necesaria para viajar entre páginas
  private router = inject(Router);

  // Inyecto el servicio
  constructor(private usuariosServicio: Usuarios) { }

  // Validador personalizado para asegurar que las contraseñas coincidan
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };

  formularioRegistro = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{2,40}$/)]),
    apellidos: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{2,40}$/)]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9_]+$/) // Solo alfanuméricos y guiones bajos
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) // Email estricto
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9]).*$/) // Al menos un número
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  submit() {
    if (this.formularioRegistro.valid) {
      // Preparamos los datos limpios (trimming)
      const rawData = this.formularioRegistro.value;
      const cleanData = {
        nombre: rawData.nombre?.trim(),
        apellidos: rawData.apellidos?.trim(),
        username: rawData.username?.trim(),
        email: rawData.email?.trim()?.toLowerCase(),
        password: rawData.password, // La contraseña no se trimmea usualmente por seguridad/precisión
        esAdmin: false
      };

      this.usuariosServicio.guardarUsuario(cleanData).subscribe({
        next: (respuesta) => {
          this.router.navigate(['/login']);
        },
        error: (e) => {
          alert('Error al registrar usuario: El nombre de usuario o email ya podrían estar en uso.');
        }
      });
    } else {
      this.formularioRegistro.markAllAsTouched();
    }
  }
}
