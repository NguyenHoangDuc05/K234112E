import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookAPIService } from '../myservices/book-apiservice';

@Component({
  selector: 'app-book-delete',
  standalone: false,
  templateUrl: './book-delete.html',
  styleUrl: './book-delete.css',
})
export class BookDelete implements OnInit {
  books: any;
  errMessage: string = '';

  constructor(
    private _service: BookAPIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._service.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  deleteBook(bookId: any) {
    this._service.deleteBook(bookId).subscribe({
      next: (data) => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errMessage = err; }
    });
  }
}