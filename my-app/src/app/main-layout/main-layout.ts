import { Component } from '@angular/core';
import { AuthService } from '../myservices/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}