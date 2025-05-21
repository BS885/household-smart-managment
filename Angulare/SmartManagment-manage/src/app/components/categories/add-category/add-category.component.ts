import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryPost } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {

  @Input() newCategory: CategoryPost = { name: '', description: '', type: '' };
  @Input() isVisible: boolean = false;

  @Output() save = new EventEmitter<CategoryPost>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    if (!this.newCategory.name || !this.newCategory.type) {
      return;
    }
    this.save.emit(this.newCategory);
  }

  onCancel() {
    this.cancel.emit();
  }
}

