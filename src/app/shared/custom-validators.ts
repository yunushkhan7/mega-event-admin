import { ValidationErrors, ValidatorFn, AbstractControl,FormGroup, FormControl } from "@angular/forms";

export class MYCustomValidators {
  static equalTo(password: FormControl): ValidatorFn {
    throw new Error("Method not implemented.");
  }
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordValidation() {
    return (AC: AbstractControl) => {
      let password = AC.get('password').value;
      let confirmpassword = AC.get('confirm_password').value;
      if (password !== confirmpassword) {
        return AC.get('confirm_password').setErrors({ validatePassword: true });
      }
    };
  }

  static passwordValidation2() {
    return (AC: AbstractControl) => {
      let new_password = AC.get('new_password').value;
      let confirmpassword = AC.get('confirm_password').value;
      if (new_password !== confirmpassword) {
        return AC.get('confirm_password').setErrors({ validatePassword: true });
      }
    };
  }

}
