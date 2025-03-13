import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../user.models';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: UserLogin = {
      username: '',
      password: ''
  }

  constructor(private authService: AuthService, private router:Router){}
  
    login(){
      this.authService.login(this.user).subscribe({
        next: (tokenDto) =>{
          console.log("login successfully: with token: ", tokenDto.token);
          this.resetUser();
          sessionStorage.setItem("Authorization", tokenDto.token);
          this.router.navigate(['/'])
        },
        error: (error) =>{
          console.log('error user login: ', error)
          alert(JSON.stringify(error))
        }
      });
    }

    logout(){
      sessionStorage.removeItem("Authorization");
    }
  
    resetUser(){
      this.user = {
        username: '',
        password: ''
      }
    }
    redirectToRegister(){
      this.router.navigate(['/register'])
    }
}
