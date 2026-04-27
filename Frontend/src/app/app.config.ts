import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withFetch, withInterceptors } from '@angular/common/http';

//Importa la funcion necesaria para que angular pueda realizar peticiones get, post, delete
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    //Necesario para conectar angular y springboot, 
    //se usa withFetch para indicar que se use la API Fetch del navegador
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])) 
  ]
};
