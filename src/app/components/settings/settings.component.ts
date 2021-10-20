import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CustomValidator } from 'src/app/validators/custom_validator.validator';
import { ApiException } from 'src/app/models/api_exception';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  logged_in_user: User;

  form: FormGroup;
  submitted: boolean = false;

  constructor(private userService: UserService, private authService: AuthService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        password: ['', [Validators.minLength(6), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        confirmPassword: ['', []]
      },
      {
        validators: [CustomValidator.matchPasswords]
      }
      );
    
    this.form.get('email')?.setValue(this.logged_in_user.email);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.f.email.value !== this.logged_in_user.email!) {
      const updatedUser: User = {
        email: this.f.email.value
      }
      this.userService.updateUser(this.logged_in_user.id!, updatedUser).subscribe(
        (response: User) => {
          this.logged_in_user = response;
          Swal.fire('Success', 'Email was updated successfully', 'success');
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

    if (this.f.password.value !== '') {
      this.authService.changeUserPassword(this.logged_in_user.id!, this.f.password.value).subscribe(
        (response: User) => {
          this.logged_in_user = response;
          Swal.fire('Success', 'Password was updated successfully', 'success');
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }

    this.onReset();
  }

  onReset(): void {
    this.submitted = false;
    this.form.get('password')?.setValue('');
    this.form.get('confirmPassword')?.setValue('');
    this.form.get('email')?.setValue(this.logged_in_user.email);
  }
}
