import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';
import { MYCustomValidators } from '../custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  PageTitle = "Change Password"
  hide = true;
  hide1 = true;
  hide2 = true;
  loadingState = true;
  addForm: FormGroup;
  validationMessages: any;
  formErrors = {
    old_password: '',
    new_password: '',
    confirm_password: '',
    apierror: '',
  };
  editId = null;
  submitAttempt = false;
  showLoader = false;
  currentUser: any;
  submitted:boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataservice: DataService,
  ) {


    this.dataservice.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
        this.editId = this.currentUser?.userGuid;
      }
    });

    this.addForm = fb.group({
      old_password: [null, Validators.compose([Validators.required])],
      new_password: [null, [
        Validators.required,
        // check whether the entered password has a number
         MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // check whether the entered password has a lower case letter
        MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // check whether the entered password has a special character
        MYCustomValidators.patternValidator(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
          { hasSpecialCharacters: true }
        ),
        Validators.minLength(14),
      ]],
      UserGuid: [null],
      confirm_password: [null, Validators.compose([Validators.required])],
    }, {
      validator: MYCustomValidators.passwordValidation()
    });
  }

  ngOnInit() { }

  // submitForm(): void {
  //   this.submitAttempt = true;
  //   this.submitted = true
  //   if (this.addForm.valid) {
  //     this.showLoader = true;
  //     const formData = {
  //       oldPassword: this.addForm.value.old_password,
  //       newPassword: this.addForm.value.new_password,
  //       UserGuid: this.editId,
  //     };
  //     this.userService.updatePassword(formData).subscribe((response) => {
  //       this.showLoader = false;
  //       this.submitAttempt = false;
  //       if (response && response.status == "Error") {
  //         this.toastr.error(response.message);
  //         this.formErrors.old_password = null;
         
  //       } else {
  //         if(response?.message == 'Saved successfully'){
  //           this.toastr.success(response.message);
  //           this.router.navigateByUrl('/profile');
  //         }
  //         if(response?.message !== 'Saved successfully'){
  //           this.toastr.error(response.message);
  //         }
  //       }
  //     },
  //       (error) => {
  //         this.showLoader = false;
  //         this.submitAttempt = false;
  //         this.formErrors.apierror = `* Server Error`;
  //       }
  //     );
  //   }
  // }
}
