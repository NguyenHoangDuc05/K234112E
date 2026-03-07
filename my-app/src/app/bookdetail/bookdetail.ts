import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookAPIService } from '../myservices/book-apiservice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bookdetail',
  standalone: false,
  templateUrl: './bookdetail.html',
  styleUrl: './bookdetail.css',
})
export class Bookdetail implements OnInit {
  book: any = {};
  errMessage: string = '';

  constructor(
    private _service: BookAPIService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef  // Thêm dòng này
  ) {}

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      let bookId = params.get("id");
      if (bookId != null)
        this.searchBook(bookId);
    });
  }

  searchBook(bookId: string) {
    this._service.getBook(bookId).subscribe({
      next: (data) => {
        this.book = data;
        this.cdr.detectChanges(); // Thêm dòng này
      },
      error: (err) => { this.errMessage = err; }
    });
  }
}