import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import { Product, ProductRequest } from '../../../shared/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [ProductCardComponent, ProductFormComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly authService = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  get canManage(): boolean {
    return this.authService.hasRole('Admin');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.catalogService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  startCreate(): void {
    this.editingProduct.set(null);
    this.showForm.set(true);
  }

  startEdit(product: Product): void {
    this.editingProduct.set(product);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
  }

  save(request: ProductRequest): void {
    const editing = this.editingProduct();
    const action = editing ? this.catalogService.update(editing.id, request) : this.catalogService.create(request);

    action.subscribe({
      next: () => {
        this.cancelForm();
        this.load();
      },
      error: () => this.error.set('No se pudo guardar el producto.'),
    });
  }

  remove(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }
    this.catalogService.delete(product.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('No se pudo eliminar el producto.'),
    });
  }
}
