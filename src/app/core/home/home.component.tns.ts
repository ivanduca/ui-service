import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  public user: User = null;
  public callType: string; 

  constructor(private page: Page, private authService: AuthService) {
    this.page.actionBarHidden = true;
    this.callType = 'F:jconon_call:folder';
  }
  
  public ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getUser();
    }
  }
  
  public onLogout() {
    this.authService.logout();
  }

}
