import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DevicesService } from 'src/app/service/devices.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-qr-readers',
  templateUrl: './qr-readers.component.html',
  styleUrls: ['./qr-readers.component.scss']
})
export class QrReadersComponent implements OnInit {
  locationarr = [];
  qrList = [];
  clinics = [];
  doctors = [];
  spaces = false;
  q: any;
  searchText;
  page = 1;
  pageno: any = 5;
  key: string = 'userName';
  reverse: boolean = false;
 
  editId:any
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  

  constructor(
    private spinner: NgxSpinnerService,
    private _devicesService: DevicesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAllQr();
  }
  onChange(data) {
    this.pageno = data;
  }

  getAllQr() {
    this.spinner.show();
    this._devicesService.GetAllQrReaderList({}).subscribe((res: any) => {
      if(res?.data){
        this.qrList = res?.data?.data;
      }
      this.spinner.hide();
    });
  }

  AddLocation() {
    this.router.navigate(['devices/qr-reader/add'])
  }

  DeleteQr(deletedData) {
    this._devicesService.deleteQrReader(deletedData?.id).subscribe((res: any) => {
      if(res?.status=='Ok'){
        this.getAllQr();
        this.toastr.success(res?.message ? res?.message : res?.Message);
      }else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    }
    
    );
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
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


  onDelete(deletedData: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...deletedData, isDelete: true, deletedData: deletedData?.deviceName },
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
          this.DeleteQr(deletedData)
      }
    });
  }

  gotoEdit(id) {
    this.router.navigate(['devices/qr-reader/edit/'+id])
  }

  testQrReader(testData) {
    const encodeURI = `?HostName=${encodeURIComponent(
      testData?.hostName
    )}&Port=${encodeURIComponent(
     testData?.port
    )}&QrValue=${encodeURIComponent(
      testData?.status
    )}`;
    this._devicesService.testQrReader(encodeURI).subscribe(
      (res: any) => {
      if(res?.status=='Ok'){
        this.getAllQr();
        this.toastr.success(res?.message ? res?.message : res?.Message);
      }else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    }
    );
  }

}
