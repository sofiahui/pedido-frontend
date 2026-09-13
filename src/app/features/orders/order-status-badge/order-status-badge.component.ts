import { Component, Input } from '@angular/core';
import { OrderStatus } from '../../../shared/models/order.model';

const STATUS_LABEL: Record<OrderStatus, string> = {
  CREADO: 'Creado',
  ACEPTADO: 'Aceptado',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="status.toLowerCase()">{{ label }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .creado {
        background: #e5e7eb;
        color: #374151;
      }
      .aceptado {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .en_preparacion {
        background: #fef3c7;
        color: #92400e;
      }
      .despachado {
        background: #e0e7ff;
        color: #4338ca;
      }
      .entregado {
        background: #d1fae5;
        color: #047857;
      }
      .cancelado {
        background: #fee2e2;
        color: #b91c1c;
      }
    `,
  ],
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) status!: OrderStatus;

  get label(): string {
    return STATUS_LABEL[this.status];
  }
}
