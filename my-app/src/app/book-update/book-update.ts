import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookAPIService } from '../myservices/book-apiservice';
import { Book } from '../classes/ibooks';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-update',
  standalone: false,
  templateUrl: './book-update.html',
  styleUrl: './book-update.css',
})
export class BookUpdate implements OnInit {
  book = new Book();
  books: any;
  errMessage: string = '';

  constructor(
    private _service: BookAPIService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      let BookId = params.get("id");
      if (BookId != null)
        this.searchBook(BookId);
    });

    this._service.getBooks().subscribe({
      next: (data) => { this.books = data; },
      error: (err) => { this.errMessage = err; }
    });
  }

  searchBook(BookId: string) {
    this._service.getBook(BookId).subscribe({
      next: (data) => {
        this.book = data;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  putBook() {
  this._service.putBook(this.book).subscribe({
    next: (data) => { this.books = data; },
    error: (err) => { this.errMessage = err; }
  });
  }
}