import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./modules/shop/shop-module').then(m => m.ShopModule)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/orders/orders-module').then(m => m.OrdersModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'shop'
  }
];