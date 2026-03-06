import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService, Fashion } from '../service/fashion';

@Component({
  selector: 'app-fashion-detail',
  standalone: false,
  templateUrl: './fashion-detail.html',
  styleUrl: './fashion-detail.css',
  encapsulation: ViewEncapsulation.None
})
export class FashionDetail implements OnInit {
  fashion: Fashion | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fashionService: FashionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fashionService.getFashion(id).subscribe({
        next: (data) => {
          this.fashion = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
    }
  }

  getThumbnailSrc(base64: string): string {
    return base64 || 'assets/placeholder.jpg';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
