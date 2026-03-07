import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReactiveForm {

  regForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPass: new FormControl('', Validators.required)
  });

  submitForm() {
    console.log(this.regForm.value);
  }

  setDefaultValues() {
    this.regForm.patchValue({
      name: 'Huỳnh Giao',
      email: 'test@gmail.com',
      password: '',
      confirmPass: ''
    });
  }
}
