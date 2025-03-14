import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from './category.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8081/api/v1/' + 'products/category';

  constructor(private http:HttpClient) { }

  createCategory(category : Category): Observable<Category>{
    return this.http.post<Category>(this.baseUrl, category);
  }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.baseUrl);
  }

  deleteCategory(id : number): void{
    console.log(this.baseUrl + '/' + id);
    
    this.http.delete<void>(this.baseUrl + '/' + id).subscribe();
  }

  updateCategory(id : number, category : Category): Observable<Category>{
    return this.http.put<Category>(this.baseUrl + '/' + id, category);
  }
}
