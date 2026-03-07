import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FakeProductService } from '../myservices/fake-product-service';

@Component({
  selector: 'app-fake-product-component',
  standalone: false,
  templateUrl: './fake-product-component.html',
  styleUrl: './fake-product-component.css',
})
export class FakeProductComponent implements OnInit {
  data: any;
  errMessage: string = '';

  constructor(
    private _service: FakeProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._service.getFakeProductData().subscribe({
      next: (data) => {
        this.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errMessage = err; }
    });
  }
}