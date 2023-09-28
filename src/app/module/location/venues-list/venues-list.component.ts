import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-venues-list',
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.scss'],
})
export class VenuesListComponent implements OnInit {
  selected = 'option2';
  currentPageLimit = environment.defaultPageLimit;
  filterColumns: string[] = [
    'name',
    'email',
    'mobileNo',
    'roleName',
    'lastLoginOn',
  ];
  loadingState = true;
  searchText: any = null;
  permissionObject: any = null;
  currentUser: any;
  objectArray = [];
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
  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private userService: UserService,
    private paginationService: PaginationService,
    private toastr: ToastrService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.UserAccounts;
    });
  }

  ngOnInit() {
    this.dataService.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
      }
    });
    this.getUserAccount()
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
  text = '';
  searchObject(text) {}
  sortData(name) {
      this.isShort = !this.isShort;
      this.sortFieldName = name;
      this.getUserAccount();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      panelClass: 'delete-popup',
      data: {name: data.name, venueDelete: true}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result.is_delete) {
        this.userService.deleteVenue(data.id).subscribe((res) => {
          if (res?.status=='Ok') {
            this.toastr.success(res?.message ? res?.message : res?.Message);
            this.getUserAccount(); 
          }else{
            this.toastr.error(res?.message ? res?.message : res?.Message);
          }
          
        }, (error) => {
          this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        });
      }
    });
  }
  getUserAccount() {
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
    this.userService.getVenueList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response?.data?.data;
        this.lastpage = response?.data?.totalPages;
        this.userList = response?.data?.docs
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          response.data['totalDocs'],
          this.currentPage,
          this.currentPageLimit
        );
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.pagination = null;
    });
  }

  gotoEdit(id) {
    this.router.navigate(['location/edit/'+id])
  }

  getPage(data: any) { 
    if(data?.limit != this.currentPageLimit) {
      if(this.currentPage == data.page) {
        this.currentPage = 1
      } else {
        this.currentPage = data?.page;
      }
    } else {
      if(this.currentPage == data.page) {
        this.currentPage = this.lastpage
      } else {
        this.currentPage = data?.page;
      }
    }
    
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit * this.currentPage) - (this.currentPageLimit - 1)
    this.getUserAccount()
  }
}
