import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { IFakeProduct } from '../classes/iFakeProduct';

@Injectable({
  providedIn: 'root'
})
export class FakeProductService {
  private readonly apiUrl: string = '/exchange'; // Đổi thành /exchange
  
  constructor(private http: HttpClient) {}
  
  getFakeProductData(): Observable<IFakeProduct[]> {
    return this.http.get<IFakeProduct[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message));
  }
}