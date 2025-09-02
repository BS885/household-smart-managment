import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UsersListComponent } from './components/Users/users-list/users-list.component';
import { AddAdminComponent } from './components/Users/add-admin/add-admin.component';
import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { PermissionsManagmentComponent } from './components/permissions-managment/permissions-managment.component';
import { AuthGuard } from '../Guards/AuthGuard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomepageComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
    { path: 'add-admin', component: AddAdminComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesListComponent, canActivate: [AuthGuard] },
    { path: 'permissions', component: PermissionsManagmentComponent, canActivate: [AuthGuard] },
];
