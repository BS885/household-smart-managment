import { Injectable } from '@angular/core';
import { Category, CategoryPost, CategoryPostAndPut, CategoryPut } from '../models/Category.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl + '/Category';

  constructor(private http: HttpClient) { }
  getCategories(): Observable<Category[]> {
    return forkJoin([
      this.http.get<{id$: string, $values: Category[] }>(this.apiUrl + '/Expense'),
      this.http.get<{$values: Category[]}>(this.apiUrl + '/Income')
    ]).pipe(
      map(([expenses, incomes]) => {
        console.log('Expenses:', expenses);
        console.log('Incomes:', incomes);
        return [...expenses.$values, ...incomes.$values];
      })
    );
  }

  addCategory(category: CategoryPost): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(category: CategoryPut): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category);
  }
}
