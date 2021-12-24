
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { HttpErrorHandler } from './http-error-handler.service';
import { AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { BrowserStorageService } from '../utility/browser-storage.service';

@Injectable()

export class ApiService {
  appUrl = environment.apiUrl;
  private data: Observable<string>;
  isSpinner = true;
  constructor(
    private spinner: SpinnerService,
    public http: HttpClient,
    private alfAuthuthService: AuthenticationService,
    private httpErrorHandler: HttpErrorHandler,
    private browserStorageService: BrowserStorageService,
    private router: Router
  ) { }

  postWithHeader(URL, data, ignoreSpinner = false) {
    if (this.isSpinner && !ignoreSpinner) {
      this.spinner.displaySpinner(true);
    }

    // if (URL.indexOf('SaveActivityLog') == -1 && !this.isAuthenticated()) {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const optionsData: any = {
      headers: this.createAuthorizationHeader(),
    };

    const response = this.http.post(this.appUrl + URL, data, optionsData).pipe(map((res => {
      if (this.isSpinner && !ignoreSpinner) {
        this.spinner.displaySpinner(false);
      }
      return res;
    })), catchError((error: any) => {
      if (!ignoreSpinner) {
        this.spinner.displaySpinner(false);
      }
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return response;
  }

  postFormDataWithHeader(URL, data) {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const optionsData: any = {
      headers: this.createFormAuthorizationHeader(),
    };

    const response = this.http.post(this.appUrl + URL, data, optionsData).pipe(map((res => {
      if (this.isSpinner) {
        this.spinner.displaySpinner(false);
      }
      return res;
    })), catchError((error: any) => {
      this.spinner.displaySpinner(false);
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return response;
  }

  getWithHeader(URL) {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const optionsData: any = {
      headers: this.createAuthorizationHeader(),
    };
    const request = this.http.get(this.appUrl + URL, optionsData).pipe(map((res => {
      if (this.isSpinner) {
        this.spinner.displaySpinner(false);
      }
      return res;
    })), catchError((error: any) => {
      this.spinner.displaySpinner(false);
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return request;
  }

  getFile(URL) {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const optionsData: any = {
      headers: this.createAuthorizationHeader(),
      responseType: 'blob'
    };
    const request = this.http.get(this.appUrl + URL, optionsData).pipe(map((res => {
      if (this.isSpinner) {
        this.spinner.displaySpinner(false);
      }
      return res;
    })), catchError((error: any) => {
      this.spinner.displaySpinner(false);
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return request;
  }

  createAuthorizationHeader() {
    // TODO: Manage dynamic token passing

    let headers = new HttpHeaders();
    // .set('authorization', `Bearer ${loggedUser}`)

    if (this.browserStorageService.getLocalStorageItem('TritexToken')) {
      headers = headers.append('Authorization', 'Bearer ' + this.browserStorageService.getLocalStorageItem('TritexToken'));
    }

    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }


  postWithoutHeader(URL, data) {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const response = this.http.post(this.appUrl + URL, data).pipe(map((res => {
      if (this.isSpinner) { this.spinner.displaySpinner(false); }
      return res;
    })), catchError((error: any) => {
      this.spinner.displaySpinner(false);
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return response;
  }


  postWithoutAuth(URL, data) {

    const response = this.http.post(this.appUrl + URL, data).pipe(map((res => {
      if (this.isSpinner) { this.spinner.displaySpinner(false); }
      return res;
    })), catchError((error: any) => {
      this.spinner.displaySpinner(false);
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return response;
  }


  createFormAuthorizationHeader() {
    let headers = new HttpHeaders();

    if (this.browserStorageService.getLocalStorageItem('TritexToken')) {
      headers = headers.append('Authorization', 'Bearer ' + this.browserStorageService.getLocalStorageItem('TritexToken'));
    }
    return headers;
  }


  getTritexToken(URL, user: any) {
    const userData = 'username=' + user.userName + '&password=' + user.password + '&grant_type=password';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const response = this.http.post(URL, userData, { headers: reqHeader }).pipe(map((res => {
      return res;
    })), catchError((error: any) => {
      return this.httpErrorHandler.handleError('api-service', error, URL);
    }));

    return response;
  }

  isAuthenticated(): boolean {
    const TritexToken: string = this.browserStorageService.getLocalStorageItem('TritexToken');
    let isLoggedIn = false;
    if (TritexToken && TritexToken.length) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }
}
