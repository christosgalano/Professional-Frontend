import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class CustomValidator {
    static cannotContainWhiteSpace(control: AbstractControl) : ValidationErrors | null {
        const password: string = control.value ? control.value : '';
        const isValid = !password.includes(' ');
        return isValid ? null : { 'whitespace': true };
    }


    static matchPasswords(control: AbstractControl): ValidationErrors | null  {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) {
            return null;
        }
        else if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ matching: true });
            return { 'matching': true };
        }
        return null;
    }
}