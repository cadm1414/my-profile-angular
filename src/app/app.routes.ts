import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '../context/auth/presentation/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () => import('../context/auth/presentation/pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () => import('../context/identity/presentation/pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('../context/shell/presentation/layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('../context/shell/presentation/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('../context/identity/presentation/pages/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
