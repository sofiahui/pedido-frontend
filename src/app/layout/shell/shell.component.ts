import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly authService = inject(AuthService);

  get canSeeOrders(): boolean {
    return this.authService.hasRole('Admin', 'Operador', 'Cliente');
  }

  get canSeeCatalog(): boolean {
    return this.authService.hasRole('Admin', 'Operador');
  }

  logout(): void {
    this.authService.logout();
  }
}
