import { Routes } from '@angular/router';
import { Registro } from './registro/registro';
import { Inicial } from './inicial/inicial';
import { Login } from './login/login';
import { VerTodos } from './ver-todos/ver-todos';
import { Diario } from './diario/diario';
import { JuegoDetalle } from './juego-detalle/juego-detalle';
import { Perfil } from './perfil/perfil';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    //La ruta raiz redirige directamente a inicial
    { path: '', redirectTo: 'inicial', pathMatch: 'full' },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login },
    { path: 'diario', component: Diario },
    // Rutas protegidas: requieren token JWT válido
    { path: 'inicial', component: Inicial, canActivate: [authGuard] },
    { path: 'ver-todos/:genero', component: VerTodos, canActivate: [authGuard] },
    { path: 'juego/:id', component: JuegoDetalle, canActivate: [authGuard] },
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
];