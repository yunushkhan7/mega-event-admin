import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { SmtpService } from 'src/app/service/smtp.service';
import Swal from 'sweetalert2';
import { MYCustomValidators } from '../../profile/custom-validators';
import { emailRegEx } from 'src/app/shared/common';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';


@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss'],
})
export class SmtpComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id: any;
  permissionObject: any = null;
  submitted: boolean;
  hide = true;
  
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private smtpService: SmtpService,
    private toastr: ToastrService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.APIIntegration;
    });

    this.addForm = this.fb.group({
      // momapiEndpoint: ['', Validators.compose([Validators.required])],
      hostName: ['', Validators.compose([Validators.required])],
      portNo: ['', Validators.compose([Validators.required])],
      fromEmail: ["", Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
      senderUserName: ['', Validators.compose([Validators.required])],
      // password: ['', Validators.compose([Validators.required])],
      password: ["", [
        Validators.required
      ]],
    });
    this.getEditObject();
  }

  ngOnInit(): void {}

  getEditObject() {
    this.smtpService.getAllSmtp().subscribe((res) => {
      this.addForm.patchValue(res?.data)
    })
  }

  onSubmit(){
    this.submitted = true;
    if(this.addForm.valid){
      let payload = {
        "hostName": this.addForm.get('hostName')?.value,
        "portNo": this.addForm.get('portNo')?.value,
        "password": this.addForm.get('password')?.value,
        "fromEmail": this.addForm.get('fromEmail')?.value,
        "senderUserName": this.addForm.get('senderUserName')?.value
      }
      this.smtpService.updateSmpt(payload).subscribe((res) => {
        if(res.message == "success"){
          this.toastr.success("Submitted Successfully");
        }
        else if(res.message == "Invalied UserName or Password"){
          this.toastr.error("Invalied UserName or Password");
        }
        else{
          this.toastr.error(res.message);
        }
      },
      (err => {
        this.toastr.error(err.message);
      })
      )
    }
    
  }

  // testPopUp() {
    testPopUp() {
      (async () => {
        const { value: email } = await Swal.fire({
          title: 'Send test email',
          input: 'email',
          inputLabel: 'Your email address',
          inputPlaceholder: 'Enter your email address',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Send mail',
          showCloseButton: true,
          closeButtonAriaLabel: 'Close',
          backdrop: false,
        });

  
        if (email) {
          // this.spinner.show();
          // let payload = {
          //   'emailId': email
          // }
          this.smtpService.SendTestMail(email).subscribe((data12) => {
            if (data12) {
              // Swal.fire({
              //   title: 'Email is Sent to  <br>' +  email,
              //   backdrop: false,
              // });
              const dialogRef = this.dialog.open(ActionPopupComponent, {
                width: '530px',
                height: '320px',
                data: { EmailSent: true, Email:email },
                panelClass: 'timeout',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((result) => {
                if (result && result.is_delete) {
                  // ChangePasswordComponentPopup close action callback
                }
              });
              // this.spinner.hide();
            }
          });
        }
      })();
    }
  // }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  reset() {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '530px',
      height: '320px',
      data: { isWarning: true },
      panelClass: 'timeout',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.getEditObject();
      }
    });
  }
}
