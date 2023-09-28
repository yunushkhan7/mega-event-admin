import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DevicesService } from 'src/app/service/devices.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-and-edit-qr-reader',
  templateUrl: './add-and-edit-qr-reader.component.html',
  styleUrls: ['./add-and-edit-qr-reader.component.scss']
})
export class AddAndEditQrReaderComponent implements OnInit {

  qrReaderForm: FormGroup;
  error: string;
  addlocation = false;
  editlocation = false;
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
  isEditing = false;
  editId = null;
  constructor(private spinner: NgxSpinnerService,
    private _devicesService: DevicesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.qrReaderForm = this.formBuilder.group({
      deviceName: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      hostName: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      port: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
  }
  onChange(data) {
    this.pageno = data;
  }

  getEditObject() {
    this._devicesService.getQrReaderById(this.editId).subscribe((res:any)=>{
      if(res?.status == "Ok"){
        this.EditQr(res?.data)
      }
      else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    })
  }


  EditQr(data) {
    this.editId=data?.id
    this.qrReaderForm.patchValue({
      deviceName:data?.deviceName,
      hostName: data?.hostName,
      port:data?.port,
      });
    this.editlocation = true;
    this.addlocation = false;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  Cancel() {
    this.location.back();;
  }

  saveQr() {
    if(this.qrReaderForm.valid){
      const datatosend = {
        deviceName: this.qrReaderForm.value.deviceName,
        port: Number(this.qrReaderForm.value.port),
        hostName: this.qrReaderForm.value.hostName,
      };
      this._devicesService.saveQrReader(datatosend).subscribe((res: any) => {
       if(res?.status=='Ok'){
        this.toastr.success(res?.message ? res?.message : res?.Message);
        this.Cancel()
       }
       else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    });
    }
  }

  updateQr() {
    if(this.qrReaderForm.valid){
      const datatosend = {
        deviceName: this.qrReaderForm.value.deviceName,
        port: Number(this.qrReaderForm.value.port),
        hostName: this.qrReaderForm.value.hostName,
        id:this.editId
      };

      this._devicesService.updateQrReader(datatosend).subscribe((res: any) => {
        if(res?.status=='Ok'){
          this.toastr.success(res?.message ? res?.message : res?.Message);
          this.Cancel()
         }else{
          this.toastr.error(res?.message ? res?.message : res?.Message);
         }
      },(error)=>{
        this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
      });
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

}
