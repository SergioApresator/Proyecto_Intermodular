import { Routes } from '@angular/router';
import { Registro } from './registro/registro'; 
import { Inicial } from './inicial/inicial';
import { Component } from '@angular/core';
import { Login } from './login/login';
import { authGuard } from './auth.guard';

//se crea un componente vacío
@Component({ template: '' }) export class EmptyComponent {}

export const routes: Routes = [
    //Se define que la ruta raíz cargue el componente vacío
    //Lo primero que se verá  será el app.html 
    // pero el outlet estará en blanco
    { path: '', component: EmptyComponent }, 
    { path: 'registro', component: Registro }, 
    { path: 'inicial', component: Inicial, canActivate: [authGuard] },
    { path: 'login', component: Login }
];