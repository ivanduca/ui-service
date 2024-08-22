import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { environment } from '../../environments/environment';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { RoleEnum } from "./role.enum";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  
    constructor(
        private oidcSecurityService: OidcSecurityService, 
        private router: Router
    ) {}

    canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        return true;
    }

    canDeactivate(component: unknown, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return this.canActivate(childRoute, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return this.checkUserAuthorized(route);
    }

    checkUserAuthorized(route: ActivatedRouteSnapshot, r?: RoleEnum): Observable<boolean> | Promise<boolean> | boolean {
        if (environment.oidc.enable) {
            return this.hasRole(r || route?.data?.role);    
        }
        return true;
    }
    
    hasRole(roles: RoleEnum[]): Observable<boolean> {
        return this.oidcSecurityService.getUserData().pipe(map((userData: any) => {
            let myRoles =  userData?.realm_access?.roles || [];
            return myRoles.filter(role => roles.indexOf(role) != -1).length != 0;
        }));
    }

}
  