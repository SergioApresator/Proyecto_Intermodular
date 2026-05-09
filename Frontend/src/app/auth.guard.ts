import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);

  if (!isPlatformBrowser(platformId)) {
    return true; // Permitir en SSR, el navegador reevaluará
  }

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar el token contra el backend para detectar tokens expirados o inválidos
  return http.get('http://localhost:9999/api/usuarios/validar-token', {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  }).pipe(
    map(() => true),
    catchError(() => {
      // Token inválido o expirado → limpiar localStorage y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('username');
      localStorage.removeItem('foto_url');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
