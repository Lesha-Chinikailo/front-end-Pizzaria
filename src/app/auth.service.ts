import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenDto, UserLogin, UserRegister } from './user.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8083/api/v1/' + 'users';

  constructor(private http:HttpClient) { }

  register(user:UserRegister): Observable<UserRegister>{    
      return this.http.post<UserRegister>(this.baseUrl + "/register", user);
  }

  login(user:UserLogin): Observable<TokenDto>{    
    return this.http.post<TokenDto>(this.baseUrl + "/login", user);
  }

  validate(token : string | null) : Observable<any>{
    if(token !== null){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(this.baseUrl + "/validate", {headers});
    }
    return this.http.get(this.baseUrl + "/validate");
  }
}
