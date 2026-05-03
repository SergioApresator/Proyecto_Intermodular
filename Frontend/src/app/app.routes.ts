import { Routes } from '@angular/router';
import { Registro } from './registro/registro'; 
import { Inicial } from './inicial/inicial';
import { Login } from './login/login';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    //La ruta raiz redirige directamente a inicial
    { path: '', redirectTo: 'inicial', pathMatch: 'full' }, 
    { path: 'registro', component: Registro }, 
    { path: 'inicial', component: Inicial, canActivate: [authGuard] },
    { path: 'login', component: Login }
];