import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'businesses',
        pathMatch: 'full'
    },
    {
        path: 'businesses',
        loadComponent: () => import('./components/businesses/businesses.component').then(m => m.BusinessesComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'transactions',
        loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent)
    },
    {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: 'inventory',
        loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent)
    },
    {
        path: 'clients',
        loadComponent: () => import('./components/clients/clients.component').then(m => m.ClientsComponent)
    },
    {
        path: 'vendors',
        loadComponent: () => import('./components/vendors/vendors.component').then(m => m.VendorsComponent)
    }
];
