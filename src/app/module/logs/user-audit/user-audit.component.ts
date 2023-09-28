import { DatePipe } from "@angular/common";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { JwtService } from "src/app/service/jwt.service";
import { LogsService } from "src/app/service/logs.service";
import { PaginationService } from "src/app/service/pagination.service";
import { UserService } from "src/app/service/user.service";
import { environment } from "src/environments/environment";
import * as xlsx from "xlsx";
@Component({
  selector: "app-user-audit",
  templateUrl: "./user-audit.component.html",
  styleUrls: ["./user-audit.component.scss"],
  providers: [DatePipe],
})
export class UserAuditComponent implements OnInit {
  showLoader: boolean;
  userAuditList: any;
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  searchText: any = null;
  filters: any = [];
  filter: any = [];
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  source = true;
  module = true;
  captureDateTime = true;
  userName = true;
  information = true;
  filterColumns: string[] = ["module", "source", "userName", "information"];
  filterList: string[] = ["UserName", "module", "captureDateTime"];
  text = null;
  text2 = null;
  selectedDate: Date = new Date();
  selectedEndDate: any;
  selectedStartDate: any;
  usersName: any;
  step1 = 0;
  panelOpenState: boolean = false;
  panelOpenState1: boolean = false;
  step = 0;
  sNo = [];
  startCounting = 1;
  checkDate = false;
  maxDate = new Date();

  @ViewChild("epltable", { static: false }) epltable: ElementRef;
  range = false;
  lastpage: number;
  permissionObject: any = null;
  selected: string[] = [
    "Source",
    "Module",
    "Capture Date And Time",
    "Information",
    "UserName",
  ];
  selected2: string[] = [
    "source",
    "module",
    "captureDateTime",
    "information",
    "userName",
  ];
  Searchpayload = {
    pageNo: 1,
    limit: this.currentPageLimit,
    sort: {},
  };
  minDate: Date;
  SelectedAll = [];
  form: FormGroup;
  SelectedAll2 = [];
  unreturnedchecked: boolean;
  logsData: any = [];
  sourceArray = [
    { viewValue: "ERROR", value: "true" },
    { viewValue: "INFO", value: "false" },
  ];
  moduleArray = [
    "ActivityLogs",
    "Authenticate",
    "DataRetention",
    "Kiosk",
    "PhotoKiosk",
    "PriceSettings",
    "Role",
    "Schedule",
    "Settings",
    "SystemLogs",
    "Users",
    "Venue",
    "TCPListner",
    'Action'
  ];
  filterData: any;
  selectedSource: any;
  download = false;
  constructor(
    private dataService: DataService,
    private router: Router,
    private logService: LogsService,
    private paginationService: PaginationService,
    private datePipe: DatePipe,
    private jwtService: JwtService
  ) {
    this.SelectedAll = this.selected;
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll),
    });
    this.SelectedAll2 = this.selected2;
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Logs;
    });
  }

  ngOnInit(): void {
    this.getLogs();
    // this.selectedDate.setHours(0, 0, 0, 0);
    this.selectedDate = null;
  }

  getLogs() {
    let filterData = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };

    let sort = {
      sortElements: {},
    };
    if (this.text) {
      filterData["Module"] = this.text;
    }
    if (this.selectedSource) {
      filterData["isError"] = this.selectedSource;
    }
    if (this.selectedDate) {
      if (!this.checkDate) {
        filterData["ActivityOn"] = this.datePipe.transform(
          this.selectedDate,
          "yyyy-MM-ddT00:00:00"
        );
      } else {
        filterData["ActivityOn"] = this.datePipe.transform(
          this.selectedDate,
          "yyyy-MM-dd  HH:mm:ss"
        );
      }
    }
    if (this.text2) {
      filterData["Owner"] = this.text2;
    }

    let payload = {
      pageNo: this.currentPage,
      limit: this.currentPageLimit,
      sort: {},
    };
    this.Searchpayload = {
      pageNo: this.currentPage,
      limit: this.currentPageLimit,
      sort:{}
    }
    if (this.sortFieldName) {
      sort.sortElements = [
        { 
          PropertyName: this.sortFieldName,
          SortOrder: this.isShort ? 1 : -1,
        },
      ];
    } else {
      sort.sortElements = [
        {
          PropertyName: "id",
          SortOrder: this.isShort ? 1 : -1,
        },
      ];
    }
    if (!this.checkDate) {
      this.logService.getAllLogs(payload, filterData, sort).subscribe((res) => {
        this.logsData = res?.response?.datarequest  
          this.lastpage = res?.response?.totalPages;
          // res?.response?.datarequest.forEach((r,i) => {
          //        if((r?.module=='Users' || r?.module=='Authenticate') && r?.action=='POST' && (r?.path=='/MegaEvent/api/Users/SaveUser' || r?.path=='/MegaEvent/api/Authenticate/AuthenticateUser')){
          //                 let parsed = JSON.parse(r?.otherInfo);
          //                 let starCount= parsed?.password.length-3
          //                 let firstThreeCharOfEmail=parsed?.password.slice(0, 3)
          //                 let temp=''
          //                 while(starCount>0){
          //                   temp=temp+'*'
          //                   --starCount
          //                 }
          //                 let encryptrdPassword=firstThreeCharOfEmail+temp
          //                parsed['password']=encryptrdPassword
          //                parsed['confirm_password']=encryptrdPassword
          //                 let  otherInfo = JSON.stringify(parsed);
          //                 this.logsData[i]['otherInfo']=otherInfo
          //        }
          // });
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          res?.response?.totalDocs,
          this.currentPage,
          this.currentPageLimit
        );
      });
    } else {
      this.logService
        .getAllLogs(this.Searchpayload, filterData, sort)
        .subscribe((res) => {
          (this.logsData = res?.response?.datarequest),
            (this.lastpage = res?.response?.totalPages);
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            res?.response?.totalDocs,
            this.currentPage,
            this.currentPageLimit
          );
        });
    }

    
  }

  sortData(source) {
    this.isShort = !this.isShort;
    this.sortFieldName = source;
    this.getLogs();
  }

  items: any[] = [
    { value: "Source", viewValue: "Source" },
    { value: "Module", viewValue: "Module" },
    { value: "CaptureDateTime", viewValue: "Capture Date And Time" },
    { value: "userName", viewValue: "UserName" },
    { value: "information", viewValue: "Information" },
  ];

  selectCol(colName, i) {
    if (colName == "Source") {
      this.source = !this.source;
    } else if (colName == "Module") {
      this.module = !this.module;
    } else if (colName == "Capture Date And Time") {
      this.captureDateTime = !this.captureDateTime;
    } else if (colName == "UserName") {
      this.userName = !this.userName;
    } else if (colName == "Information") {
      this.information = !this.information;
    }
  }

  toggleSelection(change: MatCheckboxChange): void {
    this.unreturnedchecked = change.checked;
    if (this.unreturnedchecked) {
      this.form.get("model").setValue(this.selected);
      this.source = true;
      this.module = true;
      this.captureDateTime = true;
      this.userName = true;
      this.information = true;
    } else {
      this.form.get("model").setValue([]);
      this.source = false;
      this.module = false;
      this.captureDateTime = false;
      this.userName = false;
      this.information = false;
    }
  }

  reset() {
    this.text = null;
    this.router
      .navigateByUrl("/RefreshComponent", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/logs/user-activitylog"]);
      });
  }

  searchObject(data) {}

  setStep1(index: number) {
    this.step1 = index;
    this.panelOpenState1 = true;
  }
  eDateChangedStart(res: any) {
    this.checkDate = true;
    this.selectedDate = res?.value;
  }

  goBack() {
    this.router.navigateByUrl("/dashboard");
  }

  getPage(data: any) {
    if (data?.limit != this.currentPageLimit) {
      if (this.currentPage == data.page) {
        this.currentPage = 1;
      } else {
        this.currentPage = data?.page;
      }
    } else {
      if (this.currentPage == data.page) {
        this.currentPage = this.lastpage;
      } else {
        this.currentPage = data?.page;
      }
    }
    this.currentPageLimit = data?.limit;
    this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getLogs();
  }

  getSNo(currentPage) {
    this.sNo = [];
    for (
      let i = this.startCounting;
      i <= this.currentPageLimit * currentPage;
      i++
    ) {
      this.sNo.push({
        sNo: i,
      });
    }
  }

  downloadExcel() {
    let filterData = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };
    let sort = {
      sortElements: {},
    };
    if (this.text) {
      filterData["Module"] = this.text;
    }
    if (this.selectedSource) {
      filterData["isError"] = this.selectedSource;
    }
    if (this.selectedDate) {
      //2023-08-18T09:01:57.270Z
      // filterData["ActivityOn"] = this.datePipe.transform(
      //   this.selectedDate,
      //   "yyyy-MM-ddT00:00:00.000Z"
      // );
      filterData["ActivityOn"] =this.selectedDate?.toISOString()


    }
    if (this.text2) {
      filterData["Owner"] = this.text2;
    }
    if (this.sortFieldName) {
      sort.sortElements = [
        {
          PropertyName: this.sortFieldName,
          SortOrder: this.isShort ? 1 : -1,
        },
      ];
    } else {
      sort.sortElements = [
        {
          PropertyName: "id",
          SortOrder: this.isShort ? 1 : -1,
        },
      ];
    }
    let payload = {
      pageNo: this.currentPage,
      limit: this.currentPageLimit,
      download: this.download,
    };
    this.logService
      .downloadAllLogs(payload, filterData, sort)
      .subscribe((res) => {
        var a = document.createElement("a");
        a.href = res.downloadLink;
        a.download = "report.xls";
        a.click();
        window.URL.revokeObjectURL(res.response.downloadLink);
        a.remove();
      });
  }
}
