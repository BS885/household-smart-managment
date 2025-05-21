import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable } from 'rxjs';
import { Category, CategoryPost, CategoryPut } from '../../../models/Category.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as CategoriesActions from '../../../store/Category/categories.actions';
import * as fromCategories from '../../../store/Category/categories.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesHeaderComponent } from '../categories-header/categories-header.component';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,CategoriesHeaderComponent,AddCategoryComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {

  categories$: Observable<Category[]>;
  filteredCategories$: Observable<Category[]>;
  selectedCategory: Category | null = null;
  categoryFilter: 'all' | 'income' | 'expense' = 'all';
  searchControl = new FormControl('');
  visibleCategories: Category[] = [];
  isAddFormVisible = false;
  hasMoreCategories = false;

  newCategory: CategoryPost = {
    name: '',
    description: '',
    type: ''
  };

  editCategory: CategoryPut = {
    id: 0,
    name: '',
    description: '',
    type: ''
  };

  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<'all' | 'income' | 'expense'>('all');

  constructor(private store: Store, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.store.dispatch(CategoriesActions.loadCategories());

    this.categories$ = this.store.select(fromCategories.selectCategories);

    this.filteredCategories$ = combineLatest([
      this.categories$,
      this.searchSubject,
      this.filterSubject
    ]).pipe(
      map(([categories, search, filter]) => {
        return categories
          .filter(category => {
            if (filter === 'all') return true;
            return filter === 'income' ? category.isIncome : category.isExpense;
          })
          .filter(category => {
            if (!search) return true;
            const searchLower = search.toLowerCase();
            return category.name.toLowerCase().includes(searchLower) ||
              (category.description && category.description.toLowerCase().includes(searchLower));
          });
      })
    );

    this.filteredCategories$.subscribe(categories => {
      this.visibleCategories = categories;
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => this.searchSubject.next(value || ''));

    this.filterSubject.next(this.categoryFilter);

    // ✅ הודעת הצלחה בהוספה
    this.store.select(fromCategories.selectAddSuccess).subscribe(success => {
      if (success) {
        this.snackBar.open('✅ הקטגוריה נוספה בהצלחה', '', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    });

    // ✅ הודעת הצלחה בעדכון
    this.store.select(fromCategories.selectUpdateSuccess).subscribe(success => {
      if (success) {
        this.snackBar.open('✅ הקטגוריה עודכנה בהצלחה', '', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    });

    // ❌ הודעת שגיאה כללית
    this.store.select(fromCategories.selectError).subscribe(error => {
      if (error) {
        this.snackBar.open(`❌ שגיאה: ${error}`, '', {
          duration: 4000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  toggleAddForm(): void {
    this.isAddFormVisible = !this.isAddFormVisible;
  }

  loadMoreCategories(): void {
    console.log('Load more categories clicked');
  }

  onEdit(category: Category): void {
    this.editCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      type: category.isIncome ? 'income' : 'expense'
    };
    this.selectedCategory = category;
  }

  onCancel(): void {
    this.selectedCategory = null;
    this.editCategory = { id: 0, name: '', description: '', type: '' };
  }

  onSaveNew(): void {
    if (!this.newCategory.name || !this.newCategory.type) return;

    this.store.dispatch(CategoriesActions.addCategory({ category: this.newCategory }));
    this.newCategory = { name: '', description: '', type: '' };
    this.isAddFormVisible = false;
  }

  onSaveEdit(): void {
    if (!this.editCategory.id) return;

    this.store.dispatch(CategoriesActions.updateCategory({ category: this.editCategory }));
    this.editCategory = { id: 0, name: '', description: '', type: '' };
    this.selectedCategory = null;
  }

  filterCategories(type: 'all' | 'income' | 'expense'): void {
    this.categoryFilter = type;
    this.filterSubject.next(type);
  }
}

