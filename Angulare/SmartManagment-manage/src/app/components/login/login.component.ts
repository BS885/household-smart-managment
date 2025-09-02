import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.message === 'אין הרשאה - רק מנהל יכול להתחבר') {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = error.error?.message || 'שגיאה בהתחברות. אנא נסה שוב.';
        }
      }
    });
  }


  getEmailError(): string {
    if (!this.email) {
      return 'יש להזין כתובת אימייל';
    }
    if (!this.email.includes('@')) return 'כתובת האימייל אינה תקינה';
    if (this.email.length < 5) return 'כתובת האימייל חייבת להכיל לפחות 5 תווים';
    return '';
  }

  getPasswordError(): string {
    if (!this.password) return 'יש להזין סיסמה';
    if (this.password.length <= 8) return 'הסיסמה חייבת להכיל לפחות 8 תווים';
    return '';
  }
}
