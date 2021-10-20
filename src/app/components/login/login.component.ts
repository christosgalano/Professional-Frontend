import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiException } from 'src/app/models/api_exception';
import { CustomValidator } from 'src/app/validators/custom_validator.validator';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  @Output() onLogin: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {
    if (this.authService.isLoggedIn()) { 
      this.router.navigate(['home']).then(() => {
        window.location.reload();
      });
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    let email = this.f.email.value;
    let password = this.f.password.value;

    this.authService.login(email, password).subscribe(
      () => {
        this.router.navigate(['home']).then(() => {
          window.location.reload();
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          let apiException: ApiException = error.error;
          if (apiException.message === 'User account is locked') {
            Swal.fire('Locked!', 'Your account has been locked by the admin', 'error');
            this.ngOnInit();
          }
          else if (apiException.message === 'Bad credentials') {
            this.form.get('email')?.setErrors({ invalid: true });
            this.onSubmit();
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    )
  }
}
