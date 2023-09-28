import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { TestPopupComponent } from '../test-popup/test-popup.component';

@Component({
  selector: 'app-mega',
  templateUrl: './mega.component.html',
  styleUrls: ['./mega.component.scss'],
})
export class MegaComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id: any;
  permissionObject: any = null;
  submitted: boolean;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.APIIntegration;
    });

    this.addForm = this.fb.group({
      momapiEndpoint: ['', Validators.compose([Validators.required])],
    });
    this.getEditObject();
  }

  ngOnInit(): void {}

  getEditObject() {}

  testPopUp() {
    this.dialog.open(TestPopupComponent, {
      panelClass: 'asc-server-modal-box',
      data: {
        testPopUp: 'test',
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
