import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/service/data.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/service/auth.service";
import { UserService } from "src/app/service/user.service";
import { PHONE_REGEXP, emailRegEx } from "src/app/shared/common";
import { TranslateService } from "@ngx-translate/core";
import { RoleService } from "src/app/service/role.service";
import { UseraccountService } from "src/app/service/useraccount.service";
import { JwtService } from "src/app/service/jwt.service";
import { MYCustomValidators } from "./custom-validators";
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { ActionPopupComponent } from "src/app/core/action-popup/action-popup.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  newPasswordCheck = false;
  
  eightCharLength = false;
  upperCase = false;
  lowerCase = false;
  numberCase = false;
  specialCase = false;
  isDisplay: boolean = false;

  nPassword = false;
  cPassword = false;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;
  PageTitle = "Profile";
  currentUser: any;
  role: any;
  permissionObject: any = null;

  confirmPassHide = true;
  newPasswordHide = true;
  oldPasswordHide = true;
  loadingState = true;
  addForm: FormGroup;
  validationMessages: any;
  formErrors = {
    old_password: "",
    new_password: "",
    confirm_password: "",
    apierror: "",
    emailId: null,
  };
  error = false;
  submitAttempt = false;
  showLoader = false;
  addProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  isEditing = false;
  editId: number = null;
  pageTitle = "Update Profile";
  editObject: any;
  isProfileEditable: boolean = false;
  selectedProfileFile: any;
  selectedFile: any;
  url: any;
  base64textString: any;
  selectedProfileImage: any;
  submitted: boolean;
  id: any;
  editImageUrl: any = null;
  defaultProfileImage =
    "https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png";
  roleList: any = [];
  token: any;
  isDeleted:any=false

  constructor(
    private dataservice: DataService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private authService: AuthService,
    private roleService: RoleService,
    private useraccountService: UseraccountService,
    private translateService: TranslateService,
    private jwtService: JwtService,
    public dialog: MatDialog
  ) {
    this.addProfileForm = this.fb.group({
      userName: [""],
      email: [null,Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
      mobileNo: ["", [Validators.required]],
      roleName: [""],
      roleId: [""],
      profileImage: [""],
    });
    // PHONE_REGEXP= /^[689+]\d{7}$/

    this.changePasswordForm = this.fb.group(
      {
        confPassword: [
          "",
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
            // check whether the entered password has upper case letter
            MYCustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            MYCustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a symbols
            MYCustomValidators.patternValidator(/[#?!@$%^&*-]/, {
              hasSymbols: true,
            }),
          ]),
        ],
        oldPassword: [
          "",
          Validators.compose([
            Validators.required,
            // // check whether the entered password has a number
            // MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
            // // check whether the entered password has upper case letter
            // MYCustomValidators.patternValidator(/[A-Z]/, {
            //   hasCapitalCase: true,
            // }),
            // // check whether the entered password has a lower case letter
            // MYCustomValidators.patternValidator(/[a-z]/, {
            //   hasSmallCase: true,
            // }),
            // // check whether the entered password has a symbols
            // MYCustomValidators.patternValidator(/[#?!@$%^&*-]/, {
            //   hasSymbols: true,
            // }),
          ]),
        ],
        newPassword: [
          null,
          [
            Validators.required,
            // check whether the entered password has a number
            MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
            // check whether the entered password has upper case letter
            MYCustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            MYCustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            MYCustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              { hasSpecialCharacters: true }
            ),
            // Validators.minLength(14),
          ],
        ],
      
      }
    );
    this.currentuserprofile();
    this.dataservice.reauthentiacteResponce.subscribe((response: any) => {
      this.token = response?.jwtToken;
    });

  }
  status: any;
  ngOnInit(): void {
    this.getAllRoles();

    this.changePasswordForm.valueChanges.subscribe((val) => {
      this.status = this.changePasswordForm.status;
    });
  }

  currentuserprofile() {
    this.dataservice.currentUser.subscribe((responce: any) => {
      if (responce) {
        this.currentUser = responce;
        this.role = responce?.roleName.replace(/\s/g, "");
        this.base64textString = this.currentUser?.profileImage
        this.isEditing = true;
        this.editId = this.currentUser?.id;
        this.getEditObject();
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    const reg = /(.*?)\.(jpg|JPG|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0]?.name.match(reg)) {
      this.removeFile();
       this.toastService.error('Invalid File Format ')
      return false;
    } else {
      this.removeFile();
      this.selectedFile = fileInput.target.files[0];
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
     // setTimeout(() => this.updateProfile(), 5000);
    }
  }

  updateProfile() {
    this.useraccountService
      .updateProfilePicture(this.editId, this.base64textString)
      .subscribe(
        (response: any) => {
          this.showLoader = false;
          if (response.status == "Ok") {
            this.dataservice.updateAuth({
              ...this.currentUser,
              ...response?.data,
            });
            this.toastService.success(response?.message ? response?.message : response?.Message);

          }else{
            this.toastService.error(response?.message ? response?.message : response?.Message); 
          }
        },
        (error) => {
          this.showLoader = false;
          this.toastService.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        }
      );
  }

  removeFile() {
    this.selectedFile = null;
  }

  handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    let sixtyFouString="data:image/png;base64," + btoa(binaryString);
    this.saveProfileImage(sixtyFouString)
  }
  saveProfileImage(sixtyFouString) {
    let payload={
    profileImage: sixtyFouString,
  userGuid: localStorage.getItem("userGuid")
    }
    this.userService
      .saveProfileImage(payload)
      .subscribe(
        (res) => {
          this.showLoader = false;
          if (res?.status=='Ok') {
            // this.currentuserprofile()
            this.base64textString = sixtyFouString
            this.currentUser.profileImage = this.base64textString;
            this.dataservice.currentUserSubject.next(this.currentUser);
            this.toastService.success(res?.message ? res?.message : res?.Message);
          } else {
            this.toastService.error(res?.message ? res?.message : res?.Message);
          }
        },
        (error) => {
          this.showLoader = false;
          this.toastService.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        }
      );
  }

  getEditObject() {
    this.useraccountService
      .GetUserAccountById(this.editId)
      .subscribe((response) => {
        this.showLoader = false;
        if (response?.data) {
          this.editObject = response?.data;
          this.base64textString = this.editObject?.profileImage;
          let mobileNo = response?.data?.mobileNo.substring(3, 11);
          // this.currentUser.profileImage = this.base64textString;
          //this.dataservice.currentUserSubject.next(this.currentUser);
          this.addProfileForm.patchValue(response?.data);
          this.addProfileForm.patchValue({
            // password:password,
            mobileNo: mobileNo,
          });
        }
      });
  }

  async submitProfileForm() {
    if (this.addProfileForm.valid) {
      if (this.isEditing) {
       // let payLoad = this.addProfileForm.value;
        let payLoad = {}      
        payLoad["userGuid"] = localStorage.getItem("userGuid");
        payLoad["id"] = this.editId;
        payLoad["mobileNo"] = this.numberstr(this.addProfileForm?.value?.mobileNo?.e164Number);
        payLoad["roleName"] = this.roleList.filter((c: any) => c.id == this.addProfileForm.value.roleId)[0]?.roleName;
        payLoad["userName"] = this.addProfileForm.value?.userName;
        payLoad["roleId"] = this.addProfileForm.value?.id;
        payLoad["email"] = this.addProfileForm.value?.email;
        this.useraccountService.UpdateUserAccount(payLoad).subscribe(
          (response: any) => {
            this.showLoader = false;
            if (response.status == "Ok") {
              if (this.base64textString) {
                this.currentUser.profileImage = this.base64textString;
                this.dataservice.currentUserSubject.next(this.currentUser);
              }
              this.toastService.success(response.message);
              this.currentuserprofile();
            } else {
              this.toastService.error(response.message);
            }
          },
          (error) => {
            this.showLoader = false;
            this.toastService.error(error?.error?.Message ? error?.error?.Message : error?.error?.message)
          }
        );
      }
    }
  }

  numberstr(phone) {
    let number = phone?.toString();
    return number;
  }

  SubmitChangePassword() {
    this.submitAttempt = true;

    if (
      !this.specialCase ||
      !this.upperCase ||
      !this.lowerCase ||
      !this.eightCharLength ||
      !this.numberCase
    ) {
      this.error = true;
    } else {
      this.error = false;
    }

    if (this.changePasswordForm.valid) {
      this.showLoader = true;
      const formdata = {
        oldPassword: this.changePasswordForm.value["oldPassword"],
        newPassword: this.changePasswordForm.value["newPassword"],
        userGuid: localStorage.getItem("userGuid"),
      };

      this.userService.updatePassword(formdata).subscribe(
        (response) => {
          // this.showLoader = false;
          // this.submitAttempt = false;
        if (response?.status=='Ok') {
              this.toastService.success(response?.message);
              this.showLoader = false;
              this.resset()
           // this.formErrors.old_password = null;
            this.router.navigateByUrl("/profile");
          } else {
            this.toastService.error(response?.message ? response?.message : response?.Message);
            this.showLoader = false;
          }
        },(error) => {
          this.toastService.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
          this.showLoader = false;
          this.submitAttempt = false;
          this.formErrors.apierror = `* Server Error`;
        }
      );
    } else {
      this.changePasswordForm.controls["oldPassword"].markAsTouched();
      this.changePasswordForm.controls["newPassword"].markAsTouched();
      this.changePasswordForm.controls["confPassword"].markAsTouched();
      this.changePasswordForm.controls["oldPassword"].markAsTouched();
    }
  }

  getAllRoles() {
    this.roleService.getRoleList({}).subscribe((response: any) => {
      this.roleList = response?.data;
    });
  }
  empty: any;
  confirmPass() {
    if (
      this.changePasswordForm.value["confPassword"] !=
      this.changePasswordForm.value["newPassword"]
    ) {
      // this.cPassword = true;

      if (
        this.changePasswordForm.value["newPassword"].length > 0 &&
        this.changePasswordForm.value["confPassword"].length > 0
      ) {
        this.cPassword = true;
      }
    } else {
      this.cPassword = false;
    }

    if (this.changePasswordForm.value["confPassword"] == "") {
      this.cPassword = false;
    }
  }


  validatePassword(data: any) {
    var valData = data.target.value;

    if (valData.length > 0) {
      this.newPasswordCheck = true;
    } else {
      this.newPasswordCheck = false;
    }

    if (valData.length >= 14) {
      this.eightCharLength = true;
    } else {
      this.eightCharLength = false;
    }
    if (valData.search(/[A-Z]/) < 0) {
      this.upperCase = false;
    } else {
      this.upperCase = true;
    }
    if (valData.search(/[a-z]/) < 0) {
      this.lowerCase = false;
    } else {
      this.lowerCase = true;
    }
    if (valData.search(/[0-9]/) < 0) {
      this.numberCase = false;
    } else {
      this.numberCase = true;
    }
    if (valData.search(/[!@#$%^&*]/) < 0) {
      this.specialCase = false;
    } else {
      this.specialCase = true;
    }

    if (
      this.changePasswordForm.value["newPassword"] ==
      this.changePasswordForm.value["oldPassword"]
    ) {
      if (this.changePasswordForm.value["oldPassword"].length > 0) {
        this.nPassword = true;
      }
    }
    if (
      this.changePasswordForm.value["newPassword"] !=
      this.changePasswordForm.value["oldPassword"]
    ) {
      this.nPassword = false;
    }

    if (
      this.changePasswordForm.value["newPassword"] !=
      this.changePasswordForm.value["confPassword"]
    ) {
      if (this.changePasswordForm.value["confPassword"].length > 0) {
        this.cPassword = true;
      }
    }
    if (
      this.changePasswordForm.value["newPassword"] ==
      this.changePasswordForm.value["confPassword"]
    ) {
      this.cPassword = false;
    }

    if (this.changePasswordForm.value["newPassword"].length > 0) {
      this.error = false;
    }
   
  }

  deleteImage(){
    // this.isDeleted=true
    const userGuid= localStorage.getItem("userGuid")
    this.userService.deleteProfileImage(userGuid).subscribe(
      (res) => {
        if(res?.status=='Ok'){
          this.base64textString=null
        //  this.currentuserprofile();
          this.currentUser.profileImage = this.base64textString;
          this.dataservice.currentUserSubject.next(this.currentUser);
          this.toastService.success(res?.message ? res?.message : res?.Message);
         }
         else{
          this.toastService.error(res?.message ? res?.message : res?.Message);
         }
      },(error)=>{
        this.toastService.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
      });






  }


  deletePopPup(){
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '530px',
      height: '320px',
      data: { 
        isProfileImage: true,
        profileImage: this.base64textString,
       },
      panelClass: 'timeout',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.deleteImage()
        // ChangePasswordComponentPopup close action callback
      }
    });
  }
  resset(){
   this.changePasswordForm.reset()
  }
}
