import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DataRetentionService } from "src/app/service/data-retention.service";
import { DataService } from "src/app/service/data.service";
import { maxValue } from "src/app/shared/common";

@Component({
  selector: "app-data-retention",
  templateUrl: "./data-retention.component.html",
  styleUrls: ["./data-retention.component.scss"],
})
export class DataRetentionComponent implements OnInit {
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
    private toastr: ToastrService,
    private dataService: DataService,
    private dataRetention: DataRetentionService
  ) {
    // if (this.activatedRoute.snapshot.paramMap.get('id')) {
    //   this.isEditing = true;
    //   this.editId = this.activatedRoute.snapshot.paramMap.get('id');
    //   if (this.isEditing) {
    //     this.getEditObject();
    //   }
    // }

    this.getEditObject();

    this.addForm = this.fb.group({
      registrationKiosk: ["", [Validators.required, maxValue(999)]],
      photoReports: ["", [Validators.required, maxValue(999)]],
      activityLogs: ["", [Validators.required, maxValue(999)]],

      // passwordExpirationDays: ['', [Validators.required, maxValue(999)]],
      checkInReports: ["", [Validators.required, maxValue(999)]],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.DataRetention;
    });
  }

  ngOnInit(): void {}

  getEditObject() {
    this.dataRetention.getDataRetention().subscribe((res) => {
      if (res.data) {
        this.isEditing = true;
        this.editId = res?.data[0]?.id;
        this.addForm.patchValue(res?.data[0]);
      } else {
        this.isEditing = false;
      }
    });
  }

  onSubmit() {
    if (this.addForm.valid) {
      let dataToSend;
      let data = this.addForm.value;
      if (this.isEditing) {
        dataToSend = {
          activityLogs: data.activityLogs,
          checkInReports: data.checkInReports,
          photoReports: data.photoReports,
          id: this.editId,
          registrationKiosk: data.registrationKiosk,
        };
      } else {
        dataToSend = {
          activityLogs: data.activityLogs,
          checkInReports: data.checkInReports,
          photoReports: data.photoReports,
          registrationKiosk: data.registrationKiosk,
        };
      }

      this.dataRetention.updateDataRetention(dataToSend).subscribe(
        (res) => {
        if (res?.status=='Ok') {
          this.toastr.success(res?.message ? res?.message : res?.Message);
        } else {
          this.toastr.error(res?.message ? res?.message : res?.Message);
        }
      },(error) => {
        this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
      }
      );
    }
  }

  addFormReset() {
    this.getEditObject();
  }

  goBack() {
    this.router.navigateByUrl("/dashboard");
  }
  reset(){
    this.addForm.reset()
  }
}
