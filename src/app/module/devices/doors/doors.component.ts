import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DevicesService } from 'src/app/service/devices.service';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.scss']
})
export class DoorsComponent implements OnInit {

  currentPageLimit = environment.defaultPageLimit;
  adddoor = false;
  editdoor = false;
  doorList = [];
  spaces = false;
  q: any;
  searchText;
  page = 1;
  pageno: any = 5;
  key: string = 'userName';
  reverse: boolean = false;
  matcher = ''
  qrreaders: any = [];
  ethernets: any = [];
  directions: any = [
    {
      direction: 'IN',
    },
    {
      direction: 'OUT',
    },
  ];
  currentUser: any;
  venueList = [];
  searchFilter: any = {};
  currentPage: any = 1;
  sortFieldName: any;
  isShort: any = false;
  showPagination: boolean = false;
  pagination: any = null;

  filters: any;
  startCounting = 1
  lastpage: any;
  filter2: any = []
  filter: any = []
  userList: any = []
  
editId:any
  constructor(
    private spinner: NgxSpinnerService,
    private _devicesService: DevicesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private paginationService: PaginationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getAllDoors();
  }

  onChange(data) {
    this.pageno = data;
  }

  getAllDoors() {
    this.spinner.show();
    this._devicesService.GetAllDoorList({}).subscribe((data: any) => {
      this.doorList = data?.data?.data;
      this.spinner.hide();
    });
  }

  AddLocation() {
    this.router.navigate(['devices/doors/add'])
  }

  gotoEdit(id) {
    this.router.navigate(['devices/doors/edit/'+id])
  }

  deleteDoors(deletedData) {
    this._devicesService.deleteDoorById(deletedData?.id).subscribe((res) => {
          if(res?.status=='Ok'){
            this.getAllDoors();
            this.toastr.success(res?.message ? res?.message : res?.Message);
          }else{
            this.toastr.error(res?.message ? res?.message : res?.Message);
           }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    });
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  onDelete(deletedData: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...deletedData, isDelete: true, deletedData: deletedData?.name },
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
                  this.deleteDoors(deletedData)
      }
    });
  }

  unLockDoor(id){
    this._devicesService.unLockDoor(id).subscribe((res: any) => {
      if(res?.status=='Ok'){
        this.toastr.success(res?.message ? res?.message : res?.Message);
        this.getAllDoors()
       }else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    });
  }
}
