import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [  
    { path: 'products', component: ProductComponent },
    { path: 'orders', component: OrderComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: '', redirectTo: '/orders', pathMatch: 'full' }
];
