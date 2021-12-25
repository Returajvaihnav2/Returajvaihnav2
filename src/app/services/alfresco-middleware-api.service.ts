import { Injectable } from '@angular/core';
import { AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { HttpErrorHandler } from './http-error-handler.service';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowserStorageService } from '../utility/browser-storage.service';

@Injectable()

export class AlfrescoMiddlewareApiService {
  TritexToken:string;
  constructor(private spinner: SpinnerService,
    public httpErrorHandler: HttpErrorHandler,
    private alfAuthuthService: AuthenticationService,
    private apiService: AlfrescoApiService,
    private router: Router,
    private cookieService: CookieService,
    private browserStorageService: BrowserStorageService,
  ) {

    // if (authSer.isLoggedIn()) {
    //   this.userService.validateTicket(authSer.getTicketEcm()).then((res: any) => {
    //     this.renewConstructor();
    //     this.isSessionAvailable = true;
    //   }).catch(err => {
    //     this.isSessionAvailable = true;
    //     this.authService.logout();
    //   });
    // } else {
    //   this.authService.logout();
    // }
    this.TritexToken = this.browserStorageService.getLocalStorageItem('TritexToken')
  }

  postWebscript(URL, data) {
   
    if (!this.alfAuthuthService.isEcmLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.setCookie();
    return new Promise((resolve, reject) => {
      this.apiService.getInstance().webScript.executeWebScript('POST', URL, null, null, null, data)
        .then(function (res) {
          return resolve(res);
        }).catch(error => {
          return reject(this.httpErrorHandler.handleError('api-service', error, URL));
        });
    });
  }

  postWebscriptWithoutAuth(URL, data) {
    this.setCookie();
    return new Promise((resolve, reject) => {
      this.apiService.getInstance().webScript.executeWebScript('POST', URL, null, null, null, data)
        .then(function (res) {
          return resolve(res);
        }).catch(error => {
          return reject(this.httpErrorHandler.handleError('api-service', error, URL));
        });
    });
  }
  getWebScript(URL) {

    if (!this.alfAuthuthService.isEcmLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.setCookie();
    return new Promise((resolve, reject) => {
      this.apiService.getInstance().webScript.executeWebScript('GET', URL, null, null, null)
        .then(function (res) {
          return resolve(res);
        }).catch(error => {
          return reject(this.httpErrorHandler.handleError('api-service', error, URL));
        });
    });
  }

  getWebScriptWithoutAuth(URL) {
    return new Promise((resolve, reject) => {
      this.apiService.getInstance().webScript.executeWebScript('GET', URL, null, null, null)
        .then(function (res) {
          return resolve(res);
        }).catch(error => {
          return reject(this.httpErrorHandler.handleError('api-service', error, URL));
        });
    });
  }

  deleteWebScript(URL) {

    if (!this.alfAuthuthService.isEcmLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    // this.setCookie();
    return new Promise((resolve, reject) => {
      this.apiService.getInstance().webScript.executeWebScript('DELETE', URL, null, null, null)
        .then(function (res) {
          return resolve(res);
        }).catch(error => {
          return reject(this.httpErrorHandler.handleError('api-service', error, URL));
        });
    });
  }

  setCookie() {
    const myDate = new Date();
    // myDate.setDate(myDate.getDate() + AddDaysHere);
    const newDate = new Date(myDate.setTime(myDate.getTime() + 3600000));

    this.cookieService.set('ALFRESCO_REMEMBER_ME', '1', newDate);
  }
}
