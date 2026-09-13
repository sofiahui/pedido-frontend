import { Injectable, computed, inject, signal } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AppRole = 'Admin' | 'Operador' | 'Cliente' | 'Auditor';

/**
 * Envuelve MsalService/MsalBroadcastService para exponer, de forma reactiva,
 * la cuenta activa y los roles (App Roles de Azure AD) leídos del ID token.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);

  private readonly accountSignal = signal<AccountInfo | null>(this.msalService.instance.getActiveAccount());

  readonly account = computed(() => this.accountSignal());
  readonly isAuthenticated = computed(() => this.accountSignal() !== null);

  constructor() {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            msg.eventType === EventType.LOGOUT_SUCCESS,
        ),
      )
      .subscribe(() => this.syncActiveAccount());

    this.msalBroadcastService.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => this.syncActiveAccount());
  }

  private syncActiveAccount(): void {
    let active = this.msalService.instance.getActiveAccount();
    if (!active) {
      const [first] = this.msalService.instance.getAllAccounts();
      if (first) {
        this.msalService.instance.setActiveAccount(first);
        active = first;
      }
    }
    this.accountSignal.set(active);
  }

  login(): void {
    this.msalService.loginRedirect({ scopes: [environment.azureAd.apiScope] });
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  get displayName(): string {
    const claims = this.account()?.idTokenClaims as Record<string, unknown> | undefined;
    return (claims?.['name'] as string) ?? this.account()?.username ?? '';
  }

  get roles(): AppRole[] {
    const claims = this.account()?.idTokenClaims as { roles?: AppRole[] } | undefined;
    return claims?.roles ?? [];
  }

  hasRole(...allowed: AppRole[]): boolean {
    const userRoles = this.roles;
    return allowed.some((role) => userRoles.includes(role));
  }
}
