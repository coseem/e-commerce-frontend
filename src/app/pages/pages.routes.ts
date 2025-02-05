import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';

export default [
    { path: '', component: Dashboard },
    { path: 'products', loadComponent: () => import('./product/product.component').then((c) => c.ProductComponent) },
    { path: 'products/:id', loadComponent: () => import('./product/product-edit/product-edit.component').then((c) => c.ProductEditComponent) },
    { path: 'orders', loadComponent: () => import('./order/order.component').then((c) => c.OrderComponent) },
    { path: 'clients', loadComponent: () => import('./client/client.component').then((c) => c.ClientComponent) },
    { path: 'suppliers', loadComponent: () => import('./supplier/supplier.component').then((c) => c.SupplierComponent) },
    { path: 'reports', loadComponent: () => import('./report/report.component').then((c) => c.ReportComponent) },
    { path: 'settings', loadChildren: () => import('./setting/setting.routes')},
    { path: 'empty', component: Empty },
] as Routes;
