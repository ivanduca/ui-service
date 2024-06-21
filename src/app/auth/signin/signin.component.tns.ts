import { Component, ViewChild, ElementRef} from '@angular/core';

import { AuthService } from '../auth.service';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    @ViewChild('username', {static: false}) username: ElementRef;
    @ViewChild('password', {static: false}) password: ElementRef;
    public pwdSecure : boolean;
    constructor(private authService: AuthService, private router: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = false;
        this.pwdSecure = true;
     }

    onSignin() {
        let username = this.username.nativeElement.text.toLowerCase();
        let password = this.password.nativeElement.text;
        this.authService.signinUser(username, password).subscribe(
            (response) => {
                this.router.navigate(["/home"], { clearHistory: true });
            }
        );
    }
}
