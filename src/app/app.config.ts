import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';

import { routes } from './app.routes';
import { MSALGuardConfigFactory, MSALInstanceFactory, MSALInterceptorConfigFactory } from './core/msal/msal.config';
import { initializeMsalFactory } from './core/auth/msal-initializer';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([apiErrorInterceptor])),
    // MsalModule.forRoot ya registra MSAL_INSTANCE/MSAL_GUARD_CONFIG/MSAL_INTERCEPTOR_CONFIG
    // y los servicios MsalService/MsalGuard/MsalBroadcastService.
    importProvidersFrom(
      MsalModule.forRoot(MSALInstanceFactory(), MSALGuardConfigFactory(), MSALInterceptorConfigFactory()),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalFactory,
      deps: [MsalService],
      multi: true,
    },
  ],
};
