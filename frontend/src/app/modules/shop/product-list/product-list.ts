import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filtered: any[] = [];
  categories: any[] = [];
  search = '';
  selectedCategory = '';
  loading = true;

  constructor(private productService: ProductService) {}

ngOnInit() {
  this.loading = true;
  this.productService.getAll().subscribe({
    next: (res) => {
      this.products = res.data || [];
      this.filtered = res.data || [];
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });

  this.productService.getCategories().subscribe({
    next: (res) => {
      this.categories = res.data || [];
    }
  });
}

  filterProducts() {
    this.filtered = this.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(this.search.toLowerCase());
      const matchCategory = this.selectedCategory ? p.category_id == this.selectedCategory : true;
      return matchSearch && matchCategory;
    });
  }

  addToCart(product: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex((p: any) => p.id === product.id);
    if (index >= 0) {
      cart[index].quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produto adicionado ao carrinho!');
  }
}