import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
    selector: `app-oidc-callback`,
    template: ``
})
export class OIDCCallbackComponent implements OnInit {

    constructor(
        private router: Router,
        private oidcSecurityService: OidcSecurityService
    ) { }

    ngOnInit(): void {
        this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
            this.router.navigate(['/']);
        });
    }
}