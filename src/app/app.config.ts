import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenIntercept, TokenInterceptor } from './token.interceptor';
import { AuthService } from './auth.service';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([(req, next) => tokenIntercept(req, next, inject(Router))])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
