import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserWithPassword } from '../../../models/User.model';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-admin',
  imports: [ReactiveFormsModule, FormsModule,MatSnackBarModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent {
  userForm: FormGroup;
  roles: 'Admin';
  isSubmitting = false;
  formSubmitted = false;
  showPassword = false;
  showConfirmPassword = false;
  showAlert = false;
  isSuccess = false;
  alertMessage = '';

  private _snackBar = inject(MatSnackBar);


  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [
        Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });

  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const user: UserWithPassword = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
      address: this.userForm.value.address,
      city: this.userForm.value.city,
      phone: this.userForm.value.phone,
      password: this.userForm.value.password,
    };
    console.log('User adde :', user);
    this.usersService.addUser(user).subscribe({
      next: (res) => {
        console.log('User added successfully:', res);
        this.showSuccessMessage();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding user:', err);
        this.isSubmitting = false;
        console.log();
        this.showErrorMessage(err.error);
      },
      complete: () => {
        this.isSubmitting = false;
        this.navigateTo();
      }
    });
  }

  resetForm() {
    this.userForm.reset({
      name: '',
      email: '',
      address: '',
      city: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    this.formSubmitted = false;
  }

  showSuccessMessage(message: string = 'המשתמש נוסף בהצלחה!') {
    this.alertMessage = message;
    this.isSuccess = true;
    this.showAlert = true;
    this._snackBar.open(message, 'סגור', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  showErrorMessage(message: string = 'אירעה שגיאה. אנא נסה שוב.') {
    if(message.includes('user with this email already exists')) 
      message = 'המשתמש כבר קיים';
    this.alertMessage = message;
    this.isSuccess = false;
    this.showAlert = true;
    this._snackBar.open(message, 'סגור', {
      duration: 80000000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
          
    });

  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  get f() {
    return this.userForm.controls;
  }

  getPasswordStrengthClass(): string {
    const password = this.userForm.get('password')?.value || '';
    if (password.length > 8) return 'strong';
    if (password.length > 4) return 'medium';
    return 'weak';
  }

  getPasswordStrengthText(): string {
    const password = this.userForm.get('password')?.value || '';
    if (password.length > 8) return 'חזקה';
    if (password.length > 4) return 'בינונית';
    return 'חלשה';
  }

  navigateTo(): void {
    this.router.navigate(['users']);
  }
  hideAlert() {
    this.showAlert = false;
  }
  cancel(): void {
    this.resetForm();
    this.navigateTo();
  }
  getFieldErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control || !control.errors || !control.touched && !this.formSubmitted) return '';

    if (control.errors['required']) return 'שדה זה חובה';
    if (control.errors['email']) return 'דוא"ל לא תקין';
    if (control.errors['minlength']) return `יש להזין לפחות ${control.errors['minlength'].requiredLength} תווים`;
    if (control.errors['pattern']) return 'פורמט לא תקין';
    if (control.errors['mismatch']) return 'הסיסמאות אינן תואמות';

    return 'שדה לא תקין';
  }

}

