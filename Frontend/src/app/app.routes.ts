import { Routes } from '@angular/router';
import { Registro } from './registro/registro';
import { Inicial } from './inicial/inicial';
import { Login } from './login/login';
import { VerTodos } from './ver-todos/ver-todos';
import { Diario } from './diario/diario';
import { JuegoDetalle } from './juego-detalle/juego-detalle';
import { Perfil } from './perfil/perfil';
import { authGuard } from './auth.guard';
import { AcercaDe } from './acerca-de/acerca-de';
import { Busqueda } from './busqueda/busqueda';

export const routes: Routes = [
    //La ruta raiz redirige directamente a inicial
    { path: '', redirectTo: 'inicial', pathMatch: 'full' },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login },
    { path: 'diario', component: Diario },
    // Rutas públicas
    { path: 'inicial', component: Inicial },
    { path: 'busqueda', component: Busqueda },
    { path: 'ver-todos/:genero', component: VerTodos },
    { path: 'juego/:id', component: JuegoDetalle },
    
    // Rutas protegidas: requieren token JWT válido
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
    { path: 'acerca-de', component: AcercaDe }
];