import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{

  newOrder: Order = {
    id: 0,
    username: '',
    isPaid: false,
    orderItems:[
      {id: 0, productId: 0, quantity: 0},
    ]
  }

  orders: Order[] = [];
  constructor(private orderService: OrderService){}


  ngOnInit(): void {    
    this.loadOrders();
  }

  loadOrders(){
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log(data);
        this.orders = data
      },
      error: (error)=>{
        console.log("Error fetching error: ", error);
      }
    })
  }

  createProduct(){
    this.orderService.createOrder(this.newOrder).subscribe({
      next: (createOrder) =>{

        
        this.orders.push(createOrder);
        this.resetOrder()
      },
      error: (error) =>{
        console.log("Error fetching error: ", error);
      }
    }
    );
  }

  removeOrder(orderId : number){
    this.orderService.deleteOrder(orderId);
    const index = this.orders.findIndex(o => o.id == orderId);
    this.orders.splice(index, 1);
  }

  resetOrder(){
    this.newOrder = {
      id: 0,
      username: '',
      isPaid: false,
      orderItems:[
        {id: 0, productId: 0, quantity: 0},
      ]
    }
  }

  addItemInOrder(){
    this.newOrder.orderItems.push({id: 0, productId: 0, quantity: 0});
  }
  addQuantityItem(indexBy : number){
    this.newOrder.orderItems[indexBy].quantity++;
  }

  minusQuantityItem(indexBy : number){
    if(this.newOrder.orderItems[indexBy].quantity > 0){
      this.newOrder.orderItems[indexBy].quantity--;
    }
  }
}
