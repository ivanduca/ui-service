import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiMessage, ApiMessageService, MessageType} from '../api-message.service';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ItHeaderComponent, ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { environment } from '../../../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-header1',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild(ItHeaderComponent) private itHeaderComponent?: ItHeaderComponent;

  public onUserActivated: Subscription = new Subscription();
  public onLoad: Subscription = new Subscription();
  public onNavbarEvaluated: Subscription = new Subscription();

  public spinner = false;
  
  public lang: string;

  light = false;
  sticky = true;
  search = false;

  iconColor = 'white';
  searchHREF: string;
  companylabel: string = 'header.company.title';

  authenticated = false;
  userData: any;
  
  public notificationOptions = {
    timeOut: 5000,
    pauseOnHover: true,
    preventDuplicates: true,
    theClass: 'rounded shadow-lg alert',
    clickToClose: true,
    animate: 'fromTop',
    showProgressBar: true,
    position: ['top', 'right']
  }

  constructor(private apiMessageService: ApiMessageService,
              private translateService: TranslateService,
              private titleService: Title,
              private router: Router,
              private responsive: BreakpointObserver,
              private oidcSecurityService: OidcSecurityService,
              private notificationService: ItNotificationService) {
    this.searchHREF = `${environment.baseHref}#/company-search`;
  }  

  public ngOnInit() {
    this.translateService.setDefaultLang('it');
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', this.translateService.getBrowserLang());
    }
    this.language(this.lang || localStorage.getItem('lang'), false);
    this.apiMessageService.onApiMessage.subscribe(
      (message: ApiMessage) => {
        this.showNotification(message.type, message.message, message.position);
      }
    );
    this.apiMessageService.onLoad.subscribe((value) => {
      this.spinner = value;
    });
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.get('it.home.title').subscribe((title: string) => {
        this.titleService.setTitle(title);
      });
    });
    if (environment.oidc.enable) {
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          this.authenticated = isAuthenticated;
          this.oidcSecurityService.userData$.subscribe(({ userData }) => {
            this.userData = userData;
          });    
        }
      );
    }
    this.responsiveFn();
  }

  @HostListener("window:resize", []) 
  responsiveFn() {
    this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result?.matches) {
        this.companylabel = 'header.company.acronym';
        this.iconColor = 'primary';
      } else {
        this.companylabel = 'header.company.title';
        this.iconColor = 'white';
      }
    });
  }

  public language(lang: string, change: boolean) {
    if (change)
      this.lang = lang;
    if (lang == 'it') {
      this.translateService.use('it').subscribe((lang: string) =>{
        localStorage.setItem('lang', 'it');  
      });
    } else {
      this.translateService.use('en').subscribe((lang: string) =>{
        localStorage.setItem('lang', 'en');
      });
    }
    return false;
  }

  public loginPage() {
    this.router.navigate(['auth/signin']);
  }

  public ngOnDestroy() {
      this.onUserActivated.unsubscribe();
      this.onLoad.unsubscribe();
      this.onNavbarEvaluated.unsubscribe();
  }

  private notice(alertclass: string, timeOut?: number) : any {
    var notice = Object.assign({}, this.notificationOptions);
    notice.theClass = notice.theClass + ' ' + alertclass;
    if (timeOut !== undefined) {
      notice.timeOut = timeOut;
    }
    return notice;
  }

  private showNotification(messageType: MessageType, message: string, position?: NotificationPosition) {
    if (messageType === MessageType.SUCCESS) {
      this.notificationService.info('Informazione', message, true, 5000, position);
    } else if (messageType === MessageType.ERROR) {
      this.notificationService.error('Errore!', message, true , 15000, position);
    } else if (messageType === MessageType.WARNING) {
      this.notificationService.warning('Avvertimento!', message, true, 10000, position);
    }
  }

  onSearch(searchData?) {
    this.router.navigate(['/search'],  { queryParams: searchData });
    return false;
  }

  toggleCollapse() {
    this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result?.matches) {
        this.itHeaderComponent?.toggleCollapse();
      }
    });
  }

  logout() {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(() => {

    });
  }
}
