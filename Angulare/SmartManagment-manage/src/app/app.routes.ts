import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UsersListComponent } from './components/Users/users-list/users-list.component';
import { AddAdminComponent } from './components/Users/add-admin/add-admin.component';
import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { PermissionsManagmentComponent } from './components/permissions-managment/permissions-managment.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: "home", component: HomepageComponent },
    {path:'users',component:UsersListComponent},
    {path:'add-admin',component:AddAdminComponent},
    // {path:'**',component:HomepageComponent},
    {path:'categories',component:CategoriesListComponent},
    {path:'permissions',component:PermissionsManagmentComponent},

];
