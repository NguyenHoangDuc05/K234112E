import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FashionService, Fashion } from '../services/fashion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fashion-list',
  standalone: false,
  templateUrl: './fashion-list.html',
  styleUrl: './fashion-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // ✅ tắt encapsulation — CSS hoạt động bình thường
})
export class FashionList implements OnInit {
  fashions: Fashion[] = [];
  errorMessage = '';

  constructor(
    private fashionService: FashionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadFashions();
  }

  loadFashions(): void {
    this.fashionService.getFashions().subscribe({
      next: (data) => {
        this.fashions = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.markForCheck();
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/fashion', id]);
  }

  editFashion(id: string): void {
    this.router.navigate(['/fashion/edit', id]);
  }

  addFashion(): void {
    this.router.navigate(['/fashion/new']);
  }

  deleteFashion(id: string): void {
    if (confirm('Bạn có chắc muốn xóa fashion này?')) {
      this.fashionService.deleteFashion(id).subscribe({
        next: () => this.loadFashions(),
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.markForCheck();
        }
      });
    }
  }

  getThumbnailSrc(base64: string): string {
    return base64 || 'assets/placeholder.jpg';
  }
}