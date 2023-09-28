import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { RoleService } from 'src/app/service/role.service';
import { emailRegEx } from 'src/app/shared/common';
import { MYCustomValidators } from '../../profile/custom-validators';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-venues-add',
  templateUrl: './venues-add.component.html',
  styleUrls: ['./venues-add.component.scss'],
})
export class VenuesAddComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  currentUser: any;
  editObject: any = [];
  role: any;

  selectedRoleName: any;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dataservice: DataService,
    private userService:UserService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }

    this.dataservice.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
      }
    });
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      remarks: [''],
      address: ['', Validators.compose([Validators.required])],
    });
  }

  getEditObject() {
    this.userService.getVenueById(this.editId).subscribe((res:any)=>{
      if(res?.status == "Ok"){
        this.editObject = res.data;
        this.addForm.patchValue({
          name: this.editObject.name,
          code: this.editObject.code,
          remarks: this.editObject.remarks,
          address: this.editObject.address,
        });
      }
      else{
        this.toastr.error(res?.message);
      }
    })
  }

  roleSelect(role) {
    this.selectedRoleName = role?.roleName;
  }

  submitForm(formStatus) {
    if(this.addForm.valid){
      if(formStatus) {
        let data;
        if(this.isEditing) {
          data = {
            id: this.editObject.id,
            name: this.addForm.value.name,
            address: this.addForm.value.address,
            code: this.addForm.value.code,
            remarks: this.addForm.value.remarks
          }
  
          this.userService.updateVenue(data).subscribe((res:any)=>{
            if(res?.status == "Ok" && res?.message != 'Venue Code Already exists '){
              this.toastr.success(res?.message);
              this.router.navigate(['/location'])
            }
            else{
              this.toastr.error(res?.message);
            }
          })
        } else {
          data = {
            name: this.addForm.value.name,
            address: this.addForm.value.address,
            code: this.addForm.value.code,
            remarks: this.addForm.value.remarks
          }
  
          this.userService.saveVenue(data).subscribe((res:any)=>{
            if(res?.status == "Ok"){
              this.toastr.success(res?.message ? res?.message : res?.Message);
              this.router.navigate(['/location'])
            }else{
              this.toastr.error(res?.message ? res?.message : res?.Message);
            }
          },(error) => {
            this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
          })
        }
        
      }
    }
  }
}
