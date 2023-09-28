import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tandc-list',
  templateUrl: './tandc-list.component.html',
  styleUrls: ['./tandc-list.component.scss'],
})
export class TandcListComponent implements OnInit {
  objectArray: Array<any> = [];
  permissionObject: any;
  currentUser: any;
  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.UserAccounts;
    });
  }

  ngOnInit() {
    this.dataService.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
        this.getUserAccount();
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  getUserAccount() {}
  searchObject(text) {}
  sortData(name) {}

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
