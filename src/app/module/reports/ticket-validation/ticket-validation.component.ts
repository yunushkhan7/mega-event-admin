import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-ticket-validation',
  templateUrl: './ticket-validation.component.html',
  styleUrls: ['./ticket-validation.component.scss'],
})
export class TicketValidationComponent implements OnInit {
  unReturnedpassList;
  showLoader = false;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  searchText: any = null;
  isShort: any = false;
  searchFilter: any = {};
  Name = true;
  id = true;
  CardNo = true;
  Type = true;
  OrganizationDivision = true;
  Host = true;
  AthorizedtimeStart = true;
  AthorizedtimeEnd = true;
  OverdueTime = true;
  all = true;
  startCounting = 1;
  sNo = [];
  isSelectedAll = true;
  dSelect = [];
  SelectedAll = [];
  SelectedAll2 = [];
  form: FormGroup;
  selected2: string[] = [
    'Name',
    'CardNo',
    'RegisterType',
    'OrganizationDivision',
    'Host',
    'AthorizedtimeStart',
    'AthorizedtimeEnd',
    'overDue',
  ];
  selected: string[] = [
    'Name',
    'Card #',
    'Type',
    'Organization/Division',
    'Host',
    'Athorized Time Start',
    'Athorized Time End',
    'Overdue Time',
  ];
  lastpage: any;
  filterForm: FormGroup;
  permissionObject: any = null;
  filters: any = [];
  filter: any = [];

  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  isAddForm: any;
  tablefilter: any = [];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private dataService: DataService,
  ) {
    this.SelectedAll2 = this.selected2;
    this.SelectedAll = this.selected;
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll),
    });
    this.filterForm = this.fb.group({
      registerType: [''],
      firstName: [''],
      organizationdivision: [''],
      host: [''],
      AthorizedtimeEnd: [''],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
  }

  ngOnInit(): void {}

  toggleAllSelection() {
    this.listType.forEach((item, indeex) => {
      let index = this.tablefilter.findIndex((c) => c.value == item.value);
      if (index !== -1) {
        this.tablefilter.splice(index, 1);
      }
    });

    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());

      this.listType.forEach((item, indeex) => {
        this.tablefilter.push({
          propertyName: 'RegisterType',
          value: item.value,
          dataType:
            item.value == 'Contractor'
              ? 'Contractor'
              : item.value == 'Visitor'
              ? 'Visitor'
              : 'Employee',
          operator: 0,
          caseSensitive: true,
        });
      });
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());

      this.listType.forEach((item, indeex) => {
        let index = this.tablefilter.indexOf(item.value);

        this.tablefilter.splice(index, 1);
      });
    }
  }
  optionClick(selectedItem: any) {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
        let index = this.tablefilter.findIndex((c) => c.value == item.value);
        if (index !== -1) {
          this.tablefilter.splice(index, 1);
        }
      } else {
        //newStatus = true;
        if (selectedItem == item.value) {
          this.tablefilter.push({
            propertyName: 'RegisterType',
            value: selectedItem,
            dataType:
              selectedItem == 'Contractor'
                ? 'Contractor'
                : selectedItem == 'Visitor'
                ? 'Visitor'
                : 'Employee',
            operator: 0,
            caseSensitive: true,
          });
        }
      }
    });
    this.allSelected = newStatus;
  }

  DownloadExcel() {}

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  sortData(name) {}
}
