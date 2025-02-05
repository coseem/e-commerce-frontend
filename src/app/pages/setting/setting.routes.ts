import { Routes } from '@angular/router';

export default [
    { path: 'categories', loadComponent: () => import('./category/category.component').then((c) => c.CategoryComponent) },
    { path: 'countries', loadComponent: () => import('./country/country.component').then((c) => c.CountryComponent) },
    { path: 'units', loadComponent: () => import('./unit/unit.component').then((c) => c.UnitComponent) }
] as Routes;
