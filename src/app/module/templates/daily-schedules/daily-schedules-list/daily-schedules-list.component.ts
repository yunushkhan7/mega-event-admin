import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { ScheduleService } from 'src/app/service/schedule.service';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-daily-schedules-list',
  templateUrl: './daily-schedules-list.component.html',
  styleUrls: ['./daily-schedules-list.component.scss'],
})
export class DailySchedulesListComponent implements OnInit {
  selected = 'option2';
  permissionObject: any;
  lastpage: any;
  currentUser: any;
  objectArray = [];
  showPagination: boolean = false;
  pagination: any = null;
  currentPage: any = 1;
  startCounting = 1;
  sortFieldName: any;
  sNo = [];
  filter2: any = [];
  filter: any = [];
  isShort: any = false;


  currentPageLimit = environment.defaultPageLimit;




  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private scheduleService: ScheduleService,
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
    this.getSchedules();
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  getSchedules() {
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









    this.scheduleService.getAllSchedule(params).subscribe((res) => {
      if(res.data){
        this.objectArray = res?.data?.data  
      this.lastpage = res?.data?.totalPages;
       
      this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          res.data['totalDocs'],
          this.currentPage,
          this.currentPageLimit
        );
      }else{
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.objectArray = [];
      this.pagination = null;
    });
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit * this.currentPage) - (this.currentPageLimit - 1)
    this.getSNo(this.currentPage)
    this.getSchedules()
  }

  getSNo(currentPage) {
    this.sNo = []
    for (let i = this.startCounting; i <= this.currentPageLimit * currentPage; i++) {
      this.sNo.push({
        sNo: i
      })
    }
  }


  sortData(name) {}

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.scheduleName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.scheduleService.deleteSchedule(result?.id).subscribe((res) => {
          if (res?.status=='Ok') {
            this.toastr.success(res?.message);
            this.getSchedules();   
          }else{
            this.toastr.error(res?.message);
          }
          
        })
      }else{}
    });
  }
}
