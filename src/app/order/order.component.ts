import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order, OrderItem } from '../order.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../product.models';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{

  errorMessage: string = '';
  newOrder: Order = {
    id: 0,
    username: '',
    isPaid: false,
    orderItems:[
      {productId: 0, quantity: 0},
    ]
  }

  orders: Order[] = [];
  availableProducts: Product[] = [];
  constructor(private orderService: OrderService, private productService: ProductService){}

  isProductAvailableFromList(productId : number) : boolean{
    if(productId === 0){
      return true;
    }
    
    const product = this.availableProducts.find(product => +product.id === +productId);

    return product?.isAvailable ?? false;
  }

  isProductAvailable(productId: number): boolean {
    if(productId === 0){
      return true;
    }
    if (!this.availableProducts) {
        console.warn('availableProducts not initialized');
        return false;
    }
    const index = this.availableProducts.findIndex(item => +item.id == +productId);
    if(index !== -1){
      return true;
    }
    return false;
  }

  getProductNameById(id: number) : string{
    const index = this.availableProducts.findIndex(p => p.id == id);
    return this.availableProducts[index].name ?? "unknown";
  }

  ngOnInit(): void {    
    this.loadOrders();
    this.fetchProductAvailability();
  }

  loadOrders(){    
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log(data);
        this.orders = data
      },
      error: (error)=>{
        console.log("Error fetching error loadOrders: ", error);
      }
    })
  }

  fetchProductAvailability() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.availableProducts = products;
      },
      error: (error) => {
        console.error('Error fetching products fetchProductAvailability:', error);
      }
    });
  }

  payOrder(orderId : number){
    this.orderService.payOrder(orderId).subscribe({
      next: (orderId) =>{
        const index = this.orders.findIndex(o => o.id == orderId.orderId);
        this.orders[index].isPaid = true;
        const button: HTMLButtonElement | null = document.getElementById('btnPay' + orderId.orderId) as HTMLButtonElement;
        if (button) {
          button.disabled = false;
        }

      },
      error: (error) =>{
        console.log("Error fetching error payOrder: ", error);
      }
    }
    );
  }

  createOrder(){
    if(!this.isCorrectOrder()){
      alert(this.errorMessage)
      return;
    }
    this.orderService.createOrder(this.newOrder).subscribe({
      next: (createOrder) =>{        
        this.orders.push(createOrder);
        this.resetOrder()
      },
      error: (error) =>{
        console.log("Error fetching error createProduct: ", error);
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
    const button: HTMLButtonElement | null = document.getElementById('btnCreate') as HTMLButtonElement;
    if (button) {
      button.disabled = false;
    }
    this.removeUpdateButtonIfExists()
  }
  removeUpdateButtonIfExists(){
    const button = document.getElementById('btnUpdate');
    button?.remove();
  }

  addItemInOrder(){
    this.newOrder.orderItems.push({id: 0, productId: 0, quantity: 0});
  }
  addQuantityItem(indexBy : number){
    this.newOrder.orderItems[indexBy].quantity++;
  }

  minusQuantityItem(indexBy : number){
    if(this.newOrder.orderItems[indexBy].quantity > 1){
      this.newOrder.orderItems[indexBy].quantity--;
    }
  }

  prepareBeforeUpdate(order: Order){
    this.newOrder = order;
    const container = document.getElementById('container');
    if(!document.getElementById('btnUpdate')){
      const newButton = document.createElement('button');
      newButton.textContent = 'Update Product';
      newButton.className = "btn btn-primary"
      newButton.id = "btnUpdate"
      newButton.addEventListener('click', () => {
          this.updateOrder();
          this.resetOrder();
          newButton.remove()
          const button: HTMLButtonElement | null = document.getElementById('btnCreate') as HTMLButtonElement;
          if (button) {
            button.disabled = false;
          }
      });
      container?.appendChild(newButton);
    }
    const button: HTMLButtonElement | null = document.getElementById('btnCreate') as HTMLButtonElement;
    if (button) {
      button.disabled = true;
    }
    container?.scrollIntoView({ behavior: 'smooth'});;
  }

  updateOrder(){
    if(!this.isCorrectOrder()){
      alert(this.errorMessage)
      return;
    }
    this.orderService.updateProduct(this.newOrder.id, this.newOrder).subscribe({
      next: (updateOrder) =>{
        const index = this.orders.findIndex(t => t.id === updateOrder.id);
        if (index !== -1) {
            this.orders[index] = updateOrder;
        }
      },
      error: (error) =>{
        console.log("Error fetching error updateOrder: ", error);
        this.loadOrders();
      }
    }
    );;
  }

  isCorrectOrder() : Boolean{
    this.errorMessage = '';
    var items = this.newOrder.orderItems;
    for (var item of items) {
      if(item.productId == null || item.productId <= 0){
        this.errorMessage += "invalid name product\n";
        return false;
      }

      if(item.quantity == null || item.quantity <= 0){
        this.errorMessage += "invalid quantity with product: " + this.getProductNameById(item.productId) + "\n";
      }
    }
    if(this.errorMessage == ''){
      return true;
    }
    return false;
  }
}
