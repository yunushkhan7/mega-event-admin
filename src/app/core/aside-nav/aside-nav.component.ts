import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { Menu } from 'src/app/service/nav.service';
import { MatDialog } from '@angular/material/dialog';
@AutoUnsubscribe()
@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.scss'],
})
export class AsideNavComponent implements OnInit {

  public menuItems: Menu[];
  itemsList: any = []
  label: any = [];

  MENUITEMS: Menu[] =
    [

      {
        "nodeName": "Dashboard",
        "nodeIcon": "fa fa-th-large",
        "path": "/dashboard",
        "type": "link"
      },

      {
        "nodeName": "User Accounts",
        "nodeIcon": "fa fa-user",
        "path": "/user-account",
        "type": "link"
      },

      {
        "nodeName": "Reports",
        "nodeIcon": "fa fa-file-o",
        "type": "sub",
        "permissions": [
          {
            "permissionName": "Tiket Validation",
            "path": "report/Ticket-Validation",
            "type": "link"
          },
          {
            "permissionName": "Issued-Tickets",
            "path": "report/Issued-Tickets",
            "type": "link"
          },
          {
            "permissionName": "Photo-Reports",
            "path": "report/photo-report",
            "type": "link"
          },
          {
            "permissionName": "Wristband-Validation",
            "path": "report/wristband-validation",
            "type": "link"
          }
        ]
      },

      {
        "nodeName": "Kiosks",
        "nodeIcon": "fa fa-life-ring",
        "path": "/kiosks",
        "type": "link"
      },
      {
        "nodeName": "Location",
        "nodeIcon": "fa fa-map",
        "type": "sub",
        "permissions": [
          {
            "permissionName": "Venues",
            "path": "location/venues",
            "type": "link"
          }
        ]
      },

      {
        "nodeName": "Templates",
        "nodeIcon": "fa fa-list-alt",
        "type": "sub",
        "permissions": [
          {
            "permissionName": "Daily Schedules",
            "path": "templates/daily-schedules",
            "type": "link"
          },
          // {
          //   "permissionName": "T&C",
          //   "path": "templates/terms",
          //   "type": "link"
          // }
        ]
      },

      {
        "nodeName": "Integrations",
        "nodeIcon": "fa fa-tags",
        "type": "sub",
        "permissions": [
          {
            "permissionName": "SMTP",
            "path": "integration/smtp",
            "type": "link"
          },
          // {
          //   "permissionName": "Mega API",
          //   "path": "integration/mega",
          //   "type": "link"
          // }
        ]
      },

      {
        "nodeName": "Data Retention",
        "nodeIcon": "fa fa-refresh",
        "path": "/data-retention",
        "type": "link",
      },

      {
        "nodeName": "Logs",
        "nodeIcon": "fa fa-files-o",
        "type": "sub",
        "permissions": [
          // {
          //   "permissionName": "User Audit",
          //   "path": "logs/user-audit",
          //   "type": "link"
          // },
          {
            "permissionName": "Activity Logs",
            "path": "logs/activity-logs",
            "type": "link"
          }
        ]
      },

    ]

  constructor(private router: Router, private dataservice: DataService, private commonService: CommonService,  public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dataservice.reauthentiacteResponce.subscribe((response: any) => {
      if(response?.permissions){
        this.itemsList = response?.permissions;
        setTimeout(() => {
          this.label = document.getElementsByTagName("label");
          this.itemsList.forEach((ele: any, a: number) => {
            // if(ele?.permissions?.length){
            for (let i = a; i == a; i++) {
              const e = this.label[i];
              if (ele?.permissions?.length) {
                e.classList += " arrow";
              }
            }
            // }
          });
        }, 1000);
      }
    })
  }

  routes(i) {
    if (i.type == "link")
      this.router.navigateByUrl(i.path);
  }

  ngOnDestroy(): void {
  }


}
