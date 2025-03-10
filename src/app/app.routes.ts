import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';


export const routes: Routes = [  
    { path: 'products', component: ProductComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' } // Optional: Redirect root URL to /products
];
