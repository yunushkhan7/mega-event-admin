import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrComponentlessModule, ToastrService } from "ngx-toastr";
import { TemplatesService } from "src/app/service/templates.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ScheduleService } from "src/app/service/schedule.service";
import { DatePipe } from "@angular/common";
import { MatSelect } from "@angular/material/select";
import { ActionPopupComponent } from "src/app/core/action-popup/action-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-daily-schedules-add",
  templateUrl: "./daily-schedules-add.component.html",
  styleUrls: ["./daily-schedules-add.component.scss"],
  providers: [DatePipe],
})
export class DailySchedulesAddComponent implements OnInit {
  @ViewChild("myField") myField: ElementRef;

  orderForm: FormGroup;
  scheduleDetails: FormArray;
  submitted: boolean;
  showLoader = false;
  isEditing = false;
  editId: string;
  selectedDayArray = [];
  selectedStartTimeArray = [];
  selectedEndTimeArray = [];
  id: any;
  scheduleName: string = "";
  isError = false;
  daysArray = [
    { viewValue: "Monday", value: 1 },
    { viewValue: "Tuesday", value: 2 },
    { viewValue: "Wednesday", value: 3 },
    { viewValue: "Thursday", value: 4 },
    { viewValue: "Friday", value: 5 },
    { viewValue: "Saturday", value: 6 },
    { viewValue: "Sunday", value: 7 },
  ];
  days: any = [
    {
      name: "Monday",
      isSelected: false,
      id: 1,
    },
    {
      name: "Tuesday",
      isSelected: false,
      id: 2,
    },
    {
      name: "Wednesday",
      isSelected: false,
      id: 3,
    },
    {
      name: "Thursday",
      isSelected: false,
      id: 4,
    },
    {
      name: "Friday",
      isSelected: false,
      id: 5,
    },
    {
      name: "Saturday",
      isSelected: false,
      id: 6,
    },
    {
      name: "Sunday",
      isSelected: false,
      id: 7,
    },
  ];
  timingArray: any = [
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    // "00:00",
  ];
  scheduleDetailsIdentity: any;

  Monday: any = {
    startTime: [],
    endTime: [],
  };
  Tuesday: any = {
    startTime: [],
    endTime: [],
  };

  Wednesday: any = {
    startTime: [],
    endTime: [],
  };

  Thursday: any = {
    startTime: [],
    endTime: [],
  };

  Friday: any = {
    startTime: [],
    endTime: [],
  };

  Saturday: any = {
    startTime: [],
    endTime: [],
  };

  Sunday: any = {
    startTime: [],
    endTime: [],
  };
  daykey: any;
  updatedselectedTimeSlot: any = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
  selectedTimeSlot: any = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  dayOnly = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  visitingDayStartEndTimeArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private templateService: TemplatesService,
    private toastr: ToastrService,
    private scheduleService: ScheduleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.selectSlot();
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get("id");
      if (this.isEditing) {
        this.editSchedule();
      }
    }

    this.orderForm = this.formBuilder.group({
      scheduleName: ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      scheduleDetails: this.formBuilder.array(
        [this.createItem()],
        [Validators.required]
      ),
    });
    //  this.scheduleDetailsIdentity = (i: number) => this.scheduleDetails[this.scheduleDetails.length - 1 - i];
  }

  editSchedule() {
    this.scheduleService.editSchedule(this.editId).subscribe((res) => {
      // this.scheduleName = res?.data?.scheduleName
      let dataInArray = [];
      let dataInArray2 = [];
      let resScheduleDetails = [];
      let a: any = this.orderForm.controls["scheduleDetails"];
      res?.data?.scheduleDetails.forEach((element: any) => {
        dataInArray.push(element);
        this.addItem();
      });
      dataInArray.forEach((obj: any, i) => {
        let tempStartTime = obj?.startTime.split("T")[1];
        let tempEndTime = obj?.endTime.split("T")[1];
        let arrStartTime = tempStartTime.split(":");
        let arrEndTime = tempEndTime.split(":");
        let st = arrStartTime[0] + ":" + arrStartTime[1];
        let end = arrEndTime[0] + ":" + arrEndTime[1];
        this.selectedDayArray.push(obj.dayNo);
        this.selectedStartTimeArray.push(st);
        this.selectedEndTimeArray.push(end);
        dataInArray2.push(
          this.formBuilder.group({
            scheduleId: [Number(this.editId)],
            id: obj?.id,
            dayNo: [obj?.dayNo, Validators.compose([Validators.required])],
            startTime: [
              obj?.startTime.replace("2023-07-12T", "").replace(":00", ""),
              Validators.compose([Validators.required]),
            ],
            endTime: [
              obj?.endTime.replace("2023-07-12T", "").replace(":00", ""),
              Validators.compose([Validators.required]),
            ],
            // dayName: obj?.dayName,
            // showStartTime: st,
            // startTime: obj?.startTime,
            // endTime: obj?.endTime,
            // showEndTime: end,
          })
        );
        resScheduleDetails.push({
          dayName: obj?.dayName,
          scheduleId: res?.data?.id,
          dayNo: obj?.dayNo,
          showStartTime: st,
          startTime: obj?.startTime
            .replace("2023-07-12T", "")
            .replace(":00", ""),
          endTime: obj?.endTime.replace("2023-07-12T", "").replace(":00", ""),
          showEndTime: end,
          id: obj?.id,
        });
      });
      this.updateEditSchedule(dataInArray);
      this.orderForm = this.formBuilder.group({
        scheduleName:[res?.data?.scheduleName,Validators.compose([Validators.required, Validators.minLength(3)])],
        scheduleDetails: this.formBuilder.array(dataInArray2, [
          Validators.required,
        ]),
        // scheduleDetails: this.formBuilder.array(dataInArray2,
        //   [Validators.required]),
      });
      resScheduleDetails.forEach((obj: any, i) => {
        let index = this.days.findIndex((x) => x.id === obj?.dayNo);
        this.selectweakday(this.days[index], i);
        this.startTimeSlot(
          obj?.startTime,
          i,
          this.timingArray.indexOf(obj?.startTime)
        );
        this.endTimeSlot(
          obj?.endTime,
          i,
          this.timingArray.indexOf(obj?.endTime)
        );
      });
    });
  }

  ngOnInit(): void {}

  createItem(): FormGroup {
    return this.formBuilder.group({
      id: Number(this.editId),
      scheduleId: 0,
      dayNo: ["", Validators.compose([Validators.required])],
      startTime: ["", Validators.compose([Validators.required])],
      endTime: ["", Validators.compose([Validators.required])],
      // dayName: "0",
      // showStartTime: ["", [Validators.required]],
      // showEndTime: ["", [Validators.required]],
    });
  }

  addItem() {
    this.scheduleDetails = this.orderForm.controls[
      "scheduleDetails"
    ] as FormArray;
    this.scheduleDetails.push(this.createItem());
  }

  deleteRow(index: number, item) {
    this.scheduleDetails = this.orderForm.get("scheduleDetails") as FormArray;
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: "530px",
      height: "320px",
      data: { scheduleDelete: true },
      panelClass: "timeout",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.scheduleService
        // .deleteScheduleDetails(item?.value?.id)
        //   .subscribe((res: any) => {
        //     if (res) {
        //       if (res?.message == "Schedule Day Deleted successfully") {
        //         //this.scheduleDetails.removeAt(index);
        //         this.removeTimeSlots(index);
        //         this.toastr.success(res?.message);
        //       }
        //     }
        //   });
        this.removeTimeSlots(index);
      }
    });
  }

  changeStartDate(data, i) {
    if (this.selectedEndTimeArray[i] == data) {
      this.toastr.error("This is End time. Please select different time");
      this.isError = true;
    } else {
      this.isError = false;
      let a: any = this.orderForm.controls["scheduleDetails"];
      let val = data;
      var timeArr = val.split(":");
      var d = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      a["controls"][i].patchValue({
        startTime: d + "T" + timeArr[0] + ":" + timeArr[1] + ":00.345Z",
      });
      this.onTimeSelection(data, i, "start");
    }
  }

  changeEndDate(data, i) {
    // getting index of previous row start time from timingArray
    let indexOfStartTime = this.timingArray.findIndex(
      (x) => x == this.selectedStartTimeArray[i]
    );
    // getting index of previous row end time from timingArray
    let indexOfEndTime = this.timingArray.findIndex((x) => x == data);
    if (this.selectedStartTimeArray[i] == data) {
      this.toastr.error("Start and End time can't be same");
      this.isError = true;
    } else if (indexOfEndTime < indexOfStartTime) {
      this.toastr.error("End time can't be less than Start time");
      this.isError = true;
    } else {
      this.isError = false;
      let a: any = this.orderForm.controls["scheduleDetails"];
      let val = data;
      var timeArr = val.split(":");
      var d = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      a["controls"][i].patchValue({
        endTime: d + "T" + timeArr[0] + ":" + timeArr[1] + ":00.345Z",
      });
      this.onTimeSelection(data, i, "end");
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.orderForm.valid) {
      this.showLoader = true;
      let updatedscheduleDetails = this.updateSchedule(this.orderForm.value);
      let payLoad = this.orderForm.value;
      payLoad.scheduleDetails = updatedscheduleDetails;
      if (this.editId) {
        payLoad.id = Number(this.editId);
      } else {
        this.orderForm.controls["scheduleDetails"];
      }
      this.templateService.addTemplate(payLoad).subscribe(
        (res) => {
          if (res?.status=='Ok') {
            this.toastr.success(res?.message ? res?.message : res?.Message);
            this.router.navigateByUrl("/templates/daily-schedules");
          } else {
            this.toastr.error(res?.message ? res?.message : res?.Message);
          }
        },(error) => {
          this.toastr.error(error?.error?.Message ? error?.error?.Message : error?.error?.message);
        }
      );
    }
  }

  updateSchedule(formValue: any) {
    let tempDateTime: any = [];
    formValue?.scheduleDetails.forEach((time, i) => {
      if(time?.scheduleId!=0){
        tempDateTime.push({
          id: this.editId? time?.id:0,
          scheduleId: time?.scheduleId,
          dayNo: time?.dayNo,
          startTime: "2023-07-12T" + time?.startTime + ":00.00",
          endTime: "2023-07-12T" + time?.endTime + ":00.00",
        });
      }else
      {
        
        tempDateTime.push({
          id: 0,
          dayNo: time?.dayNo,
          startTime: "2023-07-12T" + time?.startTime + ":00.00",
          endTime: "2023-07-12T" + time?.endTime + ":00.00",
          scheduleId: this.editId? time?.id:0,
        });
      }
      
    });
    return tempDateTime;
  }

  updateEditSchedule(scheduleDetails: any) {
    let tempDateTime: any = [];
    scheduleDetails.forEach((time, i) => {
      tempDateTime.push({
        dayNo: time?.dayNo,
        startTime: time?.startTime
          .replace("2023-07-12T", "")
          .replace(":00", ""),
        endTime: time?.endTime.replace("2023-07-12T", "").replace(":00", ""),
        id: time?.id,
      });
    });
    return tempDateTime;
  }
  onDaySelection(event, index) {
    if (this.selectedDayArray.length == 0 && this.selectedDayArray[index]) {
      this.selectedDayArray[index] = event.value;
    } else {
      this.selectedDayArray.push(event.value);
    }
  }

  onTimeSelection(event, index, type) {
    if (type == "start") {
      //check if the selected day is there in the selected list or not
      let prselectDayIndex;
      if (index > 0) {
        prselectDayIndex = this.selectedDayArray.findIndex(
          (x) => x == this.selectedDayArray[index]
        );
      }
      if (
        this.selectedStartTimeArray.length > 0 &&
        this.selectedStartTimeArray[index]
      ) {
        this.selectedStartTimeArray[index] = event;
      } else {
        this.selectedStartTimeArray.push(event);
      }
      if (prselectDayIndex >= 0) {
        // getting index of previous row start time from timingArray
        let indexOfStartTime = this.timingArray.findIndex(
          (x) => x == this.selectedStartTimeArray[prselectDayIndex]
        );
        // getting index of previous row end time from timingArray
        let indexOfEndTime = this.timingArray.findIndex(
          (x) => x == this.selectedEndTimeArray[prselectDayIndex]
        );
        // getting index of current row start time from timingArray
        let startTimeIndex = this.timingArray.findIndex(
          (x) => x == this.selectedStartTimeArray[index]
        );
        if (
          this.selectedStartTimeArray[prselectDayIndex] >= event &&
          prselectDayIndex != index
        ) {
          this.toastr.error(
            "Time slot " +
              this.selectedStartTimeArray[prselectDayIndex] +
              " to " +
              this.selectedEndTimeArray[prselectDayIndex] +
              " is filled for the same day. Please select different slot"
          );
          this.isError = true;
        } else if (
          startTimeIndex >= indexOfStartTime &&
          startTimeIndex <= indexOfEndTime
        ) {
          this.toastr.error(
            "Time slot " +
              this.selectedStartTimeArray[prselectDayIndex] +
              " to " +
              this.selectedEndTimeArray[prselectDayIndex] +
              " is filled for the same day. Please select different slot"
          );
          this.isError = true;
        } else {
          this.isError = false;
        }
      }
    } else {
      let prselectDayIndex;
      if (index > 0) {
        prselectDayIndex = this.selectedDayArray.findIndex(
          (x) => x == this.selectedDayArray[index]
        );
      }
      if (prselectDayIndex >= 0) {
        // getting index of previous row start time from timingArray
        let indexOfStartTime = this.timingArray.findIndex(
          (x) => x == this.selectedStartTimeArray[prselectDayIndex]
        );
        // getting index of previous row end time from timingArray
        let indexOfEndTime = this.timingArray.findIndex(
          (x) => x == this.selectedEndTimeArray[prselectDayIndex]
        );
        // getting index of current row end time from timingArray
        let endTimeIndex = this.timingArray.findIndex(
          (x) => x == this.selectedEndTimeArray[index]
        );
        if (
          this.selectedEndTimeArray[prselectDayIndex] >= event &&
          prselectDayIndex != index
        ) {
          this.toastr.error(
            "Time slot " +
              this.selectedStartTimeArray[prselectDayIndex] +
              " to " +
              this.selectedEndTimeArray[prselectDayIndex] +
              " is filled for the same day. Please select different slot"
          );
          this.isError = true;
        } else if (
          endTimeIndex >= indexOfStartTime &&
          endTimeIndex <= indexOfEndTime
        ) {
          this.toastr.error(
            "Time slot " +
              this.selectedStartTimeArray[prselectDayIndex] +
              " to " +
              this.selectedEndTimeArray[prselectDayIndex] +
              " is filled for the same day. Please select different slot"
          );
          this.isError = true;
        } else {
          this.isError = false;
        }
      }
      if (
        this.selectedEndTimeArray.length > 0 &&
        this.selectedEndTimeArray[index]
      ) {
        this.selectedEndTimeArray[index] = event;
      } else {
        this.selectedEndTimeArray.push(event);
      }
    }
  }

  selectweakday(weakday, i) {
    let d = {};
    if (this[weakday?.name]?.startTime?.length) {
      d = {
        [weakday?.name]: {
          startTime: this[weakday?.name]?.startTime,
          endTime: this[weakday?.name]?.endTime,
        },
      };
      this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
        startTime: "",
        endTime: "",
      });
    } else {
      d = {
        [weakday?.name]: {
          startTime: [],
          endTime: [],
        },
      };
    }
    let dayKey: any = "";
    if (
      this.visitingDayStartEndTimeArr.length &&
      this.visitingDayStartEndTimeArr[i]
    ) {
      dayKey = Object.keys(this.visitingDayStartEndTimeArr[i])[0];
      let startIndex = this.timingArray.indexOf(this[dayKey]?.startTime[i]);
      let endIndex = this.timingArray.indexOf(this[dayKey]?.endTime[i]);
      this.updatedselectedTimeSlot[dayKey].forEach((slot, i) => {
        if (slot?.timeIndex >= startIndex && slot?.timeIndex <= endIndex) {
          this.updatedselectedTimeSlot[dayKey][i].status = "notSelected";
        }
      });

      let start = startIndex == 0 ? startIndex : startIndex - 1;
      let end = endIndex + 1;
      let updatedStartTimeIndex: any = startIndex;
      let updatedEndTimeIndex: any = endIndex;
      let uID: any = this.uIDGenrator();
      while (start >= 0) {
        if (
          this.updatedselectedTimeSlot[dayKey][start]?.status == "notSelected"
        ) {
          updatedStartTimeIndex = start;
          start--;
        } else {
          break;
        }
      }

      while (end <= this.updatedselectedTimeSlot[dayKey].length - 1) {
        if (
          this.updatedselectedTimeSlot[dayKey][end]?.status == "notSelected"
        ) {
          updatedEndTimeIndex = end;
          end++;
        } else {
          break;
        }
      }
      this.updatedselectedTimeSlot[dayKey].forEach((slot, i) => {
        if (
          slot?.timeIndex >= updatedStartTimeIndex &&
          slot?.timeIndex <= updatedEndTimeIndex
        ) {
          this.updatedselectedTimeSlot[dayKey][i].id = uID;
        }
      });

      this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
      this.templateService._selectedTimeSlot.next(this.selectedTimeSlot); 
    }
    this.visitingDayStartEndTimeArr[i] = d;
    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      startTime: "",
      endTime: "",
    });
  }

  uIDGenrator() {
    return uuidv4();
  }

  selectSlot() {
    let id = this.uIDGenrator();
    this.timingArray.forEach((time, i) => {
      this.selectedTimeSlot["Monday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });
      this.selectedTimeSlot["Tuesday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });
      this.selectedTimeSlot["Wednesday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });

      this.selectedTimeSlot["Thursday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });

      this.selectedTimeSlot["Friday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });

      this.selectedTimeSlot["Saturday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });

      this.selectedTimeSlot["Sunday"].push({
        time: time,
        timeIndex: i,
        status: "notSelected",
        id: id,
      });
    });
    this.updatedselectedTimeSlot = this.selectedTimeSlot;
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  startTimeSlot(time, i, startTimeIndex) {

    let dayKey: any = "";
    if(this.visitingDayStartEndTimeArr?.length && this.visitingDayStartEndTimeArr[i]){
      dayKey = Object.keys(this.visitingDayStartEndTimeArr[i])[0];
      let previousSTI = this.timingArray.indexOf(this[dayKey]?.startTime[i]);
      let previousETI = this.timingArray.indexOf(this[dayKey]?.endTime[i]);
      let currentSTI = this.timingArray.indexOf(time);
      let status:any
      if(startTimeIndex>=0){
         status = this.selectedTimeSlot[dayKey][startTimeIndex]?.status;
      }
      let preStart = previousSTI - 1;
      let preEnd = previousETI + 1;
      let updatedStartTimeIndex: any = previousSTI;
      let updatedEndTimeIndex: any = previousETI;
  
      while (preStart >= 0) {
        if (
          this.updatedselectedTimeSlot[dayKey][preStart]?.status == "notSelected"
        ) {
          updatedStartTimeIndex = preStart;
          preStart--;
        } else {
          break;
        }
      }
  
      while (preEnd <= this.updatedselectedTimeSlot[dayKey].length - 1) {
        if (
          this.updatedselectedTimeSlot[dayKey][preEnd]?.status == "notSelected"
        ) {
          updatedEndTimeIndex = preEnd;
          preEnd++;
        } else {
          break;
        }
      }
  
         if (previousSTI != -1 && previousETI != -1) {
        if (
          currentSTI >= updatedStartTimeIndex &&
          currentSTI <= updatedEndTimeIndex
        ) {
          this.reFillStartTime2(previousSTI,previousETI,dayKey,updatedStartTimeIndex,updatedEndTimeIndex,time,i);
        } else {
          this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
            startTime: this[dayKey].startTime[i],
            //  endTime:''
          });
          // this[dayKey].endTime[i]=''
          this.toastr.error("Overlapping time slot");
        }
  
        //  this.orderForm.controls['scheduleDetails']['controls'][i].patchValue({
        //   startTime: '',
        //   endTime:''
        // })
        // this[dayKey].startTime[i] = ''
        // this[dayKey].endTime[i] = ''
      } else if (status == "notSelected") {
        this.addStartTimeSlot(dayKey, i, time);
      } else {
        this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
          startTime: "",
          endTime: "",
        });
        this[dayKey].startTime[i] = "";
        this[dayKey].endTime[i] = "";
        this.toastr.error("Overlapping time slot");
      }
    }else{
      this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
        startTime: "",
      });
      this.toastr.error("Please select the day");
    }

  }

  endTimeSlot(endTime, i, endTimeIndex) {
    let beforeId = this.uIDGenrator();
    let afterId = this.uIDGenrator();
    let centerId = this.uIDGenrator();
    if(this.visitingDayStartEndTimeArr?.length && this.visitingDayStartEndTimeArr[i]){
    let dayKey = Object.keys(this.visitingDayStartEndTimeArr[i])[0];
    this.daykey = dayKey;
    if(this[dayKey]?.startTime[i]){
    let startTimeIndex = this.timingArray.indexOf(this[dayKey]?.startTime[i]);
    let startTimeStatus = this.selectedTimeSlot[dayKey][endTimeIndex]?.status;
    let endTimeStatus = this.selectedTimeSlot[dayKey][endTimeIndex]?.status;
    let startTimeId = this.selectedTimeSlot[dayKey][startTimeIndex]?.id;
    let endTimeId = this.selectedTimeSlot[dayKey][endTimeIndex]?.id;
    let previousEndTimeIndex = this.timingArray.indexOf(this.visitingDayStartEndTimeArr[i][dayKey]?.endTime[i]);
    let previousPlusOne: any = previousEndTimeIndex + 1;
    let lastNotSelectedEndTimeIndex = previousEndTimeIndex;

    while (previousPlusOne <= this.updatedselectedTimeSlot[dayKey].length - 1) {
      if (
        this.updatedselectedTimeSlot[dayKey][previousPlusOne]?.status ==
        "notSelected"
      ) {
        lastNotSelectedEndTimeIndex = previousPlusOne;
        previousPlusOne++;
      } else {
        break;
      }
    }

    if(endTimeIndex==previousEndTimeIndex){
      this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
        endTime: this[dayKey].endTime[i],
      });
    }
   else if (endTimeIndex == startTimeIndex) {
      this.endTimeEmpty(dayKey, i);
      this.toastr.error("End time and Start time can't be same");
    } else if (endTimeIndex < startTimeIndex) {
      this.endTimeEmpty(dayKey, i);
      this.toastr.error("End time can't be less than Start time");
    } else if ( previousEndTimeIndex != -1 && i != this.visitingDayStartEndTimeArr.length - 1) {
      if ( endTimeIndex > previousEndTimeIndex && endTimeStatus == "notSelected" && endTimeIndex <= lastNotSelectedEndTimeIndex) {
        this.endTimeIsGreater(
          endTime,
          i,
          dayKey,
          startTimeIndex,
          endTimeIndex,
          startTimeId,
          startTimeStatus,
          beforeId,
          centerId,
          afterId,
          previousEndTimeIndex,
          lastNotSelectedEndTimeIndex
        );
      } else if ( endTimeIndex < previousEndTimeIndex && endTimeStatus == "selected") {
        this.endTimeIsLess(
          endTime,
          i,
          dayKey,
          startTimeIndex,
          endTimeIndex,
          startTimeId,
          startTimeStatus,
          beforeId,
          centerId,
          afterId,
          previousEndTimeIndex,
          endTimeStatus,
          endTimeId,
          lastNotSelectedEndTimeIndex
        );
      } else {
        this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
          endTime: this[dayKey].endTime[i],
        });
        this.toastr.error("Overlapping time slot");
      }
    } else if ( previousEndTimeIndex != -1 && i == this.visitingDayStartEndTimeArr.length - 1) {
      if ( endTimeIndex > previousEndTimeIndex && endTimeStatus == "notSelected" && endTimeIndex <= lastNotSelectedEndTimeIndex) {
        this.endTimeIsGreater(
          endTime,
          i,
          dayKey,
          startTimeIndex,
          endTimeIndex,
          startTimeId,
          startTimeStatus,
          beforeId,
          centerId,
          afterId,
          previousEndTimeIndex,
          lastNotSelectedEndTimeIndex
        );
      } else if (
        endTimeIndex < previousEndTimeIndex &&
        endTimeStatus == "selected"
      ) {
        this.endTimeIsLess(
          endTime,
          i,
          dayKey,
          startTimeIndex,
          endTimeIndex,
          startTimeId,
          startTimeStatus,
          beforeId,
          centerId,
          afterId,
          previousEndTimeIndex,
          endTimeStatus,
          endTimeId,
          lastNotSelectedEndTimeIndex
        );
      } else {
        this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
          endTime: this[dayKey].endTime[i],
        });
        this.toastr.error("Overlapping time slot");
      }
    } else {
      let stIndex = startTimeIndex;
      let lastNotSelectedEndTimeIndex: any = startTimeIndex;
      while (stIndex <= this.selectedTimeSlot[dayKey].length - 1) {
        if (this.selectedTimeSlot[dayKey][stIndex]?.status == "notSelected") {
          lastNotSelectedEndTimeIndex = stIndex;
          stIndex++;
        } else {
          break;
        }
      }
      if ( endTimeIndex <= lastNotSelectedEndTimeIndex && endTimeStatus == "notSelected") {
        this.addEndTimeSlot( endTime, dayKey, i, endTimeIndex, startTimeIndex, startTimeId, endTimeId, startTimeStatus, endTimeStatus, beforeId, centerId, afterId, lastNotSelectedEndTimeIndex);
      } else {
        this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
          endTime: this[dayKey].endTime[i],
        });
        this.toastr.error("Overlapping time slot");
      }
    }
  }else{
    this.toastr.error("Please Select start time");
    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      endTime: "",
    });
  }
   }
   else{
      this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
        endTime: "",
      });
      this.toastr.error("Please select the day");
    }
  }

  endTimeEmpty(dayKey, i) {
    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      endTime: this[dayKey].endTime[i],
    });
    this[dayKey].endTime[i] = this[dayKey].endTime[i];
  }

  addStartTimeSlot(dayKey, i, time) {
    this[dayKey].startTime[i] = time;
    this.visitingDayStartEndTimeArr[i][dayKey].startTime =
      this[dayKey].startTime;
    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      startTime: time,
      endTime: "",
    });
    this[dayKey].endTime[i] = "";
  }

  addEndTimeSlot(
    endTime,
    dayKey,
    i,
    endTimeIndex,
    startTimeIndex,
    startTimeId,
    endTimeId,
    startTimeStatus,
    endTimeStatus,
    beforeId,
    centerId,
    afterId,
    lastNotSelectedEndTimeIndex
  ) {
    this.selectedTimeSlot[dayKey].forEach((slot, j) => {
      if (
        slot?.timeIndex >= startTimeIndex &&
        slot?.timeIndex <= endTimeIndex
      ) {
        this.updatedselectedTimeSlot[dayKey][j].status = "selected";
        this.updatedselectedTimeSlot[dayKey][j].id = centerId;
      }
      if (
        slot?.timeIndex >= endTimeIndex + 1 &&
        slot?.timeIndex <= lastNotSelectedEndTimeIndex
      ) {
        this.updatedselectedTimeSlot[dayKey][j].status = "notSelected";
        this.updatedselectedTimeSlot[dayKey][i].id = afterId;
      }
    });

    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      endTime: endTime,
    });
    this[dayKey].endTime[i] = endTime;
    this.visitingDayStartEndTimeArr[i][dayKey].endTime = this[dayKey]?.endTime;
    this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  endTimeIsGreater(
    endTime,
    i,
    dayKey,
    startTimeIndex,
    endTimeIndex,
    startTimeId,
    startTimeStatus,
    beforeId,
    centerId,
    afterId,
    previousEndTimeIndex,
    lastNotSelectedEndTimeIndex
  ) {
    let start = startTimeIndex;
    let end = endTimeIndex;
    let previousETIndex = previousEndTimeIndex;
    let updatedEndTimeIndex: any = endTimeIndex;
    let endPlusOne = endTimeIndex;
    while (endPlusOne <= this.updatedselectedTimeSlot[dayKey].length - 1) {
      if (
        this.updatedselectedTimeSlot[dayKey][endPlusOne]?.status ==
        "notSelected"
      ) {
        updatedEndTimeIndex = endPlusOne;
        endPlusOne++;
      } else {
        break;
      }
    }

    if (end <= updatedEndTimeIndex) {
      this.selectedTimeSlot[dayKey].forEach((slot, j) => {
        if (slot?.timeIndex >= startTimeIndex && slot?.timeIndex <= end) {
          this.updatedselectedTimeSlot[dayKey][j].status = "selected";
          this.updatedselectedTimeSlot[dayKey][j].id = centerId;
        }
        if (
          slot?.timeIndex >= end + 1 &&
          slot?.timeIndex <= updatedEndTimeIndex
        ) {
          this.updatedselectedTimeSlot[dayKey][j].status = "notSelected";
          this.updatedselectedTimeSlot[dayKey][i].id = afterId;
        }
      });
    }
    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      endTime: endTime,
    });
    this[dayKey].endTime[i] = endTime;
    this.visitingDayStartEndTimeArr[i][dayKey].endTime = this[dayKey]?.endTime;
    this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  endTimeIsLess(
    endTime,
    i,
    dayKey,
    startTimeIndex,
    endTimeIndex,
    startTimeId,
    startTimeStatus,
    beforeId,
    centerId,
    afterId,
    previousEndTimeIndex,
    endTimeStatus,
    endTimeId,
    lastNotSelectedEndTimeIndex
  ) {
    let start = startTimeIndex;
    let end = endTimeIndex;
    let previousETIndex;
    let updatedEndTimeIndex: any;

    this.selectedTimeSlot[dayKey].forEach((slot, j) => {
      if (
        slot?.timeIndex >= startTimeIndex &&
        slot?.timeIndex <= endTimeIndex &&
        startTimeStatus == endTimeStatus &&
        startTimeId == endTimeId
      ) {
        this.updatedselectedTimeSlot[dayKey][j].status = "selected";
        this.updatedselectedTimeSlot[dayKey][j].id = centerId;
      } else if (
        slot?.timeIndex > endTimeIndex &&
        slot?.timeIndex <= lastNotSelectedEndTimeIndex
      ) {
        this.updatedselectedTimeSlot[dayKey][j].status = "notSelected";
        this.updatedselectedTimeSlot[dayKey][i].id = afterId;
      }
    });

    this.orderForm.controls["scheduleDetails"]["controls"][i].patchValue({
      endTime: endTime,
    });
    this[dayKey].endTime[i] = endTime;
    this.visitingDayStartEndTimeArr[i][dayKey].endTime = this[dayKey]?.endTime;
    this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  reFillStartTime2(previousSTI,previousETI,dayKey,updatedStartTimeIndex,updatedEndTimeIndex,currentTime,index) {
    let uID: any = this.uIDGenrator();
    this.updatedselectedTimeSlot[dayKey].forEach((slot, i) => {
      if (
        slot?.timeIndex >= updatedStartTimeIndex &&
        slot?.timeIndex <= updatedEndTimeIndex
      ) {
        this.updatedselectedTimeSlot[dayKey][i].id = uID;
        this.updatedselectedTimeSlot[dayKey][i].status = "notSelected";
      }
    });

    this.orderForm.controls["scheduleDetails"]["controls"][index].patchValue({
      startTime: currentTime,
      endTime: "",
    });
    this[dayKey].startTime[index] = currentTime;
    this[dayKey].endTime[index] = "";

    this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  reFillStartTime(previousSTI, previousETI, dayKey) {
    let preStart = previousSTI - 1;
    let preEnd = previousETI + 1;
    let updatedStartTimeIndex: any = previousSTI;
    let updatedEndTimeIndex: any = previousETI;
    let uID: any = this.uIDGenrator();
    while (preStart >= 0) {
      if (
        this.updatedselectedTimeSlot[dayKey][preStart]?.status == "notSelected"
      ) {
        updatedStartTimeIndex = preStart;
        preStart--;
      } else {
        break;
      }
    }

    while (preEnd <= this.updatedselectedTimeSlot[dayKey].length - 1) {
      if (
        this.updatedselectedTimeSlot[dayKey][preEnd]?.status == "notSelected"
      ) {
        updatedEndTimeIndex = preEnd;
        preEnd++;
      } else {
        break;
      }
    }

    this.updatedselectedTimeSlot[dayKey].forEach((slot, i) => {
      if (
        slot?.timeIndex >= updatedStartTimeIndex &&
        slot?.timeIndex <= updatedEndTimeIndex
      ) {
        this.updatedselectedTimeSlot[dayKey][i].id = uID;
        this.updatedselectedTimeSlot[dayKey][i].status = "notSelected";
      }
    });

    this.selectedTimeSlot[dayKey] = this.updatedselectedTimeSlot[dayKey];
    this.templateService._selectedTimeSlot.next(this.selectedTimeSlot);
  }

  removeTimeSlots(i) {
    const kk = this.visitingDayStartEndTimeArr;
    this.scheduleDetails = this.orderForm.get("scheduleDetails") as FormArray;
    this.scheduleDetails.removeAt(i);

    let dayKey: any = "";
    if (
      this.visitingDayStartEndTimeArr.length &&
      this.visitingDayStartEndTimeArr[i]
    ) {
      dayKey = Object.keys(this.visitingDayStartEndTimeArr[i])[0];
      let previousSTI = this.timingArray.indexOf(this[dayKey]?.startTime[i]);
      let previousETI = this.timingArray.indexOf(this[dayKey]?.endTime[i]);
      if (previousSTI != -1 && previousETI != -1) {
        this.reFillStartTime(previousSTI, previousETI, dayKey);
      }
    }
    this.visitingDayStartEndTimeArr.splice(i, 1);

    this.dayOnly.forEach((d: any, vI) => {
      if (this[d]?.startTime.length >= i && this[d]?.endTime.length >= i) {
        if (this[d]?.startTime[i] == null && this[d]?.endTime[i] == null) {
          this[d].startTime[i] = "null";
          this[d].endTime[i] = "null";
        }
        this[d].startTime.splice(i, 1);
        this[d].endTime.splice(i, 1);
      }
    });

    this.visitingDayStartEndTimeArr.forEach((visitHours, vkIndex) => {
      let dk = Object.keys(this.visitingDayStartEndTimeArr[vkIndex])[0];
      this.visitingDayStartEndTimeArr[vkIndex][dk] = this[dk];
    });
  }
}
