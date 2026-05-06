import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro'; 
import { Inicial } from './inicial/inicial';
import { Login } from './pages/login/login';
import { authGuard } from './auth.guard';
import { PerfilComponent } from './pages/perfil/perfil';

export const routes: Routes = [
    //La ruta raiz redirige directamente a inicial
    { path: '', redirectTo: 'inicial', pathMatch: 'full' }, 
    { path: 'registro', component: Registro }, 
    { path: 'inicial', component: Inicial, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'perfil', component: PerfilComponent }
];