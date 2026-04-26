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
  constructor(private usuariosServicio: Usuarios) {}

  formularioLogin = new FormGroup({
    correo: new FormControl('',[Validators.required, Validators.email]),
    contrasena: new FormControl('',[Validators.required, Validators.minLength(8)])
  });

submit() {
  if (this.formularioLogin.valid) {
    const correoInput = this.formularioLogin.value.correo!; // Se pone ! para indicar que no son nulos
    const passInput = this.formularioLogin.value.contrasena!; // Se pone ! para indicar que no son nulos

    //LLama al servicio pasandole datos
    //El subscribe hace que hasta que no haya una respuesta del servidor, no se ejecute lo de abajo
    this.usuariosServicio.login(correoInput, passInput).subscribe({
      //El subscribe tiene 2 caminos, next y error
      next: (usuarioEncontrado) => {
        this.router.navigate(['/inicial']);
      },
      error: (err) => {
        alert('Correo o contraseña incorrectos');
      }
    });
  }
}
}
