import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";
import {
  validateEmailFormControl,
  CommonFunction,
} from "src/app/shared/common";
import { DataService } from "src/app/service/data.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ActionPopupComponent } from "src/app/core/action-popup/action-popup.component";
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { MatStepper } from "@angular/material/stepper";

import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { MYCustomValidators } from "src/app/module/profile/custom-validators";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {

  eightCharLength = false;
  upperCase = false;
  lowerCase = false;
  numberCase = false;
  specialCase = false;
  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;
  stepThreeForm: FormGroup;
  typeSelected: string;
  Error = false;
  EmailId: string;
  UserGuid: string;
  NotMatch = false;
  password1 = false;
  hide = false;
  hide1 = false;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.typeSelected = "ball-fussion";
    this.stepOneForm = this._formBuilder.group({
      UserName: ["", Validators.required],
      EmailId: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$"),
        ],
      ],
    });

    this.stepTwoForm = this._formBuilder.group({
      UserGuid: [null],
      EmailId: [null],
      otp: ["", Validators.required],
    });

    this.stepThreeForm = this._formBuilder.group(
      {
        UserGuid: [null],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^(?=.*?[a-z])(.{23,}|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{14,23})$"
            ),
            Validators.minLength(14),
          ],
        ],
        confPassword: [
          null,
          [
            Validators.required,
            Validators.pattern(
              "^(?=.*?[a-z])(.{23,}|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{14,23})$"
            ),
            Validators.minLength(14),
          ],
        ],
      },
      {
        validator: MYCustomValidators.passwordValidation(),
      }
    );
  }

  get f() {
    return this.stepOneForm.controls;
  }
  get g() {
    return this.stepTwoForm.controls;
  }
  get h() {
    return this.stepThreeForm.controls;
  }

  ngOnInit() {}
  ForgotPasswordOTP(stepper: MatStepper) {
    if (this.stepOneForm.valid) {
      this.spinner.show();
      this.authService
        .ForgotPasswordOTP(this.stepOneForm.value)
        .subscribe((response: any) => {
          this.spinner.hide();
          if ((response.status = "Ok" && response.data.isSuccessful)) {
            this.EmailId = response?.data?.user?.email;
            this.UserGuid = response?.data?.user?.userGuid;
            Swal.fire({
              title: "Password reset email sent",
              text: "An email has been sent to your rescue email address. Follow the directions in the email to reset your password",
              allowOutsideClick: false,
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed){
                this.blankOtp()
                stepper.next();
              }
            });
          } else {
            Swal.fire({
              title: "Warning",
              text: "Please check your Username & Email",
              icon: "warning",
            });
          }
        });
    } else {
      this.stepOneForm?.controls?.["UserName"].markAsTouched();
      this.stepOneForm?.controls?.["EmailId"].markAsTouched();
    }
  }

  blankOtp(){

    this.stepTwoForm.controls['otp'].reset()
  }
  PasswordResetCode(stepper: MatStepper) {
    if (this.stepTwoForm.valid) {
      this.spinner.show();
      this.stepTwoForm.value["UserGuid"] = this.UserGuid;
      this.stepTwoForm.value["EmailId"] = this.EmailId;
      this.authService
        .forgot_Otp(this.stepTwoForm.value)
        .subscribe((data: any) => {
          this.spinner.hide();
          if (data.result.issuccessfull == true) {
            this.Error = false;
            stepper.next();
          }
          else{
            this.Error = true;
            this.toastr.error("Invalid OTP");
            this.spinner.hide();
          }
        },(error)=>{
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
      this.stepTwoForm?.controls?.["otp"].markAsTouched();
    }
  }
  error = false;
  emptyError = false;
  CreateNewPassword() {
    this.stepThreeForm.value["UserGuid"] = this.UserGuid;
    if (
      !this.specialCase ||
      !this.upperCase ||
      !this.lowerCase ||
      !this.eightCharLength ||
      !this.numberCase
    ) {
      this.error = true;
      this.check = true;
    } else {
      this.error = false;
      this.check = false;
    }
    // if (this.stepThreeForm.value.newPassword != this.stepThreeForm.value.confPassword) {
    //   // this.NotMatch = true;
    //   this.stepThreeForm.get('confPassword').setValidators(Validators.compose([Validators.required]));
    //   this.stepThreeForm.get('confPassword').updateValueAndValidity();
    // } else if (this.stepThreeForm.valid && this.stepThreeForm.value.newPassword == this.stepThreeForm.value.confPassword) {
    if (this.stepThreeForm.valid) {
      this.spinner.show();
      this.authService
        .CreateNewPassword(this.stepThreeForm.value)
        .subscribe((response: any) => {
          this.spinner.hide();
          if (response.data && response?.status == "ok") {
            this.toastr.success(response?.message ? response?.message : response?.Message);
            this.router.navigateByUrl("login");
            // window.location.href = environment.redirectSessionTimeout;
          } else {
            this.toastr.error(response?.message ? response?.message : response?.Message);
          }
        },(error) => {
          this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        });
    } else {
      this.stepThreeForm.controls["newPassword"].markAsTouched();
      this.stepThreeForm.controls["confPassword"].markAsTouched();
    }
  }

  keyPressContact(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else if (/[1-9]{1}[0-9]{9}/.test(event.keyCode)) {
      event.preventDefault();
      return true;
    } else {
      return true;
    }
  }

  onKey() {
    this.password1 =
      this.h["newPassword"].value === this.h["confPassword"].value
        ? false
        : true;
  }
  check = false;
  newPasswordCheck = false;
  show = true;
  validatePassword(data: any) {
    var valData = data.target.value;
    if (valData.length > 0) {
      this.newPasswordCheck = true;
    } else {
      this.newPasswordCheck = false;
    }

    if (valData.length >= 14) {
      this.eightCharLength = true;
      this.check = false;
    } else {
      this.eightCharLength = false;
      this.check = true;
    }
    if (valData.search(/[A-Z]/) < 0) {
      this.upperCase = false;
      this.check = true;
    } else {
      this.upperCase = true;
      this.check = false;
    }
    if (valData.search(/[a-z]/) < 0) {
      this.lowerCase = false;
      this.check = true;
    } else {
      this.lowerCase = true;
      this.check = false;
    }
    if (valData.search(/[0-9]/) < 0) {
      this.numberCase = false;
      this.check = true;
    } else {
      this.numberCase = true;
      this.check = false;
    }
    if (valData.search(/[!@#$%^&*]/) < 0) {
      this.specialCase = false;
      this.check = true;
    } else {
      this.specialCase = true;
      this.check = false;
    }
    if (
      !this.specialCase ||
      !this.upperCase ||
      !this.lowerCase ||
      !this.eightCharLength ||
      !this.numberCase
    ) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
}
