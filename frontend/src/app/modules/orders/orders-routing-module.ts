import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list';
import { OrderDetailComponent } from './order-detail/order-detail';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: ':id', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}