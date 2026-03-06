import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionList } from './fashion-list/fashion-list';
import { FashionDetail } from './fashion-detail/fashion-detail';

const routes: Routes = [
  { path: '', component: FashionList },
  { path: 'fashions/:id', component: FashionDetail },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
