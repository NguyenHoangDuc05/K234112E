import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: any[] = [];
  message = '';
  private apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.http.get<{ cart: any[] }>(`${this.apiUrl}/cart`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.cart = data.cart.map(p => ({ ...p, remove: false }));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading cart', err)
      });
  }

  get total(): number {
    return this.cart.reduce((sum, p) => sum + (p.remove ? 0 : p.price * p.quantity), 0);
  }

  updateCart() {
    const items = this.cart.map(p => ({
      _id: p._id,
      quantity: p.quantity,
      remove: p.remove
    }));
    this.http.post(`${this.apiUrl}/cart/update`, { items }, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.cart = res.cart.map((p: any) => ({ ...p, remove: false }));
          this.message = '✅ Shopping cart updated!';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges();
          }, 2500);
        },
        error: (err) => console.error('Update error', err)
      });
  }

  continueShopping() {
    this.router.navigate(['/ex63']);
  }

  checkout() {
    // Mô phỏng checkout – ghi log thành công, trong thực tế sẽ lưu vào DB
    this.message = '🎉 Order placed successfully! Thank you for your purchase.';
    this.cdr.detectChanges();
    this.http.delete(`${this.apiUrl}/cart/clear`, { withCredentials: true }).subscribe();
    setTimeout(() => {
      this.message = '';
      this.cart = [];
      this.cdr.detectChanges();
    }, 3000);
  }
}
