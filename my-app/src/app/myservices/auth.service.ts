import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient, private router: Router) {
    // Kiểm tra token khi service khởi tạo
    const token = localStorage.getItem('authToken');
    if (token) {
      this.loggedIn.next(true);
    }
  }

  // Observable để component có thể subscribe trạng thái login
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Đăng ký
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  // Đăng nhập
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.success) {
            localStorage.setItem('authToken', 'loggedin');
            this.loggedIn.next(true);
            this.router.navigate(['/ex53']); // sau login chuyển về trang about
            return true;
          } else {
            return false;
          }
        })
      );
  }

  // Get login cookie
  getLoginCookie(): Observable<{ username: string, password: string }> {
    return this.http.get<{ username: string, password: string }>(`${this.apiUrl}/read-login-cookie`, { withCredentials: true });
  }

  // Đăng xuất
  logout() {
    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}