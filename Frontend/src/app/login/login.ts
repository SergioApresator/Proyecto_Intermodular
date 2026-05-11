import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuarios } from '../usuarios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  //Injección necesaria para viajar entre páginas
  private router = inject(Router);

  //Inyecto el servicio
  constructor(private usuariosServicio: Usuarios) { }

  formularioLogin = new FormGroup({
    identity: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  // Variable para controlar qué modo de login se está mostrando (Por defecto: Username)
  loginConEmail: boolean = false;

  ngOnInit() {
    
    this.formularioLogin.get('identity')?.valueChanges.subscribe(value => {
      const control = this.formularioLogin.get('identity');
      if (!value) return;

      if (value.includes('@')) {
        // Si contiene un arroba, se le pone el validador de email
        control?.setValidators([Validators.required, Validators.email]);
      } else {
        // Cambia a el validador de Nombre de Usuario (solo requerido)
        control?.setValidators([Validators.required]);
      }
      
      // Actualizamos el estado interno sin disparar otro evento de cambio infinito
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  submit() {
    if (this.formularioLogin.valid) {
      const identityValue = this.formularioLogin.value.identity!;
      const passInput = this.formularioLogin.value.password!;

      this.usuariosServicio.login(identityValue, passInput).subscribe({
        next: (usuarioEncontrado) => this.guardarSesionYRedirigir(usuarioEncontrado),
        error: () => alert('Credenciales incorrectas')
      });
    }
  }

  // Guardado de la información de la sesion en localStorage
  private guardarSesionYRedirigir(usuarioEncontrado: any) {
    if (usuarioEncontrado && usuarioEncontrado.token) {
      localStorage.setItem('token', usuarioEncontrado.token);
      if (usuarioEncontrado.id) {
        localStorage.setItem('usuarioId', usuarioEncontrado.id.toString());
      }
      if (usuarioEncontrado.username) {
        localStorage.setItem('username', usuarioEncontrado.username);
      }
      const foto = usuarioEncontrado.foto_url || usuarioEncontrado.fotoUrl;
      if (foto) {
        localStorage.setItem('foto_url', foto);
      }
    }
    this.router.navigate(['/inicial']);
  }
}
