import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../models/User.model';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../../store/Users/users.actions';
import {
  selectAllUsers, selectUsersLoading, selectUsersError
} from '../../../store/Users/users.selectors';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDetailsCardComponent } from '../user-details-card/user-details-card.component';
import { UserListHeaderComponent } from '../user-list-header/user-list-header.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    UserDetailsCardComponent,
    UserListHeaderComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private searchTerm: string = '';
  private selectedRole: string = '';
  expandedUserId: number | null;

  @ViewChild(UserListHeaderComponent) headerComponent!: UserListHeaderComponent;

  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  filteredUsers$: Observable<User[]>;

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
    this.error$ = this.store.select(selectUsersError);
  
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredUsers$ = this.users$.pipe(
      map(users =>
        users.filter(user => {
          const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            || user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesRole = !this.selectedRole || (user.role?.toLowerCase() ?? '') === this.selectedRole;
          return matchesSearch && matchesRole;
        })
      )
    );
  }
  
 
  openAddAdminModal(): void {
    this.router.navigate(['add-admin']);
  }
  promoteUserToAdmin(id: number): void {
    this.store.dispatch(UsersActions.changeRole({ id, roleName: 'Admin' }));
    this.snackBar.open('המשתמש הוגדר כמנהל', 'סגור', { duration: 2000, panelClass: ['success-snackbar'] });
  }
  demoteAdminToUser(id: number): void {
    this.store.dispatch(UsersActions.changeRole({ id, roleName: 'User' }));
    this.snackBar.open('המשתמש הוגדר כמשתמש', 'סגור', { duration: 2000, panelClass: ['success-snackbar'] });
  }

  viewUserDetails(id: number): void {
    this.expandedUserId = this.expandedUserId === id ? null : id;

  }

  onSearchChanged(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }
  
  onRoleChanged(value: string): void {
    this.selectedRole = value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.headerComponent.clearFilters();
  }
}
