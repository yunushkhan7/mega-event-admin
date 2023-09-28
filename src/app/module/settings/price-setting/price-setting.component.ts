import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/service/setting.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-price-setting',
  templateUrl: './price-setting.component.html',
  styleUrls: ['./price-setting.component.scss']
})
export class PriceSettingComponent implements OnInit {
  form: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id: any;
  photoId: any;
  permissionObject: any = null;
  submitted: boolean;
  locationList: any =[];
  editData = {};
  locationValue ="";
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,3}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private settingService: SettingService,
    private toastr: ToastrService
  ) {
    // this.getEditObject();

    this.form = this.fb.group({
      // locationId: [null, [Validators.required]],
      digitalcopyprice: ['', [Validators.required]],
      photoprintprice: ['', [Validators.required]],
      priceCode: ['', [Validators.required]],
      currencyCode:['', [Validators.required]],

    });
  }

  ngOnInit(): void {
    this.getKioskLocation();
    this.getAllPriceSettings();
  }

  getKioskLocation() {
    this.userService.getVenueList({}).subscribe((response) => {
      if (response.data) {
        this.locationList = response?.data?.data;
      }
    }, (error) => {
      
    });
  }

  getAllPriceSettings() {
    this.settingService.getAllPriceSetting().subscribe((response) => {
      if (response.data) {
        let index = response?.data?.length;
        this.photoId  = response?.data[0]?.id;
        this.isEditing = true;
        this.form.patchValue({
          // locationId: event.value,
          digitalcopyprice: response?.data[index - 1]?.digitalcopyprice,
          photoprintprice: response?.data[index - 1]?.photoprintprice,
          priceCode: response?.data[index - 1]?.priceCode,
          currencyCode: response?.data[index - 1]?.currencyCode
        })
      }else{
        this.isEditing = false;
      }
    }, (error) => {
      
    });
  }

  getData(event) {
    this.locationValue = event.value;
    this.settingService.getPriceSetting(event.value).subscribe((res) => {
      this.editId = res.data.id;
      this.form.patchValue({
        // locationId: event.value,
        digitalcopyprice: res.data?.digitalcopyprice,
        photoprintprice: res.data?.photoprintprice,
        priceCode: res.data?.priceCode,
        currencyCode: res.data?.currencyCode
      })
    })
  }

  onSubmit(){
    if(this.form.valid){
      let payload;
      if(this.isEditing){
        payload = {
          id: this.photoId,
          digitalcopyprice: this.form.value.digitalcopyprice,
          photoprintprice: this.form.value.photoprintprice,
          priceCode: this.form.value.priceCode,
          currencyCode: this.form.value.currencyCode
        }
      }else{
        payload = {
          // locationId: this.form.value.locationId,
          digitalcopyprice: this.form.value.digitalcopyprice,
          photoprintprice: this.form.value.photoprintprice,
          priceCode: this.form.value.priceCode,
          currencyCode: this.form.value.currencyCode
        }
      }
      
      this.settingService.savePriceSetting(payload).subscribe((res) => {
        if (res?.status=='Ok') {
          this.toastr.success(res?.message ? res?.message : res?.Message);
        } else {
          this.toastr.error(res?.message ? res?.message : res?.Message);
        }
      },(error) => {
        this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message)
      })
      
    }
    
  }
  
  reset(){
    this.form.reset()
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

 
  threeDigitDecimaNumber(event): boolean {
    let value = event.target.value;
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
     let current: string = value;
      const position = event.target.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.regex)) {
       event.preventDefault();
      }
   
  }
}
