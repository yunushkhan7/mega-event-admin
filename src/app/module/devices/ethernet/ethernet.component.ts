import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DevicesService } from 'src/app/service/devices.service';


@Component({
  selector: 'app-ethernet',
  templateUrl: './ethernet.component.html',
  styleUrls: ['./ethernet.component.scss']
})
export class EthernetComponent implements OnInit {

  locationarr = [];
  ethernetList = []
  page = 1;
  pageno: any = 5;
  key: string = 'userName';
  reverse: boolean = false;
  editId:any

  constructor(
    private spinner: NgxSpinnerService,
    private _devicesService: DevicesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
  ) { 
  }

  ngOnInit(): void {
    this.getAllEthernet();
  }
  onChange(data) { this.pageno = data; }

  getAllEthernet() {
    this.spinner.show();
    this._devicesService.getAllEthernetList({}).subscribe((res: any) => {
      if(res?.data){
        this.ethernetList = res?.data?.data;
      }
        this.spinner.hide();
    });
  }

  AddEithernet() {
    this.router.navigate(['devices/ethernet/add'])
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
        this.deleteEthernet(deletedData)
      }
    });
  }

  deleteEthernet(deletedData) {
    this._devicesService.deleteEthernetById(deletedData?.id).subscribe(
      (res: any) => {
      if(res?.status=='Ok'){
        this.getAllEthernet();
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

  sortData(a){}

  gotoEdit(id) {
    this.router.navigate(['devices/ethernet/edit/'+id])
  }
  

  testEthernetReader(testData) {
    const encodeURI = `?HostName=${encodeURIComponent(
      testData?.hostName
    )}&Port=${encodeURIComponent(
     testData?.port
    )}&QrReader=${encodeURIComponent(
      testData?.status
    )}`;
    this._devicesService.testEthernetReader(encodeURI).subscribe(
      (res: any) => {
      if(res?.status=='Ok'){
        this.getAllEthernet();
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