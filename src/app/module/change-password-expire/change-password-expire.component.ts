import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';

@Component({
  selector: 'app-change-password-expire',
  templateUrl: './change-password-expire.component.html',
  styleUrls: ['./change-password-expire.component.scss']
})
export class ChangePasswordExpireComponent implements OnInit {

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
      password: [null, Validators.compose([Validators.required])]
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
          } else {
            this.toastr.error("Invalid Credentials");
          }
          if (response?.status == 'NoRole') {
            this.toastr.error('User has no permission to access the module.');
          }
          if (response?.status == 'Error') {
            this.toastr.error('Invalid login credentials.');
          }
          if (response?.status == 'Blocked') {
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
        } 
        // else {
        //   this.formErrors.apierror = `* ${response.error[0]}`;
        // }
      },
        (error) => {
          // this.createCaptcha();
          this.toastr.error(error.error.message);
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
