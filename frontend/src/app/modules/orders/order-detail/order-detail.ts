import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../core/services/order';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  loading = true;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getById(+id).subscribe({
        next: (res) => {
          this.order = res.data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Pedido #${this.order.id}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${this.order.user_name}`, 14, 35);
    doc.text(`Estado: ${this.order.status}`, 14, 45);
    doc.text(`Data: ${this.order.created_at}`, 14, 55);
    doc.text('Itens:', 14, 70);

    let y = 80;
    this.order.items?.forEach((item: any) => {
      doc.text(`${item.product_name} x${item.quantity} - ${item.price} AOA`, 14, y);
      y += 10;
    });

    doc.text(`Total: ${this.order.total} AOA`, 14, y + 10);
    doc.save(`pedido-${this.order.id}.pdf`);
  }
}