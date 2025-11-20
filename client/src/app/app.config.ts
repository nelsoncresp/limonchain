// Ubicación: client/src/app/app.config.ts

import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// Importar withHashLocation para resolver el problema del servidor 404
import { provideRouter, withHashLocation } from '@angular/router'; 
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
 providers: [
  // CAMBIO CLAVE: Se añade withHashLocation()
  provideRouter(routes, withHashLocation()), 
  importProvidersFrom(HttpClientModule),
  provideHttpClient(
   withInterceptors([authInterceptor])
  )
 ]
};