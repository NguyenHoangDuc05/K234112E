import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; 
import { FashionAPIService } from '../myservices/fashion-api.service';

@Component({
  selector: 'app-fashion-detail',
  standalone: false,
  templateUrl: './fashion-detail.html',
  styleUrl: './fashion-detail.css'
})
export class FashionDetail implements OnInit {
  fashion: any;               
  errMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: FashionAPIService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID from route:', id);  

    if (id) {
      this.service.getFashion(id).subscribe({
        next: (data) => {
          console.log('Data received:', data); 
          this.fashion = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error:', err);
          this.errMessage = err;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('No ID found');
    }
  }
  get_image(base64: string) {
    if (base64 == null) return "";
    let prefix = "data:image/jpeg;base64,";
    if (base64.startsWith(prefix))
      return base64;
    return prefix + base64;
  }
  goBack() {
  this.location.back();
  }
}