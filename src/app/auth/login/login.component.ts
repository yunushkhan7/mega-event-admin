import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  showLoader = false;
  isAuthenticated: boolean;
  isCompanySelected: boolean;
  loginType = 'email';
  captchaValue: string = '';
  hide = true;
  permissions: any;
  currentUser: any;
  submitted: boolean;
  typedcheck = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.loginForm = this.fBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required,])]
    });
    
  }

  ngOnInit() { }

  ngAfterViewInit(){
    
  }

  submitForm(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.showLoader = true;
      const formData = {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      };

      this.authService.login(formData).subscribe((response) => {
        this.showLoader = false;
        if (response) {
          if (response.isSuccessfull) {
            localStorage.setItem('userGuid', response.userGuid);
            localStorage.setItem('email', response.email);
              this.router.navigateByUrl('/login-otp');
          }
          else if (response?.isBlocked) {
            const dialogRef = this.dialog.open(ActionPopupComponent, {
              width: '530px',
              height: '320px',
              data: { Blocked: true },
              panelClass: 'timeout',
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.is_delete) {
                // ChangePasswordComponentPopup close action callback
              }
            });
          }
           else {
            if(response?.userExists == false){
              this.toastr.error(response?.message);
              
            }
            else{
              this.toastr.error(response?.message);
            this.toastr.error(response?.passwordAttempts + " Attempts Left ");
            }
          }
          if (response?.status == 'NoRole') {
            this.toastr.error(response?.message);
          }
          if (response?.status == 'Error') {
            this.toastr.error(response?.message);
          }
          
        } 
      },
        (error) => {

          if(!error?.error?.isBlocked){
            if(error?.error?.userExists == false){
              this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
  
            }
            else{
              this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
            this.toastr.error(error?.error?.passwordAttempts + " Attempts Left ");
            }
          }
          else{
            this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
          }
          // this.createCaptcha();
          
          // this.formErrors.apierror = error.error.message;
          this.showLoader = false;
          // this.loginForm.get('reCaptcha').setValidators(Validators.compose([Validators.required]));
          // this.loginForm.get('reCaptcha').updateValueAndValidity();
        }
      );
    }
  }

  check(event) {
    this.typedcheck = event.target.checked;
  }
}
