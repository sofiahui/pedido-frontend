import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth-callback/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [MsalGuard],
    canActivateChild: [MsalGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders-page/orders-page.component').then((m) => m.OrdersPageComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente'] },
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/catalog-page/catalog-page.component').then((m) => m.CatalogPageComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador'] },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
