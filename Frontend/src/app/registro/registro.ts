import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuarios } from '../usuarios';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro {

  //Injección necesaria para viajar entre páginas
  private router = inject(Router);

  // Inyecto el servicio
  constructor(private usuariosServicio: Usuarios) {}

  formularioRegistro = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
    apellidos: new FormControl('',[Validators.required]),
    usuario: new FormControl('',[Validators.required, Validators.maxLength(20)]),
    correo: new FormControl('',[Validators.required, Validators.email]),
    contrasena: new FormControl('',[Validators.required, Validators.minLength(8)])
  });

  submit() {
  if (this.formularioRegistro.valid) {
    //Envio el objeto form entero
    this.usuariosServicio.guardarUsuario(this.formularioRegistro.value).subscribe({
      next: (respuesta) => {
        this.router.navigate(['/login']);
      },
      error: (e) => {
        alert('Error al registrar usuario');
      }
    });
  }
}
}
