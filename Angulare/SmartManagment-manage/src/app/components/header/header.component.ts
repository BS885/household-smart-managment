import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import * as AuthActions from '../../store/Auth/auth.actions';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  username: string = '';
  isMobileMenuOpen: boolean = false;
  userNotificationCount: number = 0;
  hasUserNotifications: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store.select(state => state.auth)
      .pipe(takeUntil(this.destroy$))
      .subscribe(auth => {
        this.username = auth?.user?.name ?? '';
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToUsers(event: Event): void {
    setTimeout(() => {
      this.router.navigate(['/users']);
      this.closeMobileMenu();
    }, 200);
  }

  navigateToCategories(event: Event): void {
    setTimeout(() => {
      this.router.navigate(['/categories']);
      this.closeMobileMenu();
    }, 200);
  }

  navigateToPermissions(event: Event): void {
    setTimeout(() => {
      this.router.navigate(['permissions']);
      this.closeMobileMenu();
    }, 200);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

}