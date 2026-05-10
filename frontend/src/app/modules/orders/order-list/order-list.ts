import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../core/services/order';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Os meus Pedidos', 14, 20);
    doc.setFontSize(11);

    let y = 35;
    this.orders.forEach(order => {
      doc.text(`#${order.id} | ${order.status} | ${order.total} AOA | ${order.created_at}`, 14, y);
      y += 10;
    });

    doc.save('pedidos.pdf');
  }
}