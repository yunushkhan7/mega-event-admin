import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { maxValue } from 'src/app/shared/common';

@Component({
  selector: 'app-online-gallery',
  templateUrl: './online-gallery.component.html',
  styleUrls: ['./online-gallery.component.scss'],
})
export class OnlineGalleryComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id: any;
  permissionObject: any = null;
  submitted: boolean;

  constructor(
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

    this.addForm = this.fb.group({
      reportsDataKeepDays: ['', [Validators.required, maxValue(999)]],
      userAuditKeepDays: ['', [Validators.required, maxValue(999)]],
      systemLogsKeepDays: ['', [Validators.required, maxValue(999)]],
      passwordExpirationDays: ['', [Validators.required, maxValue(999)]],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.DataRetention;
    });
  }

  ngOnInit(): void {
    this.getDataRetentionData();
  }

  getEditObject() {}

  SaveDataRetention() {}
  addFormReset() {
    this.addForm.reset();
  }
  getDataRetentionData() {}

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
