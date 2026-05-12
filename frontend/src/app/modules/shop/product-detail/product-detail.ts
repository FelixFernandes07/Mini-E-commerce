import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  quantity = 1;
  success = '';
  private imageBase = 'http://localhost/Projecto%20Mini%20E-commerce/backend/';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(+id).subscribe({
        next: (res) => {
          this.product = res.data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  getImage(): string {
    if (!this.product?.image) return 'https://placehold.co/600x400';
    if (this.product.image.startsWith('http')) return this.product.image;
    return this.imageBase + this.product.image;
  }

  increaseQty() {
    if (this.quantity < this.product.stock) this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex((p: any) => p.id === this.product.id);
    if (index >= 0) {
      cart[index].quantity += this.quantity;
    } else {
      cart.push({ ...this.product, quantity: this.quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.success = 'Produto adicionado ao carrinho!';
    setTimeout(() => this.success = '', 3000);
  }
}