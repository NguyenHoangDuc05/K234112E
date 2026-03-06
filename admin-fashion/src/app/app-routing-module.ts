import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionDetail } from './fashion-detail/fashion-detail';
import { FashionList } from './fashion-list/fashion-list';

const routes: Routes = [
  { path: '', component: FashionList },
  { path: 'fashion/:id', component: FashionDetail },       // xem
  { path: 'fashion/edit/:id', component: FashionDetail },  // sửa
  { path: 'fashion/new', component: FashionDetail }        // thêm
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
