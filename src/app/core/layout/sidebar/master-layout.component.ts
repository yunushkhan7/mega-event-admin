import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute, Router } from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss'],
})
export class MasterLayoutComponent implements OnInit {
  subNavShow: boolean = false;
  brandTitle = 'PROFILE.TITLE';
  navLink: any = [];
  sidenavshow: boolean;
  activeLang: string;
  languageList = environment.language;
  isCompanySelected: boolean = false;
  currentUser: any;
  editImageUrl: any;
  isAuthenticated: boolean;
  currentUserDetail: any;
  permission: any = [];
  permissionObject: any = null;

  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (sessionStorage.getItem('currentLanguage')) {
      translate.getLangs().includes(sessionStorage.getItem('currentLanguage'))
        ? (this.activeLang = sessionStorage.getItem('currentLanguage'))
        : (this.activeLang = environment?.defaultLangCode);
    } else this.activeLang = environment.defaultLangCode;
    this.dataService.currentUser.subscribe((res) => {
      if (res) {
        this.currentUserDetail = res;
        this.currentUser = res;
        let pic = this.currentUser?.profileImage
        // if(pic == "https://aszhostserver.ddns.net/MegaEventImages/"){
        //   pic = "";
        // }
        this.editImageUrl = pic ? pic : "https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png";
      }
    });
    // this.dataService.currentUser.subscribe((response) => {
    //   this.currentUserDetail = response;
    // });
  }

  ngOnInit() {
    this.activeLang = this.translate.currentLang;
    this.sidenavshow = true;
  }
  onLogOut() {
    this.dataService.purgeAuth();
    this.router.navigateByUrl('/login');
    // const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next') ?

    // this.activatedRoute.snapshot.queryParamMap.get('next') : '/dashboard';

    window.location.reload();
  }
  onLanguageChange(): void {
    sessionStorage.setItem('currentLanguage', this.activeLang);
    window.location.reload();
  }

  ShowsidebarMob() {
    // this.sidenavshow = !this.sidenavshow;
    if ($('.sideNav').css('width') == '0px') {
      // $('.sideNav').css('width', '210px');
      // $('.side-container').css('margin-left', '210px').slideLeft();
      $('.sideNav').css('width', '250px');
      $('.side-container').css('margin-left', '250px').slideLeft();
      $('.overlay').css('display', 'block');
    } else {
      $('.sideNav').css('width', '0px');
      $('.side-container').css('margin-left', '0px');
      $('.overlay').css('display', 'none');
    }
  }

  ngOnDestroy(): void {}
}
