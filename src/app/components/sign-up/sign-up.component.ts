import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CustomValidator } from 'src/app/validators/custom_validator.validator';
import { ApiException } from 'src/app/models/api_exception';
import { AuthService } from 'src/app/services/auth.service';
import { MessageResponse } from 'src/app/models/message_response';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(private userService: UserService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [CustomValidator.matchPasswords]
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

    let firstName = this.f.firstName.value;
    let lastName = this.f.lastName.value;
    let email = this.f.email.value;
    let password = this.f.password.value;

    this.authService.register(firstName, lastName, password, email).subscribe(
      (response: MessageResponse) => {
        this.form.get('email')?.setErrors({ exists: null });
        Swal.fire('Registered!', response.message, 'success');
        this.router.navigate(['login']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          let apiException: ApiException = error.error;
          if (apiException.message === 'Email is not available') {
            this.form.get('email')?.setErrors({ exists: true });
            this.onSubmit();
          }
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
  }

}
