import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8081/api/v1/' + 'products';

  constructor(private http:HttpClient) { }

  createProduct(product : Product): Observable<Product>{
    return this.http.post<Product>(this.baseUrl, product);
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.baseUrl);
  }
  
  getProductById(id : number): Observable<Product>{
    return this.http.get<Product>(this.baseUrl + '/' + id);
  }

  deleteProduct(id : number): void{
    console.log(this.baseUrl + '/' + id);
    
    this.http.delete<void>(this.baseUrl + '/' + id).subscribe();
  }

  updateProduct(id : number, product : Product): Observable<Product>{
    return this.http.put<Product>(this.baseUrl + '/' + id, product);
  }
}
