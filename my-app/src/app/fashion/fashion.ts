import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FashionAPIService } from '../myservices/fashion-api.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-fashion',
  standalone: false,
  templateUrl: './fashion.html',
  styleUrl: './fashion.css',
})
export class Fashion implements OnInit {
  fashions: any;
  errMessage: string = '';

  constructor(
    private _service: FashionAPIService,
    private cdr: ChangeDetectorRef,
    private router: Router                           
  ) {}

  ngOnInit() {
    this._service.getFashions().subscribe({
      next: (data: any) => {
        this.fashions = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => { this.errMessage = err; }
    });
  }
  get_image(base64:string)
  {
    if(base64==null)return""
    let prefix="data:image/jpeg;base64,";
    if (base64.startsWith(prefix))
      return base64
    return prefix+base64
  }
  viewDetail(id: string) {
    this.router.navigate(['/fashions', id]);
  }
}