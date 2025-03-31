import { Component, OnInit } from '@angular/core';
import { Category } from '../category.models';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  newCategory: Category = {
      id: 0,
      name: ''
    }
    categories: Category[] = [];
  
    constructor(private categoryService: CategoryService){ }

    ngOnInit(): void {
      this.loadCategories();
    }

    loadCategories(){
      this.categoryService.getCategories().subscribe({
        next: (data) => {
          console.log(data);
          this.categories = data
        },
        error: (error)=>{
          console.log("Error fetching error loadProducts: ", error);
          console.log("Error 1: ", error.HttpErroResponse)
        }
      })
    }

    createCategory(){
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (createProduct) =>{
          this.categories.push(createProduct);
          this.resetCategory()
        },
        error: (error) =>{
          console.log("Error fetching error createProduct: ", error);
          // this.errorMessage = error.error;
          // console.log("Error 1: ", error.error);
          // alert(error.error)
          this.resetCategory();
          this.loadCategories();
        }
      }
      );
      this.removeUpdateButtonIfExists();
    }

    removeCategory(id: number){
      this.categoryService.deleteCategory(id);
      const index = this.categories.findIndex(c => c.id == id);
      this.categories.splice(index, 1);
      setTimeout(() => {
        this.loadCategories();
      }, 500); 
    }

    prepareBeforeUpdate(category: Category){
      this.newCategory = category;
      const container = document.getElementById('container');
      if(!document.getElementById('btnUpdate')){
        const newButton = document.createElement('button');
        newButton.textContent = 'Update Product';
        newButton.className = "btn btn-primary"
        newButton.id = "btnUpdate"
        newButton.addEventListener('click', () => {
            this.updateCategory();
            this.resetCategory();
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
  
    updateCategory(){
      this.categoryService.updateCategory(this.newCategory.id, this.newCategory).subscribe({
        next: (updateCategory) =>{
          const index = this.categories.findIndex(t => t.id === updateCategory.id);
          if (index !== -1) {
              this.categories[index] = updateCategory;
          }
        },
        error: (error) =>{
          console.log("Error fetching error updateProduct: ", error);
          this.loadCategories();
        }
      }
      );;
    }

    removeUpdateButtonIfExists(){
      const button = document.getElementById('btnUpdate');
      button?.remove();
    }
    resetCategory(){
      this.newCategory = {
        id: 0,
        name: ''
      }
      const button: HTMLButtonElement | null = document.getElementById('btnCreate') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
      }
      this.removeUpdateButtonIfExists();
    }
}
