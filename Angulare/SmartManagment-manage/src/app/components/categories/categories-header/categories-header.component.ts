import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-header',
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './categories-header.component.html',
  styleUrl: './categories-header.component.scss'
})
export class CategoriesHeaderComponent {
  @Input() categoryFilter: 'all' | 'income' | 'expense' = 'all';
  @Input() searchControl: FormControl = new FormControl('');

  @Output() filterCategories = new EventEmitter<'all' | 'income' | 'expense'>();

  constructor() { }

  ngOnInit(): void {
  }

  onFilter(type: 'all' | 'income' | 'expense') {
    this.filterCategories.emit(type);
  }
}
