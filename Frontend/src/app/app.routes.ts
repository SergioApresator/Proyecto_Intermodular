import { Routes } from '@angular/router';
import { Registro } from './components/registro/registro';
import { Inicial } from './components/inicial/inicial';
import { Login } from './components/login/login';
import { VerTodos } from './components/ver-todos/ver-todos';
import { Diario } from './components/diario/diario';
import { JuegoDetalle } from './components/juego-detalle/juego-detalle';
import { Perfil } from './components/perfil/perfil';
import { authGuard } from './auth.guard';
import { AcercaDe } from './components/acerca-de/acerca-de';
import { Busqueda } from './components/busqueda/busqueda';
import { Admin } from './components/admin/admin';
import { BuscarUsuarios } from './components/buscar-usuarios/buscar-usuarios';
import { PerfilPublico } from './components/perfil-publico/perfil-publico';

export const routes: Routes = [
    //La ruta raiz redirige directamente a inicial
    { path: '', redirectTo: 'inicial', pathMatch: 'full' },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login },
    { path: 'diario', component: Diario, canActivate: [authGuard] },
    { path: 'admin', component: Admin },
    // Rutas públicas
    { path: 'inicial', component: Inicial },
    { path: 'busqueda', component: Busqueda },
    { path: 'ver-todos/:genero', component: VerTodos },
    { path: 'juego/:id', component: JuegoDetalle },
    
    // Rutas protegidas: requieren token JWT válido
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
    { path: 'acerca-de', component: AcercaDe },
    { path: 'buscar-usuarios', component: BuscarUsuarios },
    { path: 'perfil/:id', component: PerfilPublico }
];