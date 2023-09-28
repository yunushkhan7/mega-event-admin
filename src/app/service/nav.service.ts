import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
  //childrenId?:string;
  //parentId?:string;
  path?: string;
  nodeName?: string;
  permissionName?: string;
  nodeIcon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  permissions?: Menu[];
}

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class NavService {

  public screenWidth: any
  public collapseSidebar: boolean = false

  // public jsonStr: string = localStorage.getItem("menuList");
  // public jsonObj = JSON.parse(this.jsonStr)
  // navigationList:any=this.jsonObj
  //http: any;

  constructor(private http: HttpClient) {
    // this.onResize();
    // if (this.screenWidth < 991) {
    // this.collapseSidebar = true
    // }
  }
  // ngOnInit(): void {
  // this.getAll();
  // }
  // getAll(): Observable<Menu[]> {
  // const roleId = JSON.parse(localStorage.getItem('userDetails')).roleId;
  // return this.http.get<Menu[]>(environment.baseURL + 'User/GetNavigationBarByRoleId?RoleId='+roleId , { headers:new HttpHeaders().append('Authorization', 'Bearer ' + localStorage.getItem("token"))});

  // }



  // Windows width
  // @HostListener("window:resize", ['$event'])
  // onResize(event?) {
  // this.screenWidth = window.innerWidth;
  // }

  MENUITEMS: Menu[] = [
    {
      "nodeName": "Administration",
      "type": "sub",
      "nodeIcon": "fa fa-gear",
      "permissions": [
        {
          "permissionName": "Manage Users",
          "path": "/manageuser",
          "type": "link"
        },
        {
          "permissionName": "Manage Roles",
          "path": "/managerole",
          "type": "link"
        }
      ]
    },
    {
      "nodeName": "Operation",
      "type": "sub",
      "nodeIcon": "fa fa-cogs",
      "permissions": [
        {
          "permissionName": "View Live Location",
          "path": "/livelocation",
          "type": "link"
        }
      ]
    }
  ]

  // // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
