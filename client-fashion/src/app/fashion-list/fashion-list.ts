import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FashionService, Fashion } from '../service/fashion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fashion-list',
  standalone: false,
  templateUrl: './fashion-list.html',
  styleUrl: './fashion-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FashionList implements OnInit {
  fashions: Fashion[] = [];
  filteredFashions: Fashion[] = [];
  styles: string[] = ['CELEBRITY STYLE', 'TRENDS', 'STREET STYLE'];
  selectedStyle: string = '';
  errorMessage = '';

  constructor(
    private fashionService: FashionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fashionService.getFashions().subscribe({
      next: (data) => {
        this.fashions = data;
        this.filteredFashions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  filterFashions(): void {
    if (this.selectedStyle) {
      this.filteredFashions = this.fashions.filter(f =>
        f.style.toLowerCase().includes(this.selectedStyle.toLowerCase())
      );
    } else {
      this.filteredFashions = [...this.fashions];
    }
    this.cdr.detectChanges();
  }

  viewDetail(id: string): void {
    this.router.navigate(['/fashions', id]);
  }

  getThumbnailSrc(base64: string): string {
    return base64 || 'assets/placeholder.jpg';
  }
}
