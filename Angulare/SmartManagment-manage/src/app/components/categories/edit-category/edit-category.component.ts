import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryPut } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent {
  @Input() editCategory: CategoryPut = { id: 0, name: '', description: '', type: '' };
  @Output() saveEdit = new EventEmitter<CategoryPut>();
  @Output() cancelEdit = new EventEmitter<void>();

  onSubmit() {
    if (this.editCategory.name && this.editCategory.type) {
      this.saveEdit.emit(this.editCategory);
    }
  }

  onCancel() {
    this.cancelEdit.emit();
  }
}
