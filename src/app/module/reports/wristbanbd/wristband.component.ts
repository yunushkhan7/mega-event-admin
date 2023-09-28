import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-wristband',
  templateUrl: './wristband.component.html',
  styleUrls: ['./wristband.component.scss'],
})
export class WristbandComponent implements OnInit {
  rollCallList: any;
  showLoader = false;
  searchText: any = null;
  isShort: any = false;
  FirstName = true;
  id = true;
  CardNo = true;
  RegisterType = true;
  organizationdivision = true;
  phone = true;
  lasteventon = true;
  lasteventlocation = true;
  startCounting = 1;
  ageNo = true;
  sNo = [];
  isSelectedAll = true;
  Section = true;
  BCPteam = true;
  Rollcallgroup = true;
  Host = true;
  SelectedAll = [];
  form: FormGroup;
  unreturnedchecked: boolean;
  selected: string[] = [
    'Name',
    'Card#',
    'Type',
    'Organization/Division',
    'Last Event Location',
    'Last Event On',
    'Section',
    'BCP Team',
    'Roll Call Group',
    'Host',
  ];
  filterColumns: string[] = [
    'firstName',
    'lastName',
    'age',
    'companyName',
    'phoneNumber',
    'registerType',
    'idNumber',
    'lasteventlocation',
  ];
  lastpage: any;
  filterForm: FormGroup;
  permissionObject: any = null;
  filter2 = [];
  filters: any = [];
  filter: any = [];
  SelectedAll2 = [];
  selected2: string[] = [
    'FirstName',
    'CardNo',
    'RegisterType',
    'organizationdivision',
    'lasteventlocation',
    'lasteventon',
    'Section',
    'BCPteam',
    'Rollcallgroup',
    'Host',
  ];
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  tablefilter: any = [];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.SelectedAll = this.selected;
    this.SelectedAll2 = this.selected2;
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll),
    });
    this.filterForm = this.fb.group({
      registerType: [''],
      firstName: [''],
      organizationdivision: [''],
      rollcallgroup: [''],
      lasteventlocation: [''],
      bcPteam: [''],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
  }

  ngOnInit(): void {}

  DownloadExcel() {}

  sortData(name) {}

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

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
}
