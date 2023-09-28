import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { ScheduleService } from 'src/app/service/schedule.service';
import { ToastrService } from 'ngx-toastr';
import { SmtpService } from 'src/app/service/smtp.service';
import { MYCustomValidators } from '../../profile/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kiosks-add',
  templateUrl: './kiosks-add.component.html',
  styleUrls: ['./kiosks-add.component.scss'],
})
export class KiosksAddComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  locationList: any = [];
  submitted: boolean;
  scheduleList: any = [];
  editObject: any;
  currentPage: any = 1;
  selectedRoleName: any;
  currentPageLimit = environment.defaultPageLimit;

  hide = true;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private smtpService: SmtpService
  ) {

    this.addForm = this.fb.group({
      kioskName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      locationId: ['', Validators.compose([Validators.required])],
      kioskLocation: [''],
      userName: [
        null,
        [Validators.required, Validators.minLength(3)],
      ],
      password: ['', [
        Validators.required, 
        // check whether the entered password has a number
        MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
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
      ]],
      dailySchedules: ['', Validators.compose([Validators.required])],
      kioskRole: ['', Validators.compose([Validators.required])]
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }

   
  }

  ngOnInit(): void {
    this.getAllSchedule();
    this.getKioskLocation();
  }

  getKioskLocation() {
    this.userService.getVenueList({}).subscribe((response) => {
      if (response.data) {
        this.locationList = response?.data?.data;
      }
    }, (error) => {
      
    });
  }

  getAllSchedule() {
    const params = {
      "sortElement": {},
      "page": this.currentPage,
      "pageSize": 30
    }
    this.scheduleService.getAllSchedule(params).subscribe((response) => {
      if (response.data) {
        this.scheduleList = response?.data?.data;
      }
    }, (error) => {
      
    });
  }

  getEditObject() {
    this.smtpService.getKioskById(this.editId).subscribe((res:any)=>{
      this.addForm.get('password')?.clearValidators();
      this.addForm.get('password').setValidators( [
        // check whether the entered password has a number
        MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // check whether the entered password has a lower case letter
        MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        MYCustomValidators.patternValidator(/[#?!@$%^&*-]/, {
          hasSymbols: true,
        }),
        Validators.minLength(14),
      ]);
     this.addForm.get('password').updateValueAndValidity();
      if(res?.status == "Ok"){
        this.editObject = res.data;
        let arr = this.editObject.dailySchedules.split(',')
        arr.forEach((el, k) => {
          arr[k] = el;
        });
        this.addForm.patchValue({
          kioskName: this.editObject.kioskName,
          locationId: this.editObject.locationId,
          kioskLocation: this.editObject.kioskLocation,
          userName: this.editObject.userName,
          dailySchedules: arr,
          kioskRole: this.editObject.kioskRole
        });
      }
      else{
        this.toastr.error(res?.message);
      }
    })
  }

  submitForm(formStatus) {
    this.submitted = true;

    if(formStatus) {
      let data;
      if(this.isEditing) {
        data = {
         id: this.editObject.id,
         kioskName: this.addForm.value.kioskName,
         locationId: this.addForm.value.locationId,
         userName: this.addForm.value.userName,
         
         dailySchedules: this.addForm.value.dailySchedules.toString(),
         kioskRole: this.addForm.value.kioskRole,
         kioskLocation: this.addForm.value.kioskLocation
        }
        if(this.addForm?.value?.password){
          data['password']= this.addForm?.value?.password
        }
        this.smtpService.saveKiosk(data).subscribe((res:any)=>{
          if(res?.status == "Ok"){
            this.toastr.success(res?.message);
            this.router.navigate(['/kiosks'])
          }
          else{
            this.toastr.error(res?.message);
          }
        })
      } else {
        data = {
          // id: this.editObject.id,
          kioskName: this.addForm.value.kioskName,
          locationId: this.addForm.value.locationId,
          userName: this.addForm.value.userName,
          password: this.addForm.value.password,
          dailySchedules: this.addForm.value.dailySchedules.toString(),
          kioskRole: this.addForm.value.kioskRole,
          kioskLocation: this.addForm.value.kioskLocation
         }
        this.smtpService.saveKiosk(data).subscribe((res:any)=>{
          if(res?.status == "Ok"){
            this.toastr.success(res?.message);
            this.router.navigate(['/kiosks'])
          }
          else{
            this.toastr.error(res?.message);
          }
        })
      }
      
    }
  }
  
}
