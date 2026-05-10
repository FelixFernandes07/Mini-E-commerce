import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../core/services/order';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  loading = false;
  success = '';
  error = '';

  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  increaseQty(item: any) {
    item.quantity++;
    this.saveCart();
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCart();
    }
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  checkout() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    const order = {
      total: this.getTotal(),
      items: this.cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderService.create(order).subscribe({
      next: () => {
        this.success = 'Pedido realizado com sucesso!';
        localStorage.removeItem('cart');
        this.cart = [];
        this.loading = false;
        setTimeout(() => this.router.navigate(['/orders']), 2000);
      },
      error: () => {
        this.error = 'Erro ao realizar pedido!';
        this.loading = false;
      }
    });
  }
}