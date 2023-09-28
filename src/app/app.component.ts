import { Component, HostListener } from '@angular/core';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { JwtService } from './service/jwt.service';
import { CommonService } from './service/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from './core/action-popup/action-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthenticated: boolean;
  previousUrl: string;
  currentUser: any;
  isRootPage: any;
  permissionObject: any = [];
  isLoader = false;
  reauthenticate:any;
  refretoken:any;
  
  constructor(
    private router: Router,
    private jwtService: JwtService,
    private dataService: DataService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {
   
    this.dataService.isAuthenticated.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });

    if (this.jwtService.getToken() && this.jwtService.getRefreshToken()) {
      this.getProfile();





      this.commonService.GetCurrentUserProfileAPI().subscribe((response) => {
        if (response) {
          if(response.message == "User Not existed") {
            const dialogRef = this.dialog.open(ActionPopupComponent, {
              width: '530px',
              height: '320px',
              data: { notExisted: true },
        
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.dataService.purgeAuth();
                this.router.navigateByUrl('/login');
                // window.location.reload();
                
              }
            });
          
          }
        }
      });
  }


    jwtService.idle$.subscribe(s => {
      if(this.isAuthenticated) {
        this.dataService.purgeAuth();
        const dialogRef = this.dialog.open(ActionPopupComponent, {
           width: '530px',
           height: '320px',
           data: { isSessionTimeOut: true },
           panelClass: 'timeout',
           disableClose: true,
         });
         dialogRef.afterClosed().subscribe((result) => {
           this.router.navigateByUrl('/login');
           window.location.reload();
           // if (result && result.is_delete) {
           //   this.onLogout()
           // }
         });
        }
     });
    
 
    //  jwtService.wake$.subscribe(s =>  {
       
    //  });
  }

  onLogout() {
    this.dataService.purgeAuth();
    this.router.navigateByUrl('/login');
    window.location.reload();
  }

  getReAuthenticate() {
      let payload = {
        "jwtToken" : this.jwtService.getToken(),
        "refreshToken": this.jwtService.getRefreshToken()
      }
      this.jwtService.reauthenticate(payload).subscribe((res) => {
        if(res.message == 'Success') {
          this.jwtService.saveToken(res?.data?.jwtToken);
          this.jwtService.saveRefreshToken(res?.data?.refreshToken);
        } else {
          this.router.navigateByUrl('login');
        }
      })
  }

  // globalRouterEvents(): void {
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd),
  //   ).subscribe(() => {
  //     const rt = this.getChild(this.activatedRoute);
  //     rt.data.subscribe(data => {
  //       this.isRootPage = data && data.isRootPage;
  //       const title = data && data.title;
  //       const tags = data && data.tags;

  //       if (title) { this.titleService.setTitle(`${title} | ${APP_NAME}`); }
  //       if (tags) { tags.forEach((tag) => { this.meta.updateTag(tag); }); }
  //       //  check the Permission
  //       this.dataService.permission.subscribe((response: any) => {
  //         let role = response?.permissions;
  //         if (role && data['module'] && data['action']) {
  //           const checkPerms = role[data['module']] ? role[data['module']][data['action']] : false;
  //           if (!checkPerms) {
  //             this.location.back();
  //             return;
  //           }
  //         }
  //       });
  //     });
  //   });
  // }

  // onLogOut() {
  //   this.dataService.purgeAuth();
  //   const dialogRef = this.dialog.open(ActionPopupComponent, {
  //     width: '530px',
  //     height: '320px',
  //     data: { isSessionTimeOut: true },
  //     panelClass: 'timeout',
  //     disableClose: true,
  //   });
  //   this.router.navigateByUrl('/login');
  // }

  // getreauthenticate() {
  //   const params: any = {
  //     jwtToken: this.reauthenticate,
  //     refreshToken:  this.refretoken
  //   };
  //   this.commonService.ReAuthenticate(params).subscribe((response) => {
  //     if (response) {    
  //       this.dataService.setreAuth(response)
  //     }
  //   }, (err) => {
  //   });
  // }

  getProfile() {
    this.isLoader = true;
    this.commonService.GetCurrentUserProfileAPI().subscribe((response) => {
      this.isLoader = false;
      if (response) {
        this.dataService.refreshAuth(response.data)
        this.dataService.getloginreauthenticateSubject.next(response.data);
        // if (response.data.user.isFirstTimeLogin) {
        //   this.dialog.open(ChangePasswordComponentPopup, {
        //     disableClose: true,
        //     data: response,
        //     panelClass: 'delete-popup'
        //   });
        // }
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  // getChild(activatedRoute: ActivatedRoute) {
  //   if (activatedRoute.firstChild) {
  //     return this.getChild(activatedRoute.firstChild);
  //   } else {
  //     return activatedRoute;
  //   }
  // }


}
