import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise63',
  standalone: false,
  templateUrl: './exercise63.html',
  styleUrl: './exercise63.css',
})
export class Exercise63 implements OnInit {
  products: any[] = [];
  toast = '';
  cartCount = 0;
  private apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCartCount();
  }

  loadProducts() {
    this.http.get<any[]>(`${this.apiUrl}/products`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.products = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading products', err)
      });
  }

  loadCartCount() {
    this.http.get<{ cart: any[] }>(`${this.apiUrl}/cart`, { withCredentials: true })
      .subscribe({
        next: (data) => this.cartCount = data.cart.reduce((sum, p) => sum + p.quantity, 0),
        error: () => { }
      });
  }

  addToCart(product: any) {
    this.http.post(`${this.apiUrl}/cart/add`, product, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.cartCount = res.cart.reduce((sum: number, p: any) => sum + p.quantity, 0);
          this.showToast(`"${product.name}" added to cart!`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error adding to cart', err)
      });
  }

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
