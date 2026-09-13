import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ORDER_STATUS_TRANSITIONS, Order, OrderStatus } from '../../../shared/models/order.model';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, DecimalPipe, OrderStatusBadgeComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  @Input({ required: true }) orders: Order[] = [];
  @Input() canChangeStatus = false;
  @Output() readonly statusChange = new EventEmitter<{ orderId: number; status: OrderStatus }>();

  nextStatuses(order: Order): OrderStatus[] {
    return ORDER_STATUS_TRANSITIONS[order.status];
  }

  onStatusSelected(order: Order, status: string): void {
    if (!status) {
      return;
    }
    this.statusChange.emit({ orderId: order.id, status: status as OrderStatus });
  }
}
