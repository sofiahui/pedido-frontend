import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { OrdersService } from '../../shared/services/orders.service';
import { Order } from '../../shared/models/order.model';
import { OrderStatusBadgeComponent } from '../orders/order-status-badge/order-status-badge.component';

const ACTIVE_STATUSES = new Set(['CREADO', 'ACEPTADO', 'EN_PREPARACION', 'DESPACHADO']);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink, OrderStatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeOrders = computed(() => this.orders().filter((o) => ACTIVE_STATUSES.has(o.status)));
  readonly pendingOrders = computed(() => this.orders().filter((o) => o.status === 'CREADO'));
  readonly totalSales = computed(() => this.orders().reduce((sum, o) => sum + o.total, 0));
  readonly recentOrders = computed(() => [...this.orders()].slice(0, 5));

  ngOnInit(): void {
    this.ordersService.list().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pedidos. Verifica que el backend esté disponible.');
        this.loading.set(false);
      },
    });
  }
}
