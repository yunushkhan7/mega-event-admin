import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id: any;
  hide = true;
  permissionObject: any = null;
  submitted: boolean;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }
    this.dataService.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
        this.editId = this.currentUser?.userGuid;
      }
    });
    this.addForm = this.fb.group({
      hostName: ['', Validators.compose([Validators.required])],
      protocol: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([])],
      // uag:["",  Validators.compose([Validators.required])],
      remarks: [''],
      contractorsBufferStarttime: [
        '',
        Validators.compose([Validators.required]),
      ],
      contractorsBufferEndtime: ['', Validators.compose([Validators.required])],
      applicationId: ['', Validators.compose([Validators.required])],
      directoryId: ['', Validators.compose([Validators.required])],
      port: ['', Validators.compose([Validators.required])],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ACSSettings;
    });
  }

  ngOnInit(): void {
    this.getAcsServerData();
  }

  getEditObject() {
    this.showLoader = true;
  }

  SaveAcsServer() {
    this.submitted = true;
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad = this.addForm.value;
      payLoad['id'] = this.id;
    }
  }

  getAcsServerData() {}

  numberstr(phone) {
    let number = phone.toString();
    return number;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
