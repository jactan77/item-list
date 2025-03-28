import {AbstractControl, ValidationErrors, Validators} from '@angular/forms';


export function valuesSignupValidator(formGroup:AbstractControl): ValidationErrors | null{
  const password: string = formGroup.get('password')?.value;
  const confirmPassword: string = formGroup.get('confirmPassword')?.value;
  if(password !== confirmPassword){
      return {
        invalidPassword: true
      };
  }
  return null;
}
