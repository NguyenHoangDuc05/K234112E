import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Listproduct1 } from './listproduct1/listproduct1';
import { Listproduct2 } from './listproduct2/listproduct2';
import { Listproduct3 } from './listproduct3/listproduct3';
import { Listcustomer } from './listcustomer/listcustomer';
import { Customerdetail } from './customerdetail/customerdetail';
import { Listcustomerservicer } from './myservices/listcustomerservicer/listcustomerservicer';
import { ListCustomerHttpService } from './myservices/list-customer-http-service/list-customer-http-service';
import { ServiceProductImageEvent } from './exercise13/service-product-image-event/service-product-image-event';
import { ServiceProductImageEventDetail } from './exercise13/service-product-image-event-detail/service-product-image-event-detail';
import { ProductComponent } from './exercise19/product-component/product-component';
import { ListProductComponent } from './exercise19/list-product-component/list-product-component';
import { ServiceProductComponent } from './exercise19/service-product-component/service-product-component';
import { RegisterForm } from './register-form/register-form';
import { FakeProductComponent } from './fake-product-component/fake-product-component';
import { ReactiveForm } from './reactive-form/reactive-form';
import { BooksComponent } from './books.component/books.component';
import { Bookdetail } from './bookdetail/bookdetail';
import { BookNew } from './book-new/book-new';
import { BookUpdate } from './book-update/book-update';
import { BookDelete } from './book-delete/book-delete';
import { Fashion } from './fashion/fashion';
import { FashionDetail } from './fashion-detail/fashion-detail';
import { Login } from './login/login';
import { MainLayout } from './main-layout/main-layout';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register';
import { Cart } from './cart/cart';
import { Exercise63 } from './exercise63/exercise63';
import { Exercise50 } from './exercise50/exercise50';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'gioithieu', component: About },
      { path: 'sanpham1', component: Listproduct1 },
      { path: 'sanpham2', component: Listproduct2 },
      { path: 'sanpham3', component: Listproduct3 },
      { path: 'list-customer', component: Listcustomer },
      { path: 'list-customer/:id', component: Customerdetail },
      { path: 'list-customer-service', component: Listcustomerservicer },
      { path: 'list-customer-service/:id', component: Customerdetail },
      { path: 'list-customer-http-service', component: ListCustomerHttpService },
      { path: 'list-customer-http-service/:id', component: Customerdetail },
      { path: 'service-product-image-event', component: ServiceProductImageEvent },
      { path: 'service-product-image-event/:id', component: ServiceProductImageEventDetail },
      { path: 'product', component: ProductComponent },
      { path: 'list-product', component: ListProductComponent },
      { path: 'service-product', component: ServiceProductComponent },
      { path: 'register', component: RegisterForm },
      { path: 'reactive-form', component: ReactiveForm },
      { path: 'fake-product-component', component: FakeProductComponent },
      { path: 'ex39', component: BooksComponent },
      { path: 'ex41', component: Bookdetail },
      { path: 'ex41/:id', component: Bookdetail },
      { path: 'ex43', component: BookNew },
      { path: 'ex45', component: BookUpdate },
      { path: 'ex45/:id', component: BookUpdate },
      { path: 'ex47', component: BookDelete },
      { path: 'ex53', component: Fashion },
      { path: 'fashions/:id', component: FashionDetail },
      { path: 'ex63', component: Exercise63 },
      { path: 'cart', component: Cart },
      { path: 'ex50', component: Exercise50 },
    ]
  },
  { path: '**', redirectTo: '/login' } // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponent = [
  ProductComponent,
  ListProductComponent,
  ServiceProductComponent,
];