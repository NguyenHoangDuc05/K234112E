import { Component } from '@angular/core';
import { Student } from '../classes/student';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  studentModel = new Student(
    "",
    "",
    "",
    "",
    ""
  );
  courses = ['Python', 'Golang', 'Angular'];

  errFlag = false;

  validateCourse(value: any): void {
    if (value === 'none') {
      this.errFlag = true;
    } else {
      this.errFlag = false;
    }
  }
}