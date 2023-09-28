import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { UseraccountService } from 'src/app/service/useraccount.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-account-list',
  templateUrl: './user-account-list.component.html',
  styleUrls: ['./user-account-list.component.scss'],
})
export class UserAccountListComponent implements OnInit {
   emptyParams:any={
    page:1,
    pageSize:10,
    searchFilter:{andFilter:{},orFilter:{}}
  }
  selected = 'option2';
  currentPageLimit = environment.defaultPageLimit;
  filterColumns: string[] = [
    'Name',
    'Email',
    'MobileNo',
    'RoleName'
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


  sNo = [];
  startCounting = 1
  lastpage: any;
  filter2: any = []
  userRoleFilter :any
  filter: any = [{}]
  userList: any = []

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private useraccountService: UseraccountService,
    private paginationService: PaginationService,
    private toastr: ToastrService
  ) {
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {
    this.dataService.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
        this.getUserAccount();
      }
    });

    this.getSNo(this.currentPage)
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  getUserAccount() {
    if(!this.searchText) {
      this.filter2 = [{}];
      this.filter = [{}]
    }
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter: { andFilters: this.filter, orFilters: this.filter2 }
      
    };

    let userId = this.currentUser?.id
    
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.filter2 = []
    this.useraccountService.getUserList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response?.data?.data;
        this.lastpage = response?.data?.totalPages;
        this.objectArray.forEach((element, i) => {
          this.objectArray[i]['sNo'] = this.sNo[i].sNo
        });
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

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit * this.currentPage) - (this.currentPageLimit - 1)
    this.getSNo(this.currentPage)
    this.getUserAccount()
  }

  getSNo(currentPage) {
    this.sNo = []
    for (let i = this.startCounting; i <= this.currentPageLimit * currentPage; i++) {
      this.sNo.push({
        sNo: i
      })
    }
  }

  search(text) {
  
    
    this.searchText = text;
    this.currentPage = 1;
    this.filter2 = [];
    if(this.searchText) {
      if(this.searchText != 'Active' && this.searchText != 'Blocked') {
        for (let index = 0; index < this.filterColumns.length; index++) {
          const element = this.filterColumns[index];
          this.filter2.push({
            "propertyName": element,
            "value": this.searchText,
            "caseSensitive": true,
            "operator": 6,
            "dataType": "string",
          })
        }
      } else if( this.searchText == 'Active' || this.searchText == 'Blocked') {
        this.filter2.push({
          "propertyName": 'UserStatus',
          "value": (this.searchText == 'Active') ? "0" : "1",
          "caseSensitive": true,
          "operator": 0,
          "dataType": "boolean",
        })
      }
      
    } else {
      this.filter2 = [];
    }
    
    this.getUserAccount();
  }

  sortData(name) {
    // Frontend Short
    // this.commonService.isShort = !this.commonService.isShort
    // this.objectArray = this.commonService.sortData(name, this.objectArray);

    // Backend Short
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getUserAccount();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.userName },
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.useraccountService.deleteUserAccount(result?.id).subscribe((res) => {
          if (res.status == 'Ok') {
            this.getUserAccount();
            this.toastr.success(res?.message ? res?.message : res?.Message);
          }
          else {
            this.toastr.error(res?.message ? res?.message : res?.Message);
          }
        }, (error) => {
          // this.dialog.open(ActionPopupComponent, {
          //   data: { ...err.error, isSuccess: true }
          // });

          this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        })
      }
    });
  }
}
