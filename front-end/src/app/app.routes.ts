import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/NoAuth.guard';
import { RequireAdminGuard } from './core/guards/RequireAdmin.guard';
import { RequireAuthGuard } from './core/guards/RequireAuth.guard';
import { ShopInventoryResolver } from './pages/shop/resolvers/shop-inventory.resolver';

export const routes: Routes = [
  {
    // Ruta de inicio
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [RequireAuthGuard]
  },
  {
    // Ruta de CRUD
    path: 'crud',
    loadComponent: () => import('./pages/crud/crud.component').then((m) => m.CrudComponent),
    canActivate: [RequireAdminGuard]
  },
  {
    // Ruta de inicio de sesión
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NoAuthGuard]
  },
  {
    // Ruta de registro
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [NoAuthGuard]
  },
  {
    // Ruta de la tienda
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent),
    resolve: {
      products: ShopInventoryResolver
    },
    canActivate: [RequireAuthGuard],
    children: [
      {
        // Ruta de detalle de producto
        path: 'product/:id',
        loadComponent: () => import('./pages/shop/product-data/product-data.component').then((m) => m.ProductDataComponent),
        canActivate: [RequireAuthGuard]
      }
    ]
  },
  {
    // Recireccion de rutas no encontradas
    path: '**',
    redirectTo: ''
  }
];
