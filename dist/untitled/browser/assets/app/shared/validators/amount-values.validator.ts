import { AbstractControl, ValidationErrors } from '@angular/forms';

export function amountValuesValidator(formGroup: AbstractControl): ValidationErrors | null {
  const amount = formGroup.get('amount')?.value;
  const minValue = formGroup.get('minValue')?.value;
  const midValue = formGroup.get('midValue')?.value;

  if (isNaN(amount) || isNaN(minValue) || isNaN(midValue) ||
    amount < 0 || minValue < 0 || midValue < 0) {
    return {
      invalidNumbers: true
    };
  }

if((amount && minValue) && midValue){
  if (amount <= minValue || minValue >= midValue || midValue >= amount) {
    return {
      invalidRange: true
    };
  }
  }

  return null;
}
