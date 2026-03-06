import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FashionList } from './fashion-list/fashion-list';
import { FashionDetail } from './fashion-detail/fashion-detail';

@NgModule({
  declarations: [
    App,
    FashionList,
    FashionDetail
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  providers: [
  ],
  bootstrap: [App]
})
export class AppModule { }
