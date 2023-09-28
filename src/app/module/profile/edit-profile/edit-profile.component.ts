import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { RoleService } from 'src/app/service/role.service';
import { UserService } from 'src/app/service/user.service';
import { emailRegEx } from 'src/app/shared/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']

})
export class EditProfileComponent implements OnInit {

  showLoader = false;
  addForm: FormGroup;
  formErrors = {
    emailId: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  pageTitle = 'Update Profile';
  currentUser: any;
  editObject: any;
  isProfileEditable: boolean = false;
  selectedProfileFile: any;
  roleId :any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService,
    private dataService: DataService,
    private commonService: CommonService,
    private location: Location,
    private roleService: RoleService,
  ) {
    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required])],
      lastName: [""],
      emailId: [null, [Validators.required, Validators.pattern(emailRegEx)]],
      roleId: [null, Validators.compose([Validators.required])],
      profilePicture: [null, Validators.compose([Validators.required])]
    });

    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.isEditing = true;
        this.editId = this.currentUser.id;
        this.getEditObject();
      }
    })
  }

  ngOnInit() { }

  getEditObject() {
    this.showLoader = true;
    this.editObject = this.currentUser;
    const roleId = this.editObject.roleId;
    this.roleId = roleId;
    this.roleService.getRoleById({ id: roleId }).subscribe((response: any) => {
      this.addForm.patchValue({ roleId: response?.data?.roleName })
      this.showLoader = false;
    })
    this.addForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      emailId: this.currentUser.emailId,
      profilePicture: this.currentUser.profilePicture
    });
  }

  async submitForm() {
    if (this.addForm.valid) {
      if (this.isEditing) {
        this.showLoader = true;
        this.addForm.patchValue({ roleId: this.roleId })
        this.userService.saveUser({ ...this.addForm.value, id: this.editId, isActive: true }).subscribe((response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            this.dataService.updateAuth({ ...this.currentUser, ...response.data });
            this.location.back();
          } else {
            this.toastService.error(response.message);
            response.error.map(obj => {
              if (obj.hasOwnProperty('emailId')) {
                this.formErrors['emailId'] = obj['emailId'];
              } else {
                this.formErrors['apierror'] = `* ${response.error}`;
              }
            });
          }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }

  async profileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.selectedProfileFile = null;
      return false;
    } else {
      this.selectedProfileFile = null;
      this.selectedProfileFile = fileInputFile.target.files[0];
      if (this.selectedProfileFile) {
        const data = new FormData(); data.append('file', this.selectedProfileFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      }
      // this.addForm.get('profilePicture').setValue(this.selectedProfileFile.name);
    }
  }

  // Image fields in attributes Array
  SelectedFile: any;
  selectedIndex: number = 0;
  async fileChangeEvent(fileInputFile: any, i) {
    this.selectedIndex = i;
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.SelectedFile = fileInputFile.target.files[0];
      // var reader = new FileReader();
      // reader.onload = this.HandleReaderLoadedFile.bind(this);
      // reader.readAsBinaryString(this.SelectedFile);
    }
  }

  removeFile() {
    this.SelectedFile = null;
  }

  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.addForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.addForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.addForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = 'Email already exit';
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.addForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.email]));
          this.addForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  ngOnDestroy(): void { }
}
