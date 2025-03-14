import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
        const token = sessionStorage.getItem("Authorization");
        console.log("Authorization: ", token);
        if (token) {
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        console.log("yes Authorization");
        
        return next(cloned);
        }
        console.log("no Authorization");
        return next(req);
    }
}


export function tokenIntercept(req: HttpRequest<any>, next: HttpHandlerFn, router:Router, authService:AuthService): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem("Authorization");
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      
      return next(cloned);
    }
    router.navigate(['/login'])
    return next(req);
}

// export function tokenIntercept(req: HttpRequest<any>, next: HttpHandlerFn, router:Router, authService:AuthService): Observable<HttpEvent<unknown>> {
//   const token = sessionStorage.getItem("Authorization");
//   if (token) {
//     console.log("token: ", token);
    
//     authService.validate(token).subscribe({
//       next: () => {
//         const cloned = req.clone({
//           headers: req.headers.set('Authorization', `Bearer ${token}`)
//         });
    
//         console.log("cloned: ", cloned);
//         return next(cloned);
//       },
//       error: (error) => {
//         console.log("cloned: ", error);
//         router.navigate(['/login'])
//         return next(req);
//       }
//     })
//   }
//   return next(req);
// }