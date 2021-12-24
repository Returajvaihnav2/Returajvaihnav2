import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { NodeJsAPIService } from '../nodejs-api.service';
import { AuthenticationService } from '@alfresco/adf-core';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService, private http: HttpClient, private userService: UserService, private nodeJsAPIService: NodeJsAPIService,
    public authService: AuthenticationService) { }

  getTradeDashoboard(Flag: string, UserID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('trade/GetTradeDashoboardCount?Flag='
        + Flag + '&UserID=' + UserID + '').subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          return reject(err);
        });
    });
  }


  getTapDashoboard(Flag: string, UserID: string, keycode = '0'): Promise<any> {
    return new Promise((resolve, reject) => {

      this.apiService.getWithHeader('TapInstruction/GetTapDashoboardCount?Flag='
        + Flag + '&UserID=' + UserID + '&keycode=' + keycode).subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          return reject(err);
        });
    });
  }

  getDealTapDashoboard(Flag: string, UserID: string, keycode = '0'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Contract/GetContractDashoboardCount?Flag='
        + Flag + '&UserID=' + UserID + '&keycode=' + keycode).subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          return reject(err);
        });
    });
  }

  getRevennueCost(type = 'overall'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nodeJsAPIService.getWithNodeJsApi(`analyse/net-revenue-cost?type=${type.toLocaleLowerCase()}`).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });

  }

  getcommitments(type = 'inbound'): Promise<any> {

    return new Promise((resolve, reject) => {
      this.nodeJsAPIService.getWithNodeJsApi(`analyse/commitments?type=${type.toLocaleLowerCase()}`).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });

  }
  getDealOverview(Flag: string, UserID: string, keycode: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Contract/GetUserRecentActivity?Flag='
        + Flag + '&UserID=' + UserID + '&keycode=' + keycode + '&AlfToken=' + this.authService.getTicketEcm()).subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          return reject(err);
        });
    });
  }

}


