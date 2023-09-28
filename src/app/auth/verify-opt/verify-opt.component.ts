import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-verify-opt',
  templateUrl: './verify-opt.component.html',
  styleUrls: ['./verify-opt.component.scss'],
})
export class VerifyOptComponent implements OnInit {
  otpForm: FormGroup;
  forgatAuth: any = null;
  showLoader = false;
  formErrors = {
    error: null,
    success: null,
    apierror: null,
  };
  editId = null;
  currentUser: any;
  userId: any;
  display: any;
  finished = false;
  loginRes: any;
  userMobile: any;
  newString: any;

  constructor(
    private router: Router,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.otpForm = this.fBuilder.group({
      UserGuid: [''],
      otp: [
        null,
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
    });
    this.timer(1);
    this.dataService.userForgotForm.subscribe((res) => {
      if (res) {
        this.loginRes = res;
        this.newString = this.mask(res?.MobileNo?.e164Number);
      }
    });
  }

  ngOnInit() {
    this.dataService.userMobile.subscribe((res) => {
      if (res) {
        this.userId = res;
      }
    });
  }

  submitForm(): void {
    if (this.otpForm.valid) {
      this.showLoader = true;
      const otpData = {
        UserGuid: this.userId,
        otp: this.otpForm.value.otp,
      };
      this.authService.forgot_Otp(otpData).subscribe(
        (response) => {
          this.showLoader = false;
          if (response?.status == 'Error') {
            this.toastr.error('Incorrect OTP');
          } else {
            if (response) {
              this.dataService.currentUserSubject.next(response?.user);
              this.router.navigateByUrl('/reset-password');
            }
          }
        },
        (error) => {
          this.toastr.error(error.message);
          this.showLoader = false;
        }
      );
    }
  }

  changesform() {
    this.router.navigateByUrl('/reset-password');
  }

  timer(minute) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.finished = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  // sendagain() {
  //   this.finished = false;
  //   this.authService.forgotPassword(this.loginRes).subscribe(
  //     (response) => {
  //       this.showLoader = false;
  //       if (response?.status == 'Error') {
  //         this.toastr.error(response.message);
  //       }
  //       if (response?.status != 'Error') {
  //         this.router.navigateByUrl('/verification');
  //       } else {
  //         this.toastr.error(response.message);
  //         this.formErrors.error = `* ${response.message}`;
  //         this.showLoader = false;
  //       }
  //     },
  //     (error) => {
  //       this.toastr.error(error.error.message);
  //       this.formErrors.error = `* ${error.error.message}`;
  //       this.showLoader = false;
  //     }
  //   );
  //   this.timer(1);
  // }

  mask(str) {
    const first = str.substring(0, 2);
    const last = str.substring(str.length - 3);
    const mask = str.substring(0, str.length - 3).replace(/\d/g, '*');
    return mask + last;
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }
}
