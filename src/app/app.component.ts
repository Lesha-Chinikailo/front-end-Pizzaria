import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  providers: [AuthService],
  styleUrl: './app.component.css'
})
export class AppComponent {
[x: string]: any;
  title = 'front-end-Pizzaria';

  constructor(private router:Router){}
  
  toProducts(){
    this.router.navigate(['/products'])
  }
  toCategories(){
    this.router.navigate(['/categories'])
  }
  toOrders(){
    this.router.navigate(['/orders'])
  }

  logout(){
    sessionStorage.removeItem("Authorization");
    window.location.reload();
  }

  getusername() : string | null{
    if(sessionStorage.getItem("Authorization") == null) {
      return "unknown";
    }
    return null;
  }
} 
