import { Component } from '@angular/core';
import { BookAPIService } from '../myservices/book-apiservice';
import { Book } from '../classes/ibooks';

@Component({
  selector: 'app-book-new',
  standalone: false,
  templateUrl: './book-new.html',
  styleUrl: './book-new.css',
})
export class BookNew {
  book=new Book();
  books:any
  errMessage:string=''
  constructor(private _service: BookAPIService){
    this._service.getBooks().subscribe({
    next:(data)=>{this.books=data},
    error:(err)=>{this.errMessage=err}
    })
  }
  postBook()
  {
    alert("Book name="+this.book.BookName)
    this._service.postBook(this.book).subscribe({
      next:(data)=>{this.books=data},
    error:(err)=>{this.errMessage=err}
    })
  }
}
