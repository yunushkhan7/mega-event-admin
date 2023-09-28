import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ActionPopupComponent } from "src/app/core/action-popup/action-popup.component";
import { PaginationService } from "src/app/service/pagination.service";
import { SmtpService } from "src/app/service/smtp.service";

@Component({
  selector: "app-photo-report",
  templateUrl: "./photo-report.component.html",
  styleUrls: ["./photo-report.component.scss"],
})
export class PhotoReportComponent implements OnInit {
  column = [
    {
      col: "EventTime",
      name: "eventDateTime",
      forFilter: false,
      forColumn: true,
    },
    {
      col: "Location",
      name: "name",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Kiosk Name",
      name: "UserName",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "QR Code",
      name: "RFId",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Action",
      name: "action",
      forFilter: false,
      forColumn: true,
    },
    {
      col: "Payment Status",
      name: "paymentStatus",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Trace No.",
      name: "PaymentReferenceNumber",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Email",
      name: "email",
      forFilter: false,
      forColumn: true,
    },
    // {
    //   col: "Payment Mode",
    //   name: "PaymentMode",
    //   forFilter: true,
    //   forColumn: true,
    // },
    {
      col: "# of Photos",
      name: "photos",
      forFilter: false,
      forColumn: true,
    },
    // {
    //   col: "Amount Due",
    //   name: "dueAmount",
    //   forFilter: false,
    //   forColumn: true,
    // },
    // {
    //   col: "Payment Status",
    //   name: "eventStatus",
    //   forFilter: false,
    //   forColumn: true,
    // },
  ];
  isShort: any = false;
  sortFieldName: any;
  listing: any = [];
  searchFilter;
  sortElement;
  currentPage = 1;
  sNo = [];
  currentPageLimit = 10;
  lastpage;
  startCounting = 1;
  andFilter: any = [];
  orFilter: any = [];
  showPagination: boolean = false;
  pagination: any = null;
  selectedColumn = [
    "eventDateTime",
    "name",
    "UserName",
    "RFId",
    "action",
    "PaymentMode",
    "photos",
    "dueAmount",
    "eventStatus",
    "PaymentReferenceNumber",
    "email",
    "paymentStatus",
  ];

  constructor(
    private router: Router,
    private smtpService: SmtpService,
    private toastr: ToastrService,
    private paginationService: PaginationService,
    public dialog: MatDialog,
  ) {
    this.getReport();
  }

  ngOnInit(): void {
    this.getSNo(this.currentPage);

  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getReport();
  }

  goBack() {
    this.router.navigateByUrl("/dashboard");
  }

  getReport() {
    const param = {
      searchFilter: {
        andFilters: [{}],
        orFilters: [{}],
      },
      sortElement: {},
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };

    if (this.andFilter.length > 0) {
      let andFilterTemp = [];
      this.andFilter.forEach((element) => {
        let obj = {
          propertyName: element.type,
          operator: 6,
          value: element.value,
          dataType: "string",
          caseSensitive: true,
        };
        andFilterTemp.push(obj);
      });
      param["searchFilter"]["andFilters"] = andFilterTemp;
    }
    if (this.orFilter.length > 0) {
      let orFilterTemp = [];
      this.orFilter.forEach((element) => {
        let obj = {
          propertyName: element.type,
          operator: 6,
          value: element.value,
          dataType: "string",
          caseSensitive: true,
        };
        orFilterTemp.push(obj);
      });
      param["searchFilter"]["orFilters"] = orFilterTemp;
    } else {
      if (this.orFilter.length == 0 && this.andFilter.length == 0) {
        delete param["searchFilter"];
      } else {
        if (this.andFilter.length == 0) {
          delete param["searchFilter"]["andFilters"];
        } else if (this.orFilter.length == 0) {
          delete param["searchFilter"]["orFilters"];
        }
      }
    }

    if (this.sortFieldName) {
      param.sortElement = {
        propertyName: this.sortFieldName,
        sortOrder: this.isShort ? 1 : -1,
      };
    } else {
      delete param["sortElement"];
    }
    this.smtpService.getallPhotoReports(param).subscribe(
      (result) => {
        this.listing = result.data.data;
        this.lastpage = result?.data?.totalPages;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          result.data["totalDocs"],
          this.currentPage,
          this.currentPageLimit
        );
      },
      (error) => {}
    );
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getReport();
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

  addFilter(type) {
    if (type == "and") {
      this.andFilter.push({ type: "", value: "" });
    } else {
      this.orFilter.push({ type: "", value: "" });
    }
  }

  deleteFilter(type, index) {
    if (type == "and") {
      this.andFilter.splice(index, 1);
    } else {
      this.orFilter.splice(index, 1);
    }
  }

  selection(type, index, event) {
    if (type == "and") {
      this.andFilter[index].type = event.value;
    } else {
      this.orFilter[index].type = event.value;
    }
  }

  searchFilters() {
    this.currentPage=1
    let blankAndValue = this.andFilter.filter((x) => x.value == "");
    let blankAndType = this.andFilter.filter((x) => x.type == "");
    let blankOrValue = this.orFilter.filter((x) => x.value == "");
    let blankOrType = this.orFilter.filter((x) => x.type == "");

    if (blankAndValue.length > 0 || blankOrValue.length > 0) {
      this.toastr.error("Value Field is Required");
    }
    else if (blankAndType.length > 0 || blankOrType.length > 0) {
      this.toastr.error("Filter Field is Required");
    }
     else {
      this.getReport();
    }
  }

  clearFilter() {
    this.getPage({
      limit: 10,
      page: 1,
    });
    this.andFilter = [];
    this.orFilter = [];
    this.sortFieldName = "";
    this.searchFilter = [];
    this.selectedColumn = [
      "eventDateTime",
      "name",
      "UserName",
      "RFId",
      "action",
      "PaymentMode",
      "photos",
      "dueAmount",
      "eventStatus",
      "PaymentReferenceNumber",
      "email",
      "paymentStatus",
    ];
    this.getReport();
  }

  setValue(event, index, type) {
    if (type == "and") {
      this.andFilter[index].value = event.target.value;
    } else {
      this.orFilter[index].value = event.target.value;
    }
  }

  changeValue(event) {
    if (!event.selected) {
      let i = this.selectedColumn.findIndex((x) => x == event.value);
      if (i >= 0) {
        this.selectedColumn.splice(i, 1);
      }
    } else {
      this.selectedColumn.push(event.value);
    }
  }

  checkColumn(columnName) {
    let i = this.selectedColumn.findIndex((x) => x == columnName);

    if (i == -1) {
      return false;
    } else {
      return true;
    }
  }

  downloadExcel() {
    const param = {
      searchFilter: {
        andFilters: [{}],
        orFilters: [{}],
      },
      sortElement: {},
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };

    if (this.andFilter.length > 0) {
      let andFilterTemp = [];
      this.andFilter.forEach((element) => {
        let obj = {
          propertyName: element.type,
          operator: 6,
          value: element.value,
          dataType: "string",
          caseSensitive: true,
        };
        andFilterTemp.push(obj);
      });
      param["searchFilter"]["andFilters"] = andFilterTemp;
    } else if (this.orFilter.length > 0) {
      let orFilterTemp = [];
      this.orFilter.forEach((element) => {
        let obj = {
          propertyName: element.type,
          operator: 6,
          value: element.value,
          dataType: "string",
          caseSensitive: true,
        };
        orFilterTemp.push(obj);
      });
      param["searchFilter"]["orFilters"] = orFilterTemp;
    } else {
      if (this.orFilter.length == 0 && this.andFilter.length == 0) {
        delete param["searchFilter"];
      } else {
        if (this.andFilter.length == 0) {
          delete param["searchFilter"]["andFilters"];
        } else if (this.orFilter.length == 0) {
          delete param["searchFilter"]["orFilters"];
        }
      }
    }

    if (this.sortFieldName) {
      param.sortElement = {
        propertyName: this.sortFieldName,
        sortOrder: this.isShort ? 1 : -1,
      };
    } else {
      delete param["sortElement"];
    }
    this.smtpService.getDownloadExcel(param).subscribe(
      (result) => {
        var a = document.createElement("a");
        a.href = result.data.result;
        a.download = "report.xls";
        a.click();
        window.URL.revokeObjectURL(result.data.result);
        a.remove();
        // window.open(result.data.result)
      },
      (error) => {}
    );
  }

  emailMessagePopUp(){
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '530px',
      height: '320px',
      data: { emailMsg: true },
      panelClass: 'emailMsg',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        // ChangePasswordComponentPopup close action callback
      }
    });
  }


  resendPhotoKioskData(testData) {
    const encodeURIResendData = `?imageNames=${encodeURI(
      testData?.imageNames
    )}&mail=${encodeURI(
     testData?.email
    )}&name=${encodeURI(
      testData?.kioskUser
    )}`;
    this.smtpService.getPhotoKiosk(encodeURIResendData).subscribe(
      (res: any) => {
      if(res?.status=='Ok'){
        this.getReport();
        this.toastr.success(res?.message ? res?.message : res?.Message);
      }if(res?.status=='Error'){
        this.toastr.error(res?.message ? res?.message : res?.Message);
      }
    },(error) => {
      this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
    }
    );
  }
}
