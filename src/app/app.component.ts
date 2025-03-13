import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  providers: [AuthService],
  styleUrl: './app.component.css'
})
export class AppComponent {
[x: string]: any;
  title = 'front-end-Pizzaria';
  logout(){
    sessionStorage.removeItem("Authorization");
    window.location.reload();
  }
} 
