import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    console.log('Intercepting request to:', req.url);
    console.log('Token exists?', !!token);
    // Solo enviar el token a nuestro backend (localhost o el dominio de produccion), NO a RAWG
    if (token && req.url.includes('localhost:9999') && !req.headers.has('Authorization')) {
      console.log('Adding Authorization header to request');
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }
  }
  
  return next(req);
};
