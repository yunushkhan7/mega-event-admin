import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DataService } from 'src/app/service/data.service';

let COUNT = {
  availableCount: 0,
  totalCount: 0,
  utilizedCount: 0,
};
@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  permissionObject: any = null;
  currentUser: any;
  platinum: any = COUNT;
  gold: any = COUNT;
  standard: any = COUNT;
  licenseListArray: any = [];
  showLoader: boolean;
  registerCountList: any;
  monthlyWiseList: any;
  yearWiseData: any;
  barChartData: any;
  lineChartData: any;
  public selection: string = 'month';
  arData: { name: string; registerCount: number; registerType: string }[];
  timeData: { time: string; registerCount: number; registerType: string }[];
  todayRegisterCount: any;
  todayRegisterCountPer: any;
  weekOrMonthOrYear = 'week';
  todayCount: any;

  constructor(
    private dataService: DataService,
    private _dashboardService: DashboardService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Dashboards;
    });
    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
      }
    });
  }

  ngOnInit() {
    this.getDsahboardRegisterCount();
    this.getDsahboardMonthlyWise(this.weekOrMonthOrYear);
    this.getDsahboardTodayRegisterCount();
    this.getTimeBasedTodayRegistration();
  }

  public chart = {
    datasets: [
      // { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1" },
      { data: [5, 3], label: 'visitor', type: 'bar', tension: 0.5 },
      { data: [6, 2], label: 'Contractor', type: 'bar', tension: 0.5 },
      { data: [14, 8], label: 'Visit', type: 'bar', tension: 0.5 },
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],

    options: {
      legend: {
        text: 'You awesome chart with average line',
        display: true,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 'January',
              max: 'July',
            },
          },
        ],
      },
    },
  };
  public lineChartColors = [
    {
      // grey
      backgroundColor: 'orange',
    },
  ];
  public chartLine = {
    datasets: [
      // { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1" },
      {
        data: [5, 38, 20, 25, 29, 15, 40],
        label: 'Month',
        type: 'line',
        tension: 0.3,
      },
      {
        data: [10, 20, 15, 30, 49, 28, 18],
        label: 'Year',
        type: 'line',
        tension: 0.3,
      },
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    backgroundColor: 'green',
    options: {
      legend: {
        text: 'You awesome chart with average line',
        display: true,
      },

      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 'January',
              max: 'July',
            },
          },
        ],
      },
    },
  };

  public chartdoughnut = {
    datasets: [
      {
        data: [34, 40, 100, 60],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        label: 'Dataset 1',
        type: 'doughnut',
      },
    ],
    labels: [
      'FirstPlaceholder',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      'LastPlaceholder',
    ],
    options: {
      legend: {
        text: 'You awesome chart with average doughnut',
        display: true,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 'Monday',
              max: 'Sunday',
            },
          },
        ],
      },
    },
  };

  calculateCount() {
    this.licenseListArray.map((data) => {
      switch (String(data.licenseType).toLowerCase()) {
        case 'standard':
          this.standard = data;
          break;
        case 'gold':
          this.gold = data;
          break;
        case 'platinum':
          this.platinum = data;
          break;
      }
    });
  }

  getDsahboardRegisterCount() {
    this._dashboardService.getDsahboardRegisterCount().subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.registerCountList = response?.data;
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  getDsahboardTodayRegisterCount() {
    this._dashboardService.getDsahboardTodayRegisterCount().subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.todayRegisterCount = response?.data;
          this.todayRegisterCountPer =
            this.todayRegisterCount?.todayVisitorCheckOut == 0
              ? this.todayRegisterCount?.todayVisitorCheckOut
              : (this.todayRegisterCount?.todayVisitorCheckOut /
                  this.todayRegisterCount?.todayVisitorRegisterCount) *
                100;
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  getTimeBasedTodayRegistration() {
    this._dashboardService.getTimeBasedTodayRegistration().subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.todayCount = response?.message;
          this.getTimeBasedDataRegistration(response?.data);
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  getDsahboardMonthlyWise(monthOrYear) {
    this.weekOrMonthOrYear = monthOrYear;
    this._dashboardService.getDsahboardMonthlyWise(monthOrYear).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.getData(response?.data);
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  ngOnDestroy() {}

  getData(monthOrYearData) {
    this.arData = monthOrYearData;
    let getLabelObj = {};
    let barChartDatSet = {};
    let labels = [];
    for (let i = 0; i < this.arData.length; i++) {
      if (getLabelObj[this.arData[i].name]) {
        getLabelObj[this.arData[i].name].push(this.arData[i]);
      } else {
        getLabelObj[this.arData[i].name] = [];
        getLabelObj[this.arData[i].name].push(this.arData[i]);
      }

      if (barChartDatSet[this.arData[i].registerType]) {
        barChartDatSet[this.arData[i].registerType].push(
          this.arData[i].registerCount
        );
      } else {
        barChartDatSet[this.arData[i].registerType] = [];
        barChartDatSet[this.arData[i].registerType].push(
          this.arData[i].registerCount
        );
      }
    }

    labels = Object.keys(getLabelObj);
    let barData = [];
    let lineData = [];
    for (const country of Object.keys(barChartDatSet)) {
      const capital = barChartDatSet[country];
      barData.push({
        data: capital,
        label: country ? country : 'other',
        type: 'bar',
        tension: 0.5,
      });
    }
    this.barChartData = {
      dataSets: barData,
      labels: labels,
    };
  }

  getTimeBasedDataRegistration(time) {
    this.timeData = time;
    let getLabelObj = {};
    let lineChartDatSet = {};
    let labels = [];
    for (let i = 0; i < this.timeData.length; i++) {
      if (getLabelObj[this.timeData[i].time]) {
        getLabelObj[this.timeData[i].time].push(this.timeData[i]);
      } else {
        getLabelObj[this.timeData[i].time] = [];
        getLabelObj[this.timeData[i].time].push(this.timeData[i]);
      }

      if (lineChartDatSet[this.timeData[i].registerType]) {
        lineChartDatSet[this.timeData[i].registerType].push(
          this.timeData[i].registerCount
        );
      } else {
        lineChartDatSet[this.timeData[i].registerType] = [];
        lineChartDatSet[this.timeData[i].registerType].push(
          this.timeData[i].registerCount
        );
      }
    }

    labels = Object.keys(getLabelObj);
    let lineData = [];
    for (const country of Object.keys(lineChartDatSet)) {
      const capital = lineChartDatSet[country];
      lineData.push({
        data: capital,
        label: country ? country : 'other',
        type: 'line',
        tension: 0.3,
      });
    }

    this.lineChartData = {
      dataSets: lineData,
      labels: labels,
    };
  }
}
