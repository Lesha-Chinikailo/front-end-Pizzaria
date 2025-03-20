import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order, OrderItem } from '../order.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { buffer, catchError, map, Observable, of } from 'rxjs';
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


  // selectedValues: number[] = []; // Массив выбранных значений

  isProductAvailableFromList(productId : number) : boolean{
    if(productId === 0){
      return true;
    }
    // console.log("availableProducts: ", this.availableProducts);
    
    const product = this.availableProducts.find(product => +product.id === +productId);
    
    // if(productId === 3){
    //   console.log("productId isProductAvailableFromList: ", productId);
    //   console.log("isAvailable isProductAvailableFromList: ", product?.isAvailable);
    //   console.log("isAvailable result: ", product?.isAvailable ?? false);
    // }
    // console.log("product: ", product);
    

    return product?.isAvailable ?? false;
  }

  //used for quantity
  isProductAvailable(productId: number): boolean {
    // console.log("productId: ", productId);
    
    if(productId === 0){
      return true;
    }
    // const product = this.availableProducts.find(product => product.id === productId);
    // console.log("producd isAvailable: ", product?.isAvailable);
    // return product?.isAvailable ?? false;
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

  getFilteredProducts(): Product[] {
    // Возвращаем только те продукты, которые не выбраны или совпадают с текущим значением

    // const selectedProductIds : number[] = this.newOrder.orderItems.map(item => +item.productId);
    // console.log("select", selectedProductIds);
    
    return this.availableProducts.filter(
      product => product.isAvailable
    );
  }

  ngOnInit(): void {    
    this.loadOrders();
    this.fetchProductAvailability();
  }

  loadOrders(){
    console.log("load Orders");
    
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


  // isProductAvailable(productId : number) : boolean{
  //   console.log("has: ", this.availableProducts.has(productId));
    
  //   return this.availableProducts.has(productId);
  // }

  fetchProductAvailability() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log("products: ", products.map(i => i.id));
        
        // this.availableProducts = new Set(products.map(product => product.id));
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
        console.log("order is paid: ",  orderId.orderId);
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

  // getNameProductByProductId(productId : number) : string{
  //    this.productService.getProductById(productId).subscribe({
  //     next: (product) =>{
  //       console.log(product.name);
  //       if (product.name !== null && product.name !== undefined) {
  //          product.name;
  //       }
  //     },
  //     error: (error) => {
  //       console.log("Error fetching error prepareBeforeUpdate: ", error);
  //       return "";
  //     }
  //   })
  // }

  getNameProductByProductId(productId: number): Observable<string> {
    return this.productService.getProductById(productId).pipe(
        map(product => product.name || ""), // Fallback to empty string if name is null/undefined
        catchError(error => {
            console.error("Error fetching product name:", error);
            return of(""); // Return an empty Observable with an empty string
        })
    );
}


  createOrder(){
    if(!this.isCorrectOrder()){
      alert(this.errorMessage)
      return;
    }
    this.orderService.createOrder(this.newOrder).subscribe({
      next: (createOrder) =>{
        console.log(createOrder);
        
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

  prepareBeforeUpdate(order: Order){
    this.newOrder = order;
    // for (let item of order.orderItems) {
    //   console.log("is: ", !this.availableProducts.some(p => p.id === item.productId));
      
    //   if(!this.availableProducts.some(p => p.id === item.productId)){
    //     const select = document.getElementById('select' + item.id);
        
    //     if(select){
    //       console.log("something");
    //       this.getNameProductByProductId(item.productId).subscribe(name => {
    //         console.log(name);
            
    //         select.textContent = name; // Assign the resolved value to textContent
    //     });
    //     }
    //   }
    // }

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
      alert("incorrect values")
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
        this.errorMessage += "invalid productId\n";
      }
      if(item.quantity == null || item.quantity <= 0){
        this.errorMessage += "invalid quantity\n";
      }
    }
    if(this.errorMessage == ''){
      return true;
    }
    return false;
  }
}
