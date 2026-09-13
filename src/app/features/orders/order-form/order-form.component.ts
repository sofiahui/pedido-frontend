import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateOrderRequest } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  @Output() readonly submitted = new EventEmitter<CreateOrderRequest>();
  @Output() readonly cancelled = new EventEmitter<void>();

  private readonly fb = new FormBuilder();

  readonly form: FormGroup = this.fb.group({
    items: this.fb.array([this.buildItem()]),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private buildItem(): FormGroup {
    return this.fb.group({
      productId: [null, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    this.items.push(this.buildItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value as CreateOrderRequest);
  }
}
