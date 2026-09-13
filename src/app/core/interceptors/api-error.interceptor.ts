import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Si el backend responde 401 (token vencido/ inválido más allá de lo que MSAL
 * pudo renovar en silencio), se manda al usuario de vuelta al login.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    }),
  );
};
