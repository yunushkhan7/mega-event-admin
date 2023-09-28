import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DevicesService } from 'src/app/service/devices.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-and-edit-ethernet',
  templateUrl: './add-and-edit-ethernet.component.html',
  styleUrls: ['./add-and-edit-ethernet.component.scss']
})
export class AddAndEditEthernetComponent implements OnInit {

  ethernetForm: FormGroup;
  addlocation = false;
  editlocation = false;
  locationarr = [];
  ethernetList = []
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
    this.ethernetForm = this.formBuilder.group({
      deviceName: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      hostName: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      port: ["", [Validators.required]],
      delaySeconds: ["", [Validators.required]],
      channel: ["", [Validators.required]],
      status: ["", [Validators.required]],

    });
  }

  ngOnInit(): void {
  }
  onChange(data) { this.pageno = data; }

  getEditObject() {
    this._devicesService.getEthernetById(this.editId).subscribe((res:any)=>{
      if(res?.status == "Ok"){
        this.EditEithernet(res?.data)
      }else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    })
  }
  
  
  EditEithernet(data) {
    this.editId=data?.id
    data.channel = String(data.channel);
    this.ethernetForm.patchValue({
      deviceName:data?.deviceName,
      hostName: data?.hostName,
      port:data?.port,
      delaySeconds:data?.delaySeconds,
      channel: data?.channel,
      status: (data.status == true) ? "true" : "false"
      });
    this.editlocation = true;
    this.addlocation = false;
    this.spinner.show();
    setTimeout(() => { this.spinner.hide() }, 500);
  }

  Cancel() {
    this.location.back();;
  }

  SaveEthernet() {
if(this.ethernetForm.valid){
  const datatosend = {
    deviceName: this.ethernetForm.value.deviceName,
    port: Number(this.ethernetForm.value.port),
    hostName: this.ethernetForm.value.hostName,
    delaySeconds: Number(this.ethernetForm.value.delaySeconds),
    channel: Number(this.ethernetForm.value.channel),
    status: (this.ethernetForm.value.status == "true") ? true : false
  };
  this._devicesService.saveEthernet(datatosend).subscribe((res: any) => {
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

  UpdateEthernet() {
    if(this.ethernetForm.valid){
      const datatosend = {
        deviceName: this.ethernetForm.value?.deviceName,
        port: Number(this.ethernetForm.value?.port),
        hostName: this.ethernetForm.value?.hostName,
        delaySeconds: Number(this.ethernetForm.value?.delaySeconds),
        channel: Number(this.ethernetForm.value.channel),
        status: (this.ethernetForm.value.status == "true") ? true : false,
        id:this.editId
      };

      this._devicesService.updateEthernet(datatosend).subscribe((res: any) => {
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
  

  
  keyPressContact(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else if (/[1-9]{1}[0-9]{9}/.test(event.keyCode)) {
      event.preventDefault(); return true;
    } else { return true; }
  }

  keyPressContacts(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else if (/[1-9]{1}[0-9]{9}/.test(event.keyCode)) {
      event.preventDefault(); return true;
    } else { return true; }
  }

  CheckDeviceStatus(eth) {  
  }

  sortData(a){

  }
  
}