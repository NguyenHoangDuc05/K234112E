import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../myservices/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Tối ưu hiệu năng
})
export class Login implements OnInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ← Inject ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.pipe(take(1)).subscribe((loggedIn) => {
      if (loggedIn) this.router.navigate(['/home']);
    });

    this.authService.getLoginCookie().subscribe((data) => {
      if (data.username) this.username = data.username;
      if (data.password) this.password = data.password;
      this.cdr.markForCheck(); 
    });
  }

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.cdr.markForCheck();  

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        if (!success) {
          this.error = 'Invalid username or password';
        }
        this.cdr.markForCheck();  
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid username or password. Check server is running on port 3002.';
        this.cdr.markForCheck();  
      }
    });
  }

  detectChanges(): void {
    this.cdr.detectChanges();
  }
  markForCheck(): void {
    this.cdr.markForCheck();
  }
  detachChangeDetection(): void {
    this.cdr.detach();
  }
  reattachChangeDetection(): void {
    this.cdr.reattach();
  }
}