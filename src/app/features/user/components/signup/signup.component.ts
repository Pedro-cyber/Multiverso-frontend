import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public user: User = new User();
  public username: FormControl;
  public email: FormControl;
  public password: FormControl;
  public confirmpassword: FormControl;
  public signupForm: FormGroup;
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
    ) { }

  ngOnInit(): void {

    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      Validators.pattern('^[a-zA-Z0-9]*$')
    ]);

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.confirmpassword = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.signupForm = this.formBuilder.group(
      {
        name: this.username,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword,
      },
      {
        validator: this.mustMatch('password', 'confirmpassword')
      }
    );
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  public signup(): void {
    this.user.username = this.username.value;
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    this.user.avatar= 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
    this.isLoading= true;
    this.userService.createUser(this.user);
  }

}
