import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { SmtpService } from 'src/app/service/smtp.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/service/pagination.service';

@Component({
  selector: 'app-kiosks-list',
  templateUrl: './kiosks-list.component.html',
  styleUrls: ['./kiosks-list.component.scss'],
})
export class KiosksListComponent implements OnInit {
  objectArray: Array<any> = [];
  searchText: any = null;
  permissionObject: any = null;
  currentUser: any;
  kioskList: any = [];
  sortFieldName: any;
  isShort: any;
  currentPage = 1;
  currentPageLimit = 10;
  lastpage;
  startCounting = 1;
  sNo = [];
  showPagination: boolean = false;
  pagination: any = null;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private smtpService: SmtpService,
    private toastr: ToastrService,
    private paginationService: PaginationService,
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.UserAccounts;
    });

    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
      }
    });
  }

  ngOnInit() {
    this.getKioskList();
    this.getSNo(this.currentPage)
  }

  getKioskList() {
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
    
    this.smtpService.getKioskList(params).subscribe((response) => {
      if (response.data) {
        this.kioskList = response?.data?.data;
        this.lastpage = response?.data?.totalPages;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          response.data['totalDocs'],
          this.currentPage,
          this.currentPageLimit
        );
      }
    }, (error) => {
      
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  searchObject(text) {}
  sortData(name) {
      this.isShort = !this.isShort;
      this.sortFieldName = name;
      this.getKioskList();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      panelClass: 'delete-popup',
      data: {name: data.kioskName, venueDelete: true}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result.is_delete) {
        this.smtpService.deleteKiosk(data.id).subscribe((response) => {
          this.toastr.success(response?.message);
          this.getKioskList();
        }, (error) => {
          
        });
      }
    });
  }

  getPage(data: any) { 
    // if(this.currentPage == data.page) {
    //   this.currentPage = this.lastpage
    // } else {
    //   this.currentPage = data?.page;
    // }
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit * this.currentPage) - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getKioskList()
  }

  getSNo(currentPage) {
    this.sNo = []
    for (let i = this.startCounting; i <= this.currentPageLimit * currentPage; i++) {
      this.sNo.push({
        sNo: i
      })
    }
  }
}
