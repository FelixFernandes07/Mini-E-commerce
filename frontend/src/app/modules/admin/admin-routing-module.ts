import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductManageComponent } from './product-manage/product-manage';
import { OrderManageComponent } from './order-manage/order-manage';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'products', component: ProductManageComponent },
  { path: 'orders', component: OrderManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}