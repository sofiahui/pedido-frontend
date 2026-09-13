import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { OrdersService } from '../../../shared/services/orders.service';
import { CreateOrderRequest, Order, OrderStatus } from '../../../shared/models/order.model';
import { OrderListComponent } from '../order-list/order-list.component';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [OrderListComponent, OrderFormComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);

  get canCreate(): boolean {
    return this.authService.hasRole('Admin', 'Operador', 'Cliente');
  }

  get canChangeStatus(): boolean {
    return this.authService.hasRole('Admin', 'Operador');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.ordersService.list().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pedidos.');
        this.loading.set(false);
      },
    });
  }

  createOrder(request: CreateOrderRequest): void {
    this.ordersService.create(request).subscribe({
      next: () => {
        this.showForm.set(false);
        this.load();
      },
      error: () => this.error.set('No se pudo crear el pedido. Revisa los IDs de producto y el stock disponible.'),
    });
  }

  changeStatus(event: { orderId: number; status: OrderStatus }): void {
    this.ordersService.changeStatus(event.orderId, event.status).subscribe({
      next: () => this.load(),
      error: () => this.error.set('No se pudo cambiar el estado del pedido.'),
    });
  }
}
