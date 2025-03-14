import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserRegister } from '../user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  newUser: UserRegister = {
    username: '',
    password: '',
    role: ''
  }

  constructor(private authService: AuthService, private router:Router){}

  register(){
    this.authService.register(this.newUser).subscribe({
      next: (userRegister) =>{
        console.log("regiter successfully" + userRegister.username);
        this.resetUser();
        this.router.navigate(['/'])
      },
      error: (error) =>{
        console.log('error user register: ', error)
      }
    });
  }

  resetUser(){
    this.newUser = {
      username: '',
      password: '',
      role: ''
    }
  }
}
