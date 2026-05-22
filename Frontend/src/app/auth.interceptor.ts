import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token && req.url.includes('localhost:9999') && !req.headers.has('Authorization')) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }
  } else {
    // Si se ejecuta en el servidor (SSR), redirigimos las peticiones internas de localhost al contenedor del backend 'app'
    if (req.url.includes('http://localhost:9999')) {
      const clonedReq = req.clone({
        url: req.url.replace('http://localhost:9999', 'http://app:9999')
      });
      return next(clonedReq);
    }
  }
  
  return next(req);
};
