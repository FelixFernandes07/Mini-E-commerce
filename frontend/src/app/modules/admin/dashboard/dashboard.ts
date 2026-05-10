import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.totalProducts = res.data?.length || 0;
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.totalOrders = res.data?.length || 0;
        this.totalRevenue = res.data?.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0) || 0;
        this.recentOrders = res.data?.slice(0, 5) || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}