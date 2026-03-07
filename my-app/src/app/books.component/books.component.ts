import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookAPIService } from '../myservices/book-apiservice';

@Component({
  selector: 'app-books.component',
  standalone: false,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit {
  books: any;
  errMessage: string = '';

  constructor(
    private _service: BookAPIService,
    private router: Router,
    private activeRouter: ActivatedRoute,
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

  show_detail(id: any) {
    this.router.navigate(["ex41", id]);
  }
  show_update(id:any)
    {
      this.router.navigate(["ex45",id])
    }
  request_delete(id:any)
    {
      if(confirm("Are you sure to delete book with id="+id))
      this.deleteBook(id)
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