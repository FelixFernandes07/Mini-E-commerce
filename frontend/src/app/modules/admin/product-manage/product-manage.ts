import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

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

  private apiUrl = 'http://localhost/Projecto%20Mini%20E-commerce/backend/index.php';

  form = {
    id: null as any,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image: '',
    imageFile: null as File | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/products`).subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadCategories() {
    this.http.get<any>(`${this.apiUrl}/categories`).subscribe({
      next: (res) => this.categories = res.data
    });
  }

  openCreate() {
    this.editMode = false;
    this.form = { id: null, name: '', description: '', price: 0, stock: 0, category_id: '', image: '', imageFile: null };
    this.showForm = true;
  }

  openEdit(product: any) {
    this.editMode = true;
    this.form = { ...product, imageFile: null };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.error = '';
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('description', this.form.description);
    formData.append('price', this.form.price.toString());
    formData.append('stock', this.form.stock.toString());
    formData.append('category_id', this.form.category_id);
    if (this.form.imageFile) {
      formData.append('image', this.form.imageFile);
    }

    const headers = { Authorization: `Bearer ${token}` };

    if (this.editMode) {
      this.http.post(`${this.apiUrl}/products/${this.form.id}`, formData, { headers }).subscribe({
        next: () => {
          this.success = 'Produto actualizado!';
          this.closeForm();
          this.loadProducts();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => this.error = 'Erro ao actualizar produto!'
      });
    } else {
      this.http.post(`${this.apiUrl}/products`, formData, { headers }).subscribe({
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
      const token = localStorage.getItem('token');
      this.http.delete(`${this.apiUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
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