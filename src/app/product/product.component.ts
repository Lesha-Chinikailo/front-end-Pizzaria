import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import {Product} from '../product.models'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  newProduct: Product = {
    id: 0,
    categoryId: undefined,
    name: '',
    price: undefined,
    quantity: undefined,
    dateTimeOfManufacture: undefined,
    isAvailable: true
  }
  products: Product[] = [];

  constructor(private productService: ProductService){

  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(){
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data
      },
      error: (error)=>{
        console.log("Error fetching error: ", error);
      }
    })
  }

  createProduct(){
    this.productService.createProduct(this.newProduct).subscribe({
      next: (createProduct) =>{
        this.products.push(createProduct);
        this.resetProduct()
      },
      error: (error) =>{
        console.log("Error fetching error: ", error);
      }
    }
    );
    this.removeUpdateButtonIfExists();
  }

  removeProduct(id: number){
    this.productService.deleteProduct(id);
  }

  prepareBeforeUpdate(product: Product){
    this.newProduct = product;
    const container = document.getElementById('container');
    if(!document.getElementById('btnUpdate')){
      const newButton = document.createElement('button');
      newButton.textContent = 'Update Product';
      newButton.className = "btn btn-primary"
      newButton.id = "btnUpdate"
      newButton.addEventListener('click', () => {
          this.updateProduct();
          this.resetProduct();
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

  updateProduct(){
    this.productService.updateProduct(this.newProduct.id, this.newProduct).subscribe({
      next: (updateProduct) =>{
        const index = this.products.findIndex(t => t.id === updateProduct.id);
        if (index !== -1) {
            this.products[index] = updateProduct;
        }
      },
      error: (error) =>{
        console.log("Error fetching error: ", error);
      }
    }
    );;
  }

  removeUpdateButtonIfExists(){
    const button = document.getElementById('btnUpdate');
    button?.remove();
  }

  resetProduct(){
    this.newProduct = {
      id: 0,
      categoryId: undefined,
      name: '',
      price: undefined,
      quantity: undefined,
      dateTimeOfManufacture: undefined,
      isAvailable: true
    }
  }
}
