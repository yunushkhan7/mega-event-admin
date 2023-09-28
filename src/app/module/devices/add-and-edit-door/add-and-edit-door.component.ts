import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-and-edit-door',
  templateUrl: './add-and-edit-door.component.html',
  styleUrls: ['./add-and-edit-door.component.scss']
})
export class AddAndEditDoorComponent implements OnInit {
  doorForm: FormGroup;
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
  isEditing = false;
  editId = null;
  constructor(   private spinner: NgxSpinnerService,
    private _devicesService: DevicesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService,
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
    }
    if (this.isEditing) {
      this.getEditObject();
    }else{
      this.AddLocation()
    }
    this.doorForm = this.formBuilder.group({
      name: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      locationId: ["", [Validators.required]],
      direction: ["", [Validators.required]],
      qrReaderId: ["", [Validators.required]],
      ethernetId: ["", [Validators.required]],
      lastEditedBy: ["0"],
      offSetValue: ["", [Validators.required]],
      // maxTimeLimit: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  onChange(data) {
    this.pageno = data;
  }

  AddLocation() {
    this.getVenueList()
    this.getAllQrReaderList();
    this.getAllEthernetList()
  }

  getEditObject() {
    this._devicesService.getDoorById(this.editId).subscribe((res:any)=>{
      if(res?.status == "Ok"){
        this.EditDoor(res?.data)
      }
      else{
        this.toastr.error(res?.message ? res?.message : res?.Message);
       }
    },(error)=>{
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    })
  }

  getAllEthernetList(){ 
    this._devicesService.getAllEthernetList({}).subscribe((res: any) => {
      this.ethernets = res?.data?.data
      // this.ethernets = res?.data.filter((el) => {
      //   return !this.doorList.find((element) => {
      //     return element.ethernetId === el.id;
      //   });
      // });
    });

  }

  getAllQrReaderList(){
    this._devicesService.GetAllQrReaderList({}).subscribe((res: any) => {
      this.qrreaders = res?.data?.data
      // this.qrreaders = res?.data.filter((el) => {
      //   return !this.doorList.find((element) => {
      //     return element.qrReaderId === el.id;
      //   });
      // });
    });
  }
  
  EditDoor(doordata) {
      this.editId=doordata?.id
      this.addAndRemoveController(doordata?.direction)
    this.doorForm.patchValue({
      name: doordata?.name,
      locationId: doordata?.locationId,
      direction:doordata?.direction,
      qrReaderId:doordata?.qrReaderId,
      ethernetId:doordata?.ethernetId,
      lastEditedBy:'0',
      offSetValue: doordata?.offSetValue,
      maxTimeLimit: doordata?.maxTimeLimit,
      });
    this.getVenueList()
    this.getAllQrReaderList();
    this.getAllEthernetList()
    this.editdoor = true;
    this.adddoor = false;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  Cancel() {
    this.location.back();;
  }

  SaveDoor() {
    if(this.doorForm.valid){
      const datatosend = {
        name: this.doorForm.value?.name,
        locationId: Number(this.doorForm.value?.locationId),
        direction: this.doorForm.value?.direction,
        qrReaderId: Number(this.doorForm.value?.qrReaderId),
        ethernetId: Number(this.doorForm.value?.ethernetId),
        lastEditedBy:'0',
        offSetValue: this.doorForm.value?.offSetValue,
        maxTimeLimit: this.doorForm.value?.maxTimeLimit,
      };
      this._devicesService.saveDoor(datatosend).subscribe((res: any) => {
        if(res?.status=='Ok'){
           this.toastr.success(res?.message);
          this.Cancel()
         }else{
          this.toastr.error(res?.message ? res?.message : res?.Message);
         }
  },(error)=>{
    this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
  });
    }
  }

  UpdateDoor() {
    if(this.doorForm.valid){
      const datatosend = {
        name: this.doorForm.value?.name,
        locationId: Number(this.doorForm.value?.locationId),
        direction: this.doorForm.value?.direction,
        qrReaderId: Number(this.doorForm.value?.qrReaderId),
        ethernetId: Number(this.doorForm.value?.ethernetId),
        lastEditedBy:'0',
        id:this.editId,
        offSetValue: this.doorForm.value?.offSetValue,
        maxTimeLimit: this.doorForm.value?.maxTimeLimit,
      };
      this._devicesService.UpdateDoor(datatosend).subscribe((res: any) => {

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


  getVenueList() {
    const params = {
      "sortElement": {},
      "page": this.currentPage,
      "pageSize": this.currentPageLimit
    }

    if(this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    } else {
      delete params['sortElement'];
    }
    this.userService.getVenueList({}).subscribe((response) => {
     // this.loadingState = false;
      if (response.data) {
        this.venueList = response?.data?.data;
        this.lastpage = response?.data?.totalPages;
        this.userList = response?.data?.docs
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          response.data['totalDocs'],
          this.currentPage,
          this.currentPageLimit
        );
      } else {
       // this.venueList = [];
        this.pagination = null;
      }
    }, (error) => {
      // this.loadingState = false;
   //   this.venueList = [];
   this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
      this.pagination = null;
    });
  }

  addAndRemoveController(directionVal){
    if(directionVal=='IN'){
      this.doorForm.addControl('maxTimeLimit',new FormControl('',[Validators.required]));
    }else{
      this.doorForm.removeControl('maxTimeLimit');
    }
  }
}

