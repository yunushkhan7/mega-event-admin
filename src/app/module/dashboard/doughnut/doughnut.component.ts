import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss'],
})
export class DoughnutComponent implements OnInit {
  @ViewChild('canvasNetWorth') canvas: ElementRef<HTMLCanvasElement>;
  DEFAULT_COLORS2 = ['#7fb7be', '#357266', '#dacc3e', '#bc2c1a', '#7d1538'];
  dataArray: any = [];
  labelArray: any = [];
  showLoader: boolean;
  nodataContract: any;
  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getTimeBasedTodayRegistration();
  }

  getFirstLetterCapital(key) {
    let first = key.substring(0, 1).toUpperCase();
    return first + key.substring(1);
  }

  getTimeBasedTodayRegistration() {
    var ctx = this.canvas?.nativeElement?.getContext('2d');
    let fields = [];
    let valueData = [];
    this._dashboardService.getOnSitePersonal().subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          for (let [key, value] of Object.entries(response?.data)) {
            if (value > 0) {
              fields.push(this.getFirstLetterCapital(key));
              valueData.push(value);
            } else {
              if (
                response?.data?.contractors == 0 &&
                response?.data?.ltContractors == 0 &&
                response?.data?.staff == 0 &&
                response?.data?.visitors == 0
              ) {
                this.nodataContract = 'No Data';
              }
            }
          }
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }
}
