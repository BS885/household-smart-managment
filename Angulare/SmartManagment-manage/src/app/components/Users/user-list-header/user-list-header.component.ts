import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-user-list-header',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list-header.component.html',
  styleUrl: './user-list-header.component.scss'
})
export class UserListHeaderComponent {
  searchControl = new FormControl('');
  roleControl = new FormControl('');

  @Output() searchChanged = new EventEmitter<string>();
  @Output() roleChanged = new EventEmitter<string>();
  @Output() addAdminClicked = new EventEmitter<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.searchChanged.emit(value || '');
      });

    this.roleControl.valueChanges
      .subscribe(value => {
        this.roleChanged.emit(value || '');
      });
  }

  openAddAdminModal(): void {
    this.addAdminClicked.emit();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleControl.setValue('');
  }
}
