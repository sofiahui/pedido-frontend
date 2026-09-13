import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Destino del redirectUri configurado en Azure AD. Para cuando llegue aquí, el
 * APP_INITIALIZER ya procesó la respuesta de MSAL (handleRedirectObservable),
 * así que solo queda esperar a que la cuenta activa quede disponible y navegar.
 */
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<div class="callback"><p>Autenticando…</p></div>`,
  styles: [
    `
      .callback {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5f6368;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class AuthCallbackComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
