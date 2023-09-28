import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SmtpService } from 'src/app/service/smtp.service';
import { PaginationService } from "src/app/service/pagination.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-issued-tickets',
  templateUrl: './issued-tickets.component.html',
  styleUrls: ['./issued-tickets.component.scss'],
})
export class IssuedTicketsComponent implements OnInit {
  currentPageLimit = environment.defaultPageLimit;
  andFilter: any = [];
  orFilter: any = [];
  currentPage: any = 1;
  isShort: any = false;
  sortFieldName: any;
  listing: any = [];
  showPagination: boolean = false;
  pagination: any = null;
  lastpage;
  startCounting = 1;
  sNo = [];
  searchFilter;
  selectedColumn = [
    "direction",
    "WristbandId",
    "timeStamp",
    "validOrInvalid"
  ];

  column = [
    {
      col: "Time Stamp",
      name: "timeStamp",
      forFilter: false,
      forColumn: true,
    },
    {
      col: "QR Code",
      name: "WristbandId",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Direction",
      name: "direction",
      forFilter: true,
      forColumn: true,
    },
    {
      col: "Validity",
      name: "validOrInvalid",
      forFilter: true,
      forColumn: true,
    }
   
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
    this.smtpService.getallAccessReports(param).subscribe(
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
      "WristbandId",
      "direction",
    "timeStamp",
    "validOrInvalid"
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
    this.smtpService.getAccessLogDownloadExcel(param).subscribe(
      (result) => {
        var a = document.createElement("a");
        a.href = result.data.result;
        a.download = "report.xls";
        a.click();
        window.URL.revokeObjectURL(result.data.result);
        a.remove();
      },
      (error) => {}
    );
  }

  checkColumn(columnName) {
    let i = this.selectedColumn.findIndex((x) => x == columnName);

    if (i == -1) {
      return false;
    } else {
      return true;
    }
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getReport();
  }

  selection(type, index, event) {
    if (type == "and") {
      this.andFilter[index].type = event.value;
    } else {
      this.orFilter[index].type = event.value;
    }
  }


}
