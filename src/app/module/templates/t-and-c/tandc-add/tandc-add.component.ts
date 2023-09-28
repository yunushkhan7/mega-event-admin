import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-tandc-add',
  templateUrl: './tandc-add.component.html',
  styleUrls: ['./tandc-add.component.scss'],
})
export class TandcAddComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  termsList: Array<any> = [];
  id: any;
  permissionObject: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {
    this.addForm = this.fb.group({
      headerText: [''],
      bodyText: [''],
      checkboxText: [''],
      isDeleted: [true],
    });

    this.getEditObject();

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Termsandconditions;
    });
  }

  ngOnInit(): void {}

  getEditObject() {}

  saveTermsCondition() {}

  getTermsCondition() {}

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
