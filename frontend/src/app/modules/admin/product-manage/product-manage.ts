import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './product-manage.html',
  styleUrl: './product-manage.scss'
})
export class ProductManageComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = true;
  showForm = false;
  editMode = false;
  success = '';
  error = '';

  form = {
    id: null,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res.data
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openCreate() {
    this.editMode = false;
    this.form = { id: null, name: '', description: '', price: 0, stock: 0, category_id: '', image: '' };
    this.showForm = true;
  }

  openEdit(product: any) {
    this.editMode = true;
    this.form = { ...product };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.error = '';
  }

  saveProduct() {
    if (this.editMode) {
      this.productService.update(this.form.id!, this.form).subscribe({
        next: () => {
          this.success = 'Produto actualizado!';
          this.closeForm();
          this.loadProducts();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => this.error = 'Erro ao actualizar produto!'
      });
    } else {
      this.productService.create(this.form).subscribe({
        next: () => {
          this.success = 'Produto criado!';
          this.closeForm();
          this.loadProducts();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => this.error = 'Erro ao criar produto!'
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Tens a certeza que queres apagar este produto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.success = 'Produto apagado!';
          this.loadProducts();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => this.error = 'Erro ao apagar produto!'
      });
    }
  }

  exportCSV() {
    if (this.products.length === 0) return;

    const headers = ['ID', 'Nome', 'Preço', 'Stock', 'Categoria'];
    const rows = this.products.map(p => [p.id, p.name, p.price, p.stock, p.category_name]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}