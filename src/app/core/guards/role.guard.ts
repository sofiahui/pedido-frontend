import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole, AuthService } from '../auth/auth.service';

/**
 * Complementa a MsalGuard: una vez autenticado, exige que el usuario tenga
 * alguno de los roles declarados en `data.roles` de la ruta.
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as AppRole[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (authService.hasRole(...allowedRoles)) {
    return true;
  }

  return router.parseUrl('/dashboard');
};
