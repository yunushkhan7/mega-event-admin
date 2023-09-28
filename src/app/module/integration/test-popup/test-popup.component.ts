import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
@Component({
  selector: 'app-test-popup',
  templateUrl: './test-popup.component.html',
  styleUrls: ['./test-popup.component.scss']
})
export class TestPopupComponent implements OnInit {

  addForm: FormGroup;
  addFormSms: FormGroup;
  showLoader = false;
  testPopUp = 'test'
  smsPopUp = 'sms'
  submitted : boolean;
  // @ViewChild('MobileNo')
  // public MobileNo;
  
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TestPopupComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: TestPopupComponent,
  ) {
    this.addForm = this.fb.group({
      cardNo: ["", Validators.compose([Validators.required])]
    });

    this.addFormSms = this.fb.group({
      MobileNo: ["", Validators.compose([Validators.required, Validators.maxLength(15)])]
    });

    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, { disableClose: true });
    this.dialogRef.close(false);
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
