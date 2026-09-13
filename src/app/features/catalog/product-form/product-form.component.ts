import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductRequest } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Output() readonly submitted = new EventEmitter<ProductRequest>();
  @Output() readonly cancelled = new EventEmitter<void>();

  private readonly fb = new FormBuilder();

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.form.reset({
        name: this.product?.name ?? '',
        description: this.product?.description ?? '',
        price: this.product?.price ?? 0,
        stock: this.product?.stock ?? 0,
      });
    }
  }

  get isEditing(): boolean {
    return this.product !== null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value as ProductRequest);
  }
}
