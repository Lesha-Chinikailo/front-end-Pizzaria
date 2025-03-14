import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderId } from './order.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8082/api/v1/' + 'orders';

  constructor(private http:HttpClient) { }

  getOrders(): Observable<Order[]>{    
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrderById(orderId : number):Observable<Order>{
    return this.http.get<Order>(this.baseUrl + '/' + orderId);
  }

  createOrder(order : Order): Observable<Order>{
    return this.http.post<Order>(this.baseUrl, order);
  }

  deleteOrder(orderId : number): void{
    this.http.delete<void>(this.baseUrl + '/' + orderId).subscribe();
  }

  payOrder(orderId : number): Observable<OrderId>{
    return this.http.patch<OrderId>(this.baseUrl + "/pay/" + orderId, {})
  }
}
