import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-profile-drop',
  templateUrl: './profile-drop.component.html',
  styleUrls: ['./profile-drop.component.scss']
})
export class ProfileDropComponent implements OnInit {

  isAuthenticated: boolean;
  isCompanySelected: boolean;
  currentUserDetail: any;
  editImageUrl: any;
  permission: any = [];
  permissionObject: any = null;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUserDetail = response;
      let pic = this.currentUserDetail?.profilePicture;
      if(pic == "https://aszhostserver.ddns.net/MegaEventImages/"){
          pic = "";
        }
        this.editImageUrl = (pic) ? pic : "https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png";
    });
  }

  ngOnInit() { }

  onLogOut() {
    this.dataService.purgeAuth();
    this.router.navigateByUrl('/login');
    window.location.reload();
  }

  ngOnDestroy(): void { }
}
