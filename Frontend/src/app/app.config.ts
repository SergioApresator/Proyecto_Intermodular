import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { withFetch, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

//Importa la funcion necesaria para que angular pueda realizar peticiones get, post, delete
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    //Necesario para conectar angular y springboot, 
    //se usa withFetch para indicar que se use la API Fetch del navegador
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])) 
  ]
};