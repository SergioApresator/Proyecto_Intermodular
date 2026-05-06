import { Component, inject } from '@angular/core';
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
export class Login {

  //Injección necesaria para viajar entre páginas
  private router = inject(Router);

  //Inyecto el servicio
  constructor(private usuariosServicio: Usuarios) { }

  formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  submit() {
    if (this.formularioLogin.valid) {
      const emailInput = this.formularioLogin.value.email!; // Se pone ! para indicar que no son nulos
      const passInput = this.formularioLogin.value.password!; // Se pone ! para indicar que no son nulos

      //LLama al servicio pasandole datos
      //El subscribe hace que hasta que no haya una respuesta del servidor, no se ejecute lo de abajo
      this.usuariosServicio.login(emailInput, passInput).subscribe({
        //El subscribe tiene 2 caminos, next y error
        next: (usuarioEncontrado) => {
          if (usuarioEncontrado && usuarioEncontrado.token) {
            localStorage.setItem('token', usuarioEncontrado.token);
            if (usuarioEncontrado.id) {
              localStorage.setItem('usuarioId', usuarioEncontrado.id.toString());
            }
            if (usuarioEncontrado.username) {
              localStorage.setItem('username', usuarioEncontrado.username);
            }
            if (usuarioEncontrado.foto_url) {
              localStorage.setItem('foto_url', usuarioEncontrado.foto_url);
            }
          }
          this.router.navigate(['/inicial']);
        },
        error: (err) => {
          alert('Correo o contraseña incorrectos');
        }
      });
    }
  }
}
