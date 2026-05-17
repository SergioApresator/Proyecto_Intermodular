import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuarios } from '../usuarios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
        // Si contiene un arroba, se le pone el validador de email estricto
        control?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]);
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
      const identityValue = this.formularioLogin.value.identity?.trim()!;
      const passInput = this.formularioLogin.value.password!;

      this.usuariosServicio.login(identityValue, passInput).subscribe({
        next: (usuarioEncontrado) => this.guardarSesionYRedirigir(usuarioEncontrado),
        error: (err) => {
          if (err.status === 403) {
            alert('Tu cuenta ha sido baneada. Contacta con el administrador si crees que es un error.');
          } else {
            alert('Credenciales incorrectas. Verifica tu usuario/email y contraseña.');
          }
        }
      });
    } else {
      this.formularioLogin.markAllAsTouched();
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
      const banner = usuarioEncontrado.banner_url || usuarioEncontrado.bannerUrl;
      if (banner) {
        localStorage.setItem('banner_url', banner);
      }
      if (usuarioEncontrado.esAdmin) {
        localStorage.setItem('esAdmin', 'true');
      } else {
        localStorage.removeItem('esAdmin');
      }
    }
    this.router.navigate(['/inicial']);
  }
}
