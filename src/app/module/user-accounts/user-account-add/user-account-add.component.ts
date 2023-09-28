import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { RoleService } from "src/app/service/role.service";
import { PHONE_REGEXP, emailRegEx } from "src/app/shared/common";
import * as CryptoJS from "crypto-js";
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { UseraccountService } from "src/app/service/useraccount.service";
import { MYCustomValidators } from "src/app/shared/custom-validators";

@Component({
  selector: "app-user-account-add",
  templateUrl: "./user-account-add.component.html",
  styleUrls: ["./user-account-add.component.scss"],
})
export class UserAccountAddComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  selectedroleList: Array<any> = [];
  submitted: boolean;
  currentUser: any;
  role: any;
  userId: any;
  roleList: any;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;

  selectedRoleName: any;
  editId: string;
  statusList: any = [
    {
      Name: "Active",
      Status: "Active",
      StatusCode: false,
    },
    {
      Name: "Block",
      Status: "Inacive",
      StatusCode: true,
    },
  ];
  status: any;

  constructor(
    private fb: FormBuilder,
    private useraccountService: UseraccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private dataservice: DataService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get("id");
      if (this.isEditing) {
        this.getEditObject();
      }
    }

    this.addForm = this.fb.group(
      {
      userName: ["", Validators.compose([Validators.required])],
      // userName: [null, [
      //   Validators.required,
      //   // check whether the entered password has a number
      //   MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
      //   // check whether the entered password has upper case letter
      //   MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      //   // check whether the entered password has a lower case letter
      //   MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      //   // check whether the entered password has a special character
      //   MYCustomValidators.patternValidator(
      //     /[a-zA-Z,0-9,@]/,
      //     { hasSpecialCharacters: true }
      //   ),
      //   Validators.maxLength(15),
      // ]],
      password: [
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
          MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          MYCustomValidators.patternValidator(/[#?!@$%^&*-]/, {
            hasSymbols: true,
          }),
          // check whether the entered password has a special character
          // MYCustomValidators.patternValidator(
          //   /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
          //   { hasSpecialCharacters: true }
          // ),
          Validators.minLength(14),
        ],
      ],

      confirm_password: ['', Validators.compose([Validators.required])],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(emailRegEx),
        ]),
      ],
      // mobileNo: ["", Validators.compose([Validators.required, Validators.pattern(/^[689+]\d{7}$/)])], ,Validators.pattern(/^(6)([0-9]{7})$/g)])
      mobileNo: ["", Validators.compose([Validators.required])],
      userGuid: ["", Validators.compose([])],
      address: ["", Validators.compose([])],
      roleName: ["", Validators.compose([])],
      roleId: ["", Validators.compose([Validators.required])],
      profileImage: ["", Validators.compose([])],
      userStatus: [""],
      show_T_C: ["", Validators.compose([])],
    },
    {
      validator: MYCustomValidators.passwordValidation()
    });

    this.dataservice.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
      }
    });
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  getEditObject() {
    this.showLoader = true;

    this.useraccountService
      ?.GetUserAccountById(this.editId)
      .subscribe((response) => {
        if (response) {
          let mobileNo = response?.data?.mobileNo.substring(3, 11);
          this.userId = response?.data?.id;
          var password = atob(response?.data?.password);
          this.status = response?.data?.userStatus;
          this.role = response?.data?.roleName.replace(/\s/g, "");
          this.addForm.get("password").markAsDirty();
          this.showLoader = false;
          this.addForm.patchValue(response?.data);
          this.addForm.patchValue({
            password: password,
            mobileNo: mobileNo,
            confirm_password:password
          });
        } else {
          this.router.navigateByUrl("/user-account");
        }
      });
  }

  getAllRoles() {
    this.roleService.getRoleList({}).subscribe((response: any) => {
      this.roleList = response.data;
    });
  }

  roleSelect(role) {
    this.selectedRoleName = role?.name;
  }

  submitForm() {
    this.submitted = true;
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad = this.addForm.value;
      payLoad["roleName"] = this.roleList.filter(
        (c) => c.id == this.addForm.value.roleId
      )[0]?.roleName;
      if (this.isEditing) {
        const payload2 = {
          userName: this.addForm.value?.userName,
          email: this.addForm.value?.email,
          userGuid: this.addForm.value?.userGuid,
          roleId: this.addForm.value?.roleId,
          roleName: this.roleList.filter(
            (c) => c.id == this.addForm.value.roleId
          )[0]?.roleName,
          show_T_C: this.addForm.value?.show_T_C,
          userStatus: this.addForm.value?.userStatus,
        };
        payload2["id"] = this.editId;
        payload2["mobileNo"] = this.numberstr(
          this.addForm?.value?.mobileNo?.e164Number
        );
        payload2["userStatus"] = this.numbertoBoolean2(
          this.addForm?.value?.userStatus
        );
        // payload2['show_T_C']=this.numbertoBoolean(this.addForm?.value?.show_T_C)
        this.useraccountService.UpdateUserAccount(payload2).subscribe(
          (res) => {
            this.showLoader = false;
            if (res?.status == "Ok") {
              this.toastr.success(res?.message ? res?.message : res?.Message);
              this.router.navigateByUrl("/user-account");
            } else {
              this.toastr.error(res?.message ? res?.message : res?.Message);
            }
          },
          (error) => {
            this.toastr.error(error?.error?.message ? error?.error?.message : error?.error?.Message);
            this.showLoader = false;
          }
        );
      } else {
        if (this.addForm.valid) {
          payLoad["mobileNo"] = this.numberstr(
            this.addForm?.value?.mobileNo?.e164Number
          );
          payLoad["userStatus"] = this.numbertoBoolean(
            this.addForm?.value?.userStatus
          );
          payLoad["show_T_C"] = this.numbertoBoolean(
            this.addForm?.value?.show_T_C
          );
          this.useraccountService.saveUserAccount(this.addForm.value).subscribe((res) => {
              this.showLoader = false;
              if (res?.status == 'Ok') {
                this.toastr.success(res?.message ? res?.message : res?.Message);
                this.router.navigateByUrl("/user-account");
              } else {
                this.toastr.error(res?.message ? res?.message : res?.Message);
              }
            },

            (error) => {
              this.showLoader = false;
              this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
            }
          );
        }
      }
    }
  }

  numberstr(phone) {
    let number = phone.toString();
    return number;
  }

  numbertoBoolean(phone) {
    let boolValue = JSON.parse("true");
    return boolValue;
  }
  numbertoBoolean2(phone) {
    let boolValue = JSON.parse(phone);
    return boolValue;
  }
}
