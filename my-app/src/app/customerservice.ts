import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Customerservice {
  constructor() {}
  customers = 
  [ {"customerid":"C1","customername":"AlmuDuck"}
  ]
  products = 
  [ {"id":"p1","name":"BỏngLao","price":100},
    {"id":"p2","name":"mì kéo","price":120},
    {"id":"p3","name":"chân gà","price":200},
    {"id":"p4","name":"cá viên cô tám","price":90}
  ]
  getAllCustomers() 
  {
    return this.customers;
  }
  getAllProducts() 
  {
    return this.products;
  }
}
