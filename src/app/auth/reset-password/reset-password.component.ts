import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonFunction, PasswordValidation } from 'src/app/shared/common';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { MYCustomValidators } from '../../module/profile/custom-validators';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']

})
export class ResetPasswordComponent implements OnInit {
@Output() changesformOutput = new EventEmitter()
  resetPasswordForm: FormGroup;
  formErrors = {
    error: null,
    success: null,
  };
  showLoader = false;
  forgatAuth: any;
  slug;
  token:any
  hide = true;
  hide1 = true;
  hide2 = true;
  currentUser: any;
  submitted:boolean;
  userId:any;

  constructor(
    private router: Router,
    private authService: UserService,
    private dataService: DataService,
    private fBuilder: FormBuilder,
    private toastrService: ToastrService,
    public _activatedRoute:ActivatedRoute
  ) {

    this.showLoader=true
    this._activatedRoute.params.subscribe(parameter => {
    this.token = parameter['token']
    this.showLoader=false
  })

    this.resetPasswordForm = this.fBuilder.group({
      new_password: [null, [
        Validators.required,
        // check whether the entered password has a number
        MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // check whether the entered password has a lower case letter
        MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // check whether the entered password has a special character
        MYCustomValidators.patternValidator(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
          { hasSpecialCharacters: true }
        ),
        Validators.minLength(14),
      ]],
      confirm_password: [null, Validators.compose([Validators.required])],
      UserGuid: [""],
    }, {
      validator: MYCustomValidators.passwordValidation()
    });
    this.dataService.forgatAuth.subscribe((response) => {
      if (response) {
        this.forgatAuth = response;
      }
    });
  }

  ngOnInit() {
    this.slug = document.URL.substring(document.URL.indexOf('=') + 1);
    this.dataService.userMobile.subscribe((res)=>{
      if (res){
        this.userId = res;
      }
    })
  }

  submitForm(): void {
    this.submitted = true
    if (this.resetPasswordForm.valid) {
      this.showLoader = true;
      const formData = {
        UserGuid: this.userId,
        oldPassword: this.resetPasswordForm.value.confirm_password,
        newPassword: this.resetPasswordForm.value.new_password,
      };

      this.authService.passwordChange(formData).subscribe((response) => {
        this.showLoader = false;
        if (response && response?.status == "Error") {
          this.toastrService.error(response.message);
          setTimeout(() => { CommonFunction.resetForm(this.resetPasswordForm); }, 1000);
        } else {
          if(response?.status == "Ok"){
            this.toastrService.success(response.message);
            this.formErrors.success = `* ${response.message}`;
            this.router.navigateByUrl('/login');
          }
        }
      }, (error: any) => {
        this.toastrService.error(error.error.message)
        this.formErrors.error = `* ${error.error}`;
        this.showLoader = false;
      });
    }
  }
  changesform(val : number){
   this.changesformOutput.emit(val)
 }

 goBack(){
  this.router.navigateByUrl('/login');
}
}
