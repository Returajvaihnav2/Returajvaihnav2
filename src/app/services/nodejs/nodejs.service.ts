import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { SpinnerService } from '../spinner.service';
import { HttpErrorHandler } from '../http-error-handler.service';
import { NodeJsAPIService } from '../nodejs-api.service';
@Injectable({
  providedIn: 'root'
})
export class NodeJsService {
  constructor(private http: HttpClient, private userService: UserService, private httpErrorHandler: HttpErrorHandler,
    private spinner: SpinnerService, private nodejsApiService: NodeJsAPIService) { }

  htmlToImage(html) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userService.userInfo.jwtToken);
    headers = headers.append('Content-Type', 'text/html');
    const optionsData: any = {
      headers: headers
    };
    return this.http.post(`${environment.nodeEnvUrl}user/html-to-image`, html, optionsData);
  }


  createGroup(data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/create', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  leaveGroup(data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/leave', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  deleteGroup(data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/delete', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  updateGroup(data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/update', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  addUserToGroup(data) {
    // {
    //   "groupId": 2,
    //   "userId": 47
    // }
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/add-user', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  removeUserToGroup(data) {
    // {
    //   "groupId": 2,
    //   "userId": 10155
    // }
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/remove-user', data).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  getGroupInfo(id) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.getWithNodeJsApi('group/info/' + id).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  groupAdmin(data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('group/toggle-admin', data).subscribe(res => {
        return resolve(res);
      }, (error) => {
        return reject(error);
      });
    });
  }

  updateTask(id, data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('workflow/update/' + id, data).subscribe(res => {
        return resolve(res);
      }, (error) => {
        return reject(error);
      });
    });
  }

  updateTaskPropInNode(id, data) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.postWithNodeJsApi('workflow/update-task/' + id, data).subscribe(res => {
        return resolve(res);
      }, (error) => {
        return reject(error);
      });
    });
  }

  getLogo(hostname) {
    return new Promise((resolve, reject) => {
      this.nodejsApiService.getWithNodeJsApi(`host/logo?hostname=${hostname}`).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

  sendChatEmail(uuid, operatorName) {
    return new Promise((resolve, reject) => {
      const body = {
        uuid,
        operatorName
      }
      this.nodejsApiService.postWithNodeJsApi('user/send-chat-email', body).subscribe(res => {
        return resolve(res);
      }, (error: any) => {
        return reject(error);
      });
    });
  }

}
