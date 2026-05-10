import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-order-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './order-manage.html',
  styleUrl: './order-manage.scss'
})
export class OrderManageComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  success = '';
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateStatus(id: number, status: string) {
    this.orderService.updateStatus(id, status).subscribe({
      next: () => {
        this.success = 'Estado actualizado!';
        this.loadOrders();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erro ao actualizar estado!'
    });
  }

  exportCSV() {
    if (this.orders.length === 0) return;

    const headers = ['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Data'];
    const rows = this.orders.map(o => [
      o.id, o.user_name, o.user_email,
      o.total, o.status, o.created_at
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}