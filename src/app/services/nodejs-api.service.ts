import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user/user.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { SpinnerService } from './spinner.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeJsAPIService {
  constructor(private http: HttpClient, private userService: UserService, private httpErrorHandler: HttpErrorHandler,
    private spinner: SpinnerService) { }

  header() {
    let headers = new HttpHeaders();
    if (this.userService.userInfo && this.userService.userInfo.jwtToken) {
      headers = headers.append('Authorization', this.userService.userInfo.jwtToken);
    }
    headers = headers.append('Content-Type', 'application/json');

    return headers;
  }

  postWithNodeJsApi(url, data, responseType = 'json'): any {
    const optionsData: any = {
      headers: this.header(),
      responseType: responseType
    };
    return this.http.post(`${environment.nodeEnvUrl}` + url, data, optionsData);
  }

  getWithNodeJsApi(url) {
    const optionsData: any = {
      headers: this.header()
    };
    return this.http.get(`${environment.nodeEnvUrl}` + url, optionsData);
  }

}
