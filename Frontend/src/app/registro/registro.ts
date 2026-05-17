import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9]).*$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  // Variables para la foto de perfil y banner
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorFoto: string | null = null;

  selectedBannerFile: File | null = null;
  previewBannerUrl: string | null = null;
  errorBanner: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    this.errorFoto = null;
    this.selectedFile = null;
    this.previewUrl = null;

    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.errorFoto = 'El archivo seleccionado debe ser una imagen.';
      return;
    }

    // Validar tamaño (20MB máximo)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorFoto = 'La imagen no puede superar los 20MB de tamaño.';
      return;
    }

    this.selectedFile = file;

    // Generar vista previa de la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onBannerSelected(event: any) {
    const file = event.target.files?.[0];
    this.errorBanner = null;
    this.selectedBannerFile = null;
    this.previewBannerUrl = null;

    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.errorBanner = 'El archivo seleccionado debe ser una imagen.';
      return;
    }

    // Validar tamaño (20MB máximo)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorBanner = 'El banner no puede superar los 20MB de tamaño.';
      return;
    }

    this.selectedBannerFile = file;

    // Generar vista previa del banner
    const reader = new FileReader();
    reader.onload = () => {
      this.previewBannerUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.formularioRegistro.valid) {
      const rawData = this.formularioRegistro.value;
      const cleanData = {
        nombre: rawData.nombre?.trim(),
        apellidos: rawData.apellidos?.trim(),
        username: rawData.username?.trim(),
        email: rawData.email?.trim()?.toLowerCase(),
        password: rawData.password,
        esAdmin: false
      };

      this.usuariosServicio.guardarUsuario(cleanData).subscribe({
        next: (respuesta) => {
          const userId = respuesta?.id;
          if (!userId) {
            this.router.navigate(['/login']);
            return;
          }

          // Subida secuencial para garantizar que ambas fotos se guarden de forma estable
          if (this.selectedFile) {
            this.usuariosServicio.subirFotoPerfil(userId, this.selectedFile).subscribe({
              next: () => {
                if (this.selectedBannerFile) {
                  this.usuariosServicio.subirBanner(userId, this.selectedBannerFile).subscribe({
                    next: () => this.router.navigate(['/login']),
                    error: () => {
                      alert('Cuenta creada, pero ocurrió un problema al subir la foto de portada.');
                      this.router.navigate(['/login']);
                    }
                  });
                } else {
                  this.router.navigate(['/login']);
                }
              },
              error: () => {
                alert('Cuenta creada, pero ocurrió un problema al subir tu foto de perfil.');
                if (this.selectedBannerFile) {
                  this.usuariosServicio.subirBanner(userId, this.selectedBannerFile).subscribe({
                    next: () => this.router.navigate(['/login']),
                    error: () => this.router.navigate(['/login'])
                  });
                } else {
                  this.router.navigate(['/login']);
                }
              }
            });
          } else if (this.selectedBannerFile) {
            this.usuariosServicio.subirBanner(userId, this.selectedBannerFile).subscribe({
              next: () => this.router.navigate(['/login']),
              error: () => {
                alert('Cuenta creada, pero ocurrió un problema al subir la foto de portada.');
                this.router.navigate(['/login']);
              }
            });
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (e) => {
          alert('Error al registrar usuario: El nombre de usuario o email ya podrían estar en uso.');
        }
      });
    } else {
      this.formularioRegistro.markAllAsTouched();
    }
  }

  get previewUsername(): string {
    const val = this.formularioRegistro.get('username')?.value;
    return val && val.trim() ? val.trim() : 'ALIAS_DE_JUGADOR';
  }

  get previewFullName(): string {
    const nom = this.formularioRegistro.get('nombre')?.value;
    const ape = this.formularioRegistro.get('apellidos')?.value;
    const parts = [];
    if (nom && nom.trim()) parts.push(nom.trim());
    if (ape && ape.trim()) parts.push(ape.trim());
    return parts.length > 0 ? parts.join(' ').toUpperCase() : '';
  }

  getInitials(): string {
    const nom = this.formularioRegistro.get('nombre')?.value;
    const ape = this.formularioRegistro.get('apellidos')?.value;
    let initials = '';
    if (nom && nom.trim()) initials += nom.trim().charAt(0);
    if (ape && ape.trim()) initials += ape.trim().charAt(0);
    return initials ? initials.toUpperCase() : 'RM';
  }
}
