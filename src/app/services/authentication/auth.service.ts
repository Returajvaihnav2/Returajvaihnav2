import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@alfresco/adf-core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import { SpinnerService } from '../spinner.service';
import { UserService } from '../user/user.service';
import { Idle } from '@ng-idle/core';
import { Constants } from '../../constants/app.constants';

@Injectable()
export class AuthService {

    userName: string = null;
    constructor(
        private apiService: ApiService,
        private alfAuthuthService: AuthenticationService,
        private router: Router,
        private browserStorageService: BrowserStorageService,
        private modalService: BsModalService,
        private spinner: SpinnerService,
        private userService: UserService,
        private idle: Idle
    ) { }

    logout() {
        this.userService.rolesList = [];
        this.userService.navMenuItems = [];

        this.toggleSpinner(true);
        if (this.idle) {
            this.idle.stop();
        }
        this.closeAllModals();
        if (this.userService.socket) {
            this.userService.socket.disconnect();
        }

        if (this.isAuthenticated() && navigator.onLine) {
            this.alfAuthuthService.logout().subscribe(() => {
                this.toggleSpinner(false);
            }, err => {
                this.toggleSpinner(false);
            });
            this.setValues();
        } else {
            this.setValues();
        }
    }

    setValues() {
        if (this.browserStorageService.getLocalStorageItem('TritexToken') && navigator.onLine) {
            this.userService.saveUserActivityLog(Constants.USER_ACTIVITIES.USER.NAME, Constants.NO_COMMENTS,
                Constants.USER_ACTIVITIES.OPERATIONS.LOGOUT, Constants.NO_COMMENTS).then(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.toggleSpinner(false);
                    this.router.navigate(['/auth/login']);
                }).catch(err => {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.toggleSpinner(false);
                    this.router.navigate(['/auth/login']);
                });
            setTimeout(() => {
                if (this.browserStorageService.getLocalStorageItem('TritexToken')) {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.toggleSpinner(false);
                    this.router.navigate(['/auth/login']);
                }
            }, 2000);

        } else {
            localStorage.clear();
            sessionStorage.clear();
            this.toggleSpinner(false);
            this.router.navigate(['/auth/login']);
        }

    }

    toggleSpinner(display) {
        this.apiService.isSpinner = !display;
        this.spinner.displaySpinner(display);
    }

    isAuthenticated(): boolean {
        const TritexToken: string = this.browserStorageService.getLocalStorageItem('TritexToken');
        let isLoggedIn = false;
        if (TritexToken && TritexToken.length && this.alfAuthuthService.isLoggedIn()) {
            isLoggedIn = true;
        }
        return isLoggedIn;
    }

    public closeAllModals() {
        for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
            this.modalService.hide(i);
        }
    }

    getTritexToken(data): Promise<any> {

        return new Promise((resolve, reject) => {
        
                this.apiService.getTritexToken(environment.tritexTokenApi, data).subscribe((res: any) => {
                    this.browserStorageService.setLocalStorageItem('TritexToken', res['access_token']);
                    return resolve(res);
                }, (err) => {
                    reject(err);
                });
           
        });
        // if (this.alfAuthuthService.isEcmLoggedIn()) {
        //     this.apiService.getTritexToken('tritextoken', data).
        // } else {
        //     this.router.navigate(['/auth/login']);
        // }
    }
}
