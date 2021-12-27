import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '@alfresco/adf-core';
import { BrowserStorageService } from '../../utility/browser-storage.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    modalRef: BsModalRef;
    isAccess: boolean = false;

    constructor(
        public auth: AuthService,
        private userService: UserService,
        private alfAuthService: AuthenticationService,
        private browserStorageService: BrowserStorageService,
        public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve) => {
            const url = state.url;
            if (this.auth.isAuthenticated()) {
                if (url && (!url.includes('auth/reset-password/force')) && this.userService.passChangeReq === 1) {
                    this.router.navigate(['auth', 'reset-password', 'force']);
                    return resolve(true);
                }

                if (url && this.userService.navMenuItems && this.userService.navMenuItems.length > 0) {
                    const isAccessP = this.setRouteAccess(url);
                    if (isAccessP) {
                        return resolve(isAccessP);
                    } else {
                        //here we define unauthorise page
                        this.redirectToUnAuthPage();
                        return resolve(true);
                    }
                } else {
                    // this.userService.getUserDetailsCustom(this.alfAuthService.getEcmUsername())                   
                    this.userService.getuserData('RolePage',this.browserStorageService.getLocalStorageItem('userId'))
                        .then((res: any) => {
                            this.userService.userInfo = res.result;
                            this.userService.passChangeReq = res.result.resetPassword;
                            this.userService.navMenuItems = res.result.menuModel;
                            this.userService.userRoles = res.result.userRole;
                            this.browserStorageService.setSessionStorageItem('UserRoleNames', this.userService.userRoles.join());
                            this.browserStorageService.setLocalStorageItem('userId', res.result.userModel.UserID);
                            this.browserStorageService.setLocalStorageItem('emailId', res.result.userModel.EmailID);
                            this.browserStorageService.setLocalStorageItem('fullName',res.result.userModel.FullName);
                            this.browserStorageService.setSessionStorageItem('UserRoleNames',JSON.stringify(this.userService.userRoles));

                            if (this.userService.passChangeReq === 1) {
                                this.router.navigate(['auth', 'reset-password', 'force']);
                            }

                            const isAccessP = this.setRouteAccess(url);
                            if (isAccessP) {
                                return resolve(isAccessP);
                            } else {
                                this.redirectToUnAuthPage();
                                return resolve(true);
                            }
                        })
                        .catch(err => {
                            this.redirectToUnAuthPage();
                            return resolve(true);
                        });                   
                }
            } else {
                // if (url && (url.includes('mail-redirect'))) {
                //     this.router.navigate(['/auth/login'], { queryParams: { 'redirectURL': btoa(state.url) } });
                // }
                // else {
                //     this.router.navigate(['/auth/login']);
                // }

                if (url) {
                    this.router.navigate(['/auth/login'], { queryParams: { 'redirectURL': btoa(state.url) } });
                } else {
                    this.router.navigate(['/auth/login']);
                }
                return resolve(true);
            }
        });

    }

    resolve(): void {
        if (this.auth.isAuthenticated()) {
            this.router.navigate([]);
        }
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.auth.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }


    canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userRolesFromService = this.userService.userRoles;
        const isRoaming = userRolesFromService.indexOf('ROAMING') !== -1 ? true : false;

        if (isRoaming) {
            return true;
        } else {
            this.redirectToUnAuthPage();
            return false;
        }
    }

    redirectToUnAuthPage() {
        this.router.navigate(['/page/access-denied']);
    }

    setRouteAccess(url): boolean {

        // this.userService.navMenuItems
        this.isAccess = false;
        this.walk(this.userService.navMenuItems, url);
        return this.isAccess;
    }

    walk(data, url) {
        data.forEach(obj => {
            if (!this.isAccess) {
                if (obj.ChildMenus && obj.ChildMenus.length > 0) {
                    this.walk(obj.ChildMenus, url);
                } else {
                    if (obj.isAccessible) {
                        if ((obj.defaultPage && url.includes(obj.defaultPage)) || this.isPage(obj.pages, url)) {
                            this.isAccess = true;
                        }
                    }else{
                        this.isAccess =url.includes('/admin/dashboard/');
                    }
                }
            }
        });
    }

    isPage(pages: any[], url) {
        let isAccess = false
        pages.forEach(page => {
            if (page.isPageActive && url.includes(page.pageUrl)) {
                isAccess = true;
            }
        });
        return isAccess;
    }
}
