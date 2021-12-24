
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { AlfrescoMiddlewareApiService } from '../alfresco-middleware-api.service';
import { Constants } from '../../constants/app.constants';
import { UserRolePermissionModel, UserRolePermissionListModel, UserInfoModel } from '../../models/user-role-permission.model';
import { Subscription, Observable } from 'rxjs';
import { OperatorService } from '../operator/operator.service';
import * as moment from 'moment';
import * as lodash from 'lodash';
import { UserEventLogModel, UserEventAlfLogModel, SaveActivityLogModel } from '../../models/user-event.model';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import { NotificationModel } from '../../models/notification.model';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';
import { SpinnerService } from '../spinner.service';
import { SearchRoles } from '../../models/SearchRoles.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userRoles: string[] = [];
  // public userRigths: UserRolePermissionModel;
  public socket: Socket = null;
  private spinner: SpinnerService;
  deviceInfo = null;
  activityLogModel: SaveActivityLogModel = new SaveActivityLogModel();

  public navItems = [
  ];
  generalSettingMenu = null;
  generalSetting = {
    name: 'General Settings',
    url: '/generalsettings/',
    icon: 'icon-menu',
    disabled: false,
    permissionkey: 'masterSetup',
    tooltip: '',
    children: [
      {
        name: 'Roles',
        url: '/generalsettings/roles/',
        icon: 'icon-plus',
        disabled: false,
        permissionkey: 'showDashBoard',
        tooltip: '',
        children: [
          {
            name: 'Create',
            url: '/generalsettings/roles/add-roles/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          },
          {
            name: 'View',
            url: '/generalsettings/roles/view-roles/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          }
        ]
      },
      {
        name: 'Menus',
        url: '/generalsettings/menus',
        icon: 'icon-plus',
        disabled: false,
        permissionkey: 'showDashBoard',
        tooltip: '',
        children: [
          {
            name: 'Create',
            url: '/generalsettings/menus/add-menus/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          },
          {
            name: 'View',
            url: '/generalsettings/menus/view-menus/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          }
        ]
      },
      {
        name: 'Pages',
        url: '/generalsettings/pages',
        icon: 'icon-plus',
        disabled: false,
        permissionkey: 'showDashBoard',
        tooltip: '',
        children: [
          {
            name: 'Create',
            url: '/generalsettings/pages/add-pages/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          },
          {
            name: 'View',
            url: '/generalsettings/pages/view-pages/' + new Date().getTime(),
            icon: 'icon-arrow-right',
            disabled: false,
            permissionkey: 'showDashBoard',
            tooltip: ''
          }
        ]
      }
    ]
  };
  public navMenuItems = [];
  public MenuItems = [];
  userIdleSubs: Subscription;
  rolesList: UserRolePermissionListModel[];
  passChangeReq = 0;
  userInfo: UserInfoModel;
  public roleData: SearchRoles[];
  constructor(
    private apiService: ApiService,
    private alfrescoService: AlfrescoApiService,
    private alfrescoMiddlewareApiService: AlfrescoMiddlewareApiService,
    private authService: AuthenticationService,
    private operatorService: OperatorService,
    private browserStorageService: BrowserStorageService,
    private alfrescoApiServices: AlfrescoMiddlewareApiService,
    private router: Router
  ) { }

  searchUser(UserID?, AlfToken?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('user/GetUserProfile?UserID=' + UserID + '&AlfToken=' + AlfToken).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          return reject(err);
        }
      );
    });
  }
  GetUserProfile(UserID?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('user/GetUserProfileByID?UserID=' + UserID).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  getUserEmail(entityOperatorID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(
          'Contract/GetContactPersons?operatorId=' + entityOperatorID + ''
        )
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            return reject(err);
          }
        );
    });
  }

  initSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    const config: SocketIoConfig = { url: `${environment.nodeSocketUrl}chat`, options: {} };
    this.socket = new Socket(config);
  }

  // getUserDetails() {
  //   return new Promise((resolve, reject) => {
  //     this.alfrescoService.peopleApi
  //       .getPerson(this.authService.getEcmUsername())
  //       .then(res => {
  //         return resolve(res);
  //       })
  //       .catch(err => {
  //         return reject(err);
  //       });
  //   });
  // }

  getUserDetailsCustom(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('tritex/userDetails?userName=' + userId)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  ping(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('tritex/ping')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getAllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('api/people?maxItems=-1')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getUser(userName): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('api/people/' + userName)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  addUserToGroup(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .postWebscript('tritex/adduser-togroup', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  getAllGroups(type): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('tritex/group-operator/' + type)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  validateTicket(ticket: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .getWebScript('api/login/ticket/' + ticket)
        .then((res: any) => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  setMenuItems() {
    this.walk(this.navItems);
    this.navMenuItems = [this.navItems];
    //this.MenuItems = this.getAllTritexMenusByRoleId('846a5812-eb7b-4732-bbd6-0e639cc5383e');
  }

  walk(data) {
    data.forEach(obj => {
      obj.url += '/' + new Date().getTime();
      if (obj.children && obj.children.length > 0) {
        this.walk(obj.children);
      }
    });
  }

  pushDataToMenuChildren(menu: any[], permissionkey: string, children: any) {
    menu.forEach(element => {
      if (element.permissionkey === permissionkey) {
        element.children.push(children);
      }
    });
  }

  pushDataToMenuSubChildren(menu: any[], permissionkey: string, chieldPermissionkey: string, children: any) {
    menu.forEach(element => {
      if (element.permissionkey === permissionkey) {
        element.children.forEach(child => {
          if (child.permissionkey === chieldPermissionkey) {
            child.children.push(children);
          }
        });
      }
    });
  }

  removeByIndex(arr, index) {
    arr.splice(index, 1);
  }

  createUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddlewareApiService
        .postWebscript('tritex/create-user', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  createNonTritexUser(details: any, userList: any[], Roles: string[], Operators: string[], Groups: string[]) {
    const operatorData = {
      Name: details.counterPartyName,
      OperatorCode: details.counterPartyTCID,
      OperatorID: details.counterPartyID,
      IsTritexOperator: 'false',
      createNewNotExist: true
    };

    return new Promise((resolve, reject) => {
      // this.operatorService
      //   .createOrEditNonTritexOperator(operatorData)
      //   .then((res: any) => {


      // this.createContractUser(userList, details.counterPartyID)
      this.createContractUser(userList, Roles, Operators, Groups)
        .then(res1 => {
          resolve(res1);
        })
        .catch(err => {
          reject(err);
        });


      // });
    });
  }

  createContractUser(user: any[], Roles: string[], Operators: string[], Groups: string[]) {

    const body = {
      saveuserList: [],
      AlfToken: localStorage.getItem('ticket-ECM'),
      Mode: 1,
      UserId: this.browserStorageService.getLocalStorageItem('userId'),
      IsFromRFQ: true
    };


    user.forEach(element => {
      body.saveuserList.push({
        EmailID: element.ntcpEmail,
        Name: element.ntcpFirstName,
        LastName: element.ntcpLastName,
        isTritexUser: false,
        Roles: Roles,
        Operators: Operators,
        Groups: Groups,
        WorkPhoneNo: 1111111111,
        PhoneNo: 1111111111,
        Address: '1111111111',
        CountryID: '91',
        Postcode: 111111,
        TritexUuid: '',
        // DomainID: this.browserStorageService.getLocalStorageItem('DomainID'),
        // DomainName: this.browserStorageService.getLocalStorageItem('DomainName')
        DomainID: 1,
        DomainName: 'tritexsolutions.com'
      });
    });



    // const formdata = new FormData();
    // formdata.append('postJson', JSON.stringify(body));
    // return new Promise((resolve, reject) => {
    //   this.saveUser(formdata).then(
    //     function (data) {
    //       return resolve(data);
    //     },
    //     function (error) {
    //       return reject(error);
    //     }
    //   );
    // });

    return new Promise((resolve, reject) => {
      this.saveUser(body).then(
        function (data) {
          return resolve(data);
        },
        function (error) {
          return reject(error);
        }
      );
    });
    // return new Promise((resolve, reject) => {
    //   this.alfrescoApiServices.postWebscript('tritex/create-user', body).then(
    //     function (data) {
    //       return resolve(data);
    //     },
    //     function (error) {
    //       return reject(error);
    //     }
    //   );
    // });
  }

  forgotPassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let client = 'tritexsolutions';
      const domain = this.browserStorageService.getLocalStorageItem('DomainName')
      if (domain) {
        client = domain.substring(0, domain.lastIndexOf('.'));
      }
      this.alfrescoService.getInstance().webScript.executeWebScript('POST', `${data.userName}/request-password-reset`, null, null, 'api/-default-/public/alfresco/versions/1/people', JSON.stringify({ client: client }))
        .then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  getAttempsts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/logged-in-user', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  changePassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/change-user-password', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  applyChangePassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('com/flex-solution/applyChangedPassword', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-roles')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getUserRolesById(uuid: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/getUserRolesById?uuid=' + uuid)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  saveUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFormDataWithHeader('user/SaveUser', data).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  removeUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader('user/SaveUser', data).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }


  saveTritexUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/create-user', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  releaseLock(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/unlock-account', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  SaveWhatsNew(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('User/SaveNewRelease', data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }
  getWhatsNew(flag: string, userid: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('User/GetNewRelease?Flag=' + flag + '&UserID=' + userid).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  public getWhatsNewList(Flag, UserID): any {
    this.getWhatsNew(Flag, UserID).then((res: any) => {
      return lodash.orderBy(res.result, function (o) {
        return moment(o.ReleaseDate);
      }, ['desc']);
    });
  }

  saveUserEventLog(data: UserEventLogModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postWithHeader('User/SaveEventLog', data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getUserEvents(module: string, referenceNo: string, id: string): Promise<any> {
    const userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Trade/GetTradeLogList?Module=' + module + '&ReferenceNo=' + referenceNo + '&UserID=' + userId + '&ID=' + id)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getUserEventsFolder(noderef: string, isCpUser: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/getUserEvent?nodeRef=' + noderef + '&isCpUser=' + isCpUser)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getTempFolderNodeRef(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/get-temp-folder-noderef')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getTritexNewRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-roles')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getTritexAllMenus(isTree): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-menus?treeStructure=' + isTree)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  public getAllTritexMenusByRoleId(roleId: String) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/getTritexMenuModelByRoleId?roleUUID=' + roleId)
        .then((res: any) => {
          this.navMenuItems = [];
          this.navMenuItems = lodash.cloneDeep(res.data);
          if (this.generalSettingMenu) {
            this.navMenuItems.push(this.generalSettingMenu);
            // this.walk(this.navMenuItems);
          }
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getAllTritexMenusInTreeView(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-menus')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getTritexAllPages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-pages')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getUnsignedContract(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/unsignedWorkflow')
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  saveAlfUserEventLog(data: UserEventAlfLogModel, versionLabel: string): Promise<any> {
    const postData: UserEventAlfLogModel = { ...data };
    postData.prop_tue_documentVersion = versionLabel;
    postData.prop_tue_roles = this.userRoles.join();
    const recepRoles = this.getRecepientRole(postData.prop_tue_recepient);
    postData.prop_tue_recepientRole = recepRoles;
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscript('api/type/tue:nodeDoc/formprocessor', postData)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  checkControlledDocument(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscript('tritex/check-controlled-document', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  updateDocument(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscript('tritex/updateDocument', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  GetGroupOperatorUser(Flag = 'Users', ID): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('user/GetGroupOperatorUser?Flag=' + Flag + '&CommonID=' + ID).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  login(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('api/login', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }


  verifyOTP(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/verify-otp', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  resetUserCounts(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/logged-in-user', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  requestOTP(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/generate-otp', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getRecepientRole(receipent: string): string {
    let role = '';
    if (receipent && this.rolesList) {
      if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'signatory') {
        role = 'SIGNATORY';
      } else if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'other') {
        role = 'FINANCE';
      } else if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'finance') {
        role = 'FINANCE';
      } else if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'roaming') {
        role = 'ROAMING';
      } else if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'legal') {
        role = 'LEGAL';
      } else if (receipent.substr(receipent.lastIndexOf('_') + 1) === 'non_tritex_counterparty') {
        role = 'NON_TRITEX_COUNTERPARTY';
      }
      return role;
    }
  }

  getRoleName(roleKey) {
    const role = this.rolesList.filter(x => x.roleCode === roleKey);
    const roleName = (role && role[0]) ? role[0].roleName : '';
    return roleName;
  }

  saveUserActivityLog(Module, SubModule, Event, Comments, CommonID = null) {
    this.activityLogModel.Module = Module;
    this.activityLogModel.SubModule = SubModule;
    this.activityLogModel.Event = Event;
    this.activityLogModel.Comments = Comments;
    this.activityLogModel.CommonID = CommonID;
    this.activityLogModel.UserID = this.browserStorageService.getLocalStorageItem('userId');
    // this.activityLogModel.BrowserName = this.deviceInfo.browser + ' - ' + this.deviceInfo.userAgent;
    // this.activityLogModel.Device = this.deviceInfo.os + ' - ' + this.deviceInfo.os_version;
    // return new Promise((resolve, reject) => {
    //   this.apiService
    //     .postWithHeader('User/SaveActivityLog', this.activityLogModel, true)
    //     .subscribe(
    //       (res: any) => {
    //         return resolve(res);
    //       },
    //       err => {
    //         reject(err);
    //       });
    // });
    return new Promise((resolve, reject) => {
    return resolve(true);
    });
  }
  getUserActivityLog(Flag: string, UserID: string, FromDate: string, ToDate: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('User/GetUserActivityLog?Flag=' + Flag + '&UserID=' + UserID + '&FromDate=' + FromDate + '&ToDate=' + ToDate).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  callApi(data: any, url): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscript(url, data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  callResetPassword(userName, key, workflowId, newPassword) {
    return new Promise((resolve, reject) => {
      const body = {
        personId: userName,
        password: newPassword,
        id: workflowId,
        key: key
      };
      this.alfrescoService.getInstance().webScript.executeWebScript('POST', 'resetPasswordCustom/resetPasswordData', null, null, null, JSON.stringify(body))
        .then((response) => {
          return resolve(response);
        }).catch((error) => {
          return reject(error);
        });
    });
  }


  forceUpdatePassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscript('tritex/force-update-password', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  sendNotificationToUser(assignee: string, messageFrom: string, action: string, refId: string,
    senderDispName: string, defaultRec: string): Promise<any> {
    const notificationData: NotificationModel = {
      NotificationType: '',
      Action: '',
      Message: '',
      MessageFrom: '',
      MessageTo: '',
      CreatedBy: ''
    };
    // Needs to add this
    //       Send
    // SignInCompleted
    // positive
    // negative
    // Reject
    let receiver = null;
    const userFName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
    notificationData.Action = userFName + ' at ' + senderDispName + ' has sent a contract.';
    notificationData.Message = 'New contract rec’d';
    if (action === 'Send') {
      notificationData.Action = userFName + ' at ' + senderDispName + ' has sent a contract.';
      notificationData.Message = 'New contract rec’d';
    } else if (action === 'positive') {
      notificationData.Action = userFName + ' at ' + senderDispName + ' has completed a contract.';
      notificationData.Message = 'New contract rec’d';
      receiver = defaultRec;
    } else if (action === 'negative') {
      notificationData.Action = userFName + ' at ' + senderDispName + ' has terminated a contract.';
      notificationData.Message = 'New contract rec’d';
      receiver = defaultRec;
    } else if (action === 'Reject') {
      notificationData.Action = userFName + ' at ' + senderDispName + ' has rejected a contract.';
      notificationData.Message = 'New contract rec’d';
    } else if (action === 'SignInCompleted') {
      notificationData.Action = userFName + ' at ' + senderDispName + ' has signed a contract.';
      notificationData.Message = 'New contract rec’d';
      receiver = defaultRec;
    }
    notificationData.CreatedBy = this.browserStorageService.getLocalStorageItem('userId');
    notificationData.MessageFrom = messageFrom;
    notificationData.NotificationType = 'DealFast';
    const sep = '~GROUP_';
    if (!assignee) {
      return;
    }

    if (!receiver) {
      receiver = assignee ? assignee.substring(
        assignee.lastIndexOf(sep) + sep.length,
        assignee.lastIndexOf('_')
      ) : '';
    }

    if (!receiver) {
      return;
    }
    let type = assignee.split(receiver + '_')[1];
    if (!type) {
      type = 'roaming';
    }
    notificationData.MessageTo = receiver;
    notificationData.CreatedBy = this.browserStorageService.getLocalStorageItem('userId');

    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .getWebScript('tritex/non-tritex-user?code=' + receiver + '&type=' + type).then((res: any) => {
          if (res && res.users) {
            const userIds = [];
            res.users.forEach(element => {
              userIds.push(element.ntcpUserUuid);
            });
            this.sendContractNotification(userIds, notificationData.Message, notificationData.Action);

          }
        });
    });
  }


  // const data = {
  //   ids: [receiver],
  //   types: [type]
  // };
  // this.getUsersByIds(data);

  insertNotificationrecord(title, bodymsg, OperatorID: any[], Roles: any[] = null) {
    if (OperatorID && OperatorID.length > 0 && title !== '') {
      const data = {
        ids: OperatorID,
        types: Roles
      };
      this.getUsersByIds(data).then((res: any) => {
        this.sendContractNotification(res.users.map(x => x.uuid), title, bodymsg);
      });
    }
  }

  getUsersByIds(data) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/users-list-by-id-and-type', data).then((res: any) => {
          return resolve(res);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  sendEmailToAdmin(data) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/non-tritex-email-to-admin', data).then((res: any) => {
          return resolve(res);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  sendContractNotification(userIds, action, message) {
    const dataS = {
      userIds: userIds,
      title: action,
      body: message
    };
    this.socket.emit('contractNotification', dataS);
  }

  manageOTP(data): Promise<any> {
    return new Promise((resolve, reject) => {
      // {
      //   "requestType": "validate", / send
      //   "otpType":"mobile",
      //   "userName":"vikash1019@gmail.com",
      //   "toString" : "+919909374679",
      //   "otp" : "848545"
      //   }
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('tritex/manage-otp', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  updateUserPropsByNodeRef(data, nodeRef): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices
        .postWebscriptWithoutAuth('api/node/' + nodeRef + '/formprocessor', data)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  Chat_GetUserList(Flag, SerachChar, UserID, Skip?, Limit?): Observable<any> {
    this.apiService.isSpinner = false;
    return this.apiService.getWithHeader('user/Chat_GetUserList?Flag=' + Flag + '&SerachChar=' + SerachChar +
      '&UserID=' + UserID + '&Skip=' + '&Limit=');
  }

  getWFStatus(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScriptWithoutAuth('tritex/reset-password-active?workflowId=' + id)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getUsageReport(QueryType, Flag: string, FromDate: string, ToDate: string, isOperator?: number, CommonID?: any, ParentCode?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('User/GetUsageReport?Flag=' + Flag + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&isOperator=' + isOperator + '&CommonID=' + CommonID + '&ParentCode=' + ParentCode + '&AlfToken=' + localStorage.getItem('ticket-ECM')
      ).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          return reject(err);
        }
      );
    });
  }
  getTritexUserDetails(Flag: string,UserID:string): Promise<any> {
    //api/Auth/GetMenu(string Flag,Guid UserID) where Flag='RolePage' and Usrid='BEC752B2-7D07-4BBD-83B4-AA7C8CC8844B'
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(
          'Auth/GetMenu?Flag=' + Flag + '&UserID='+UserID
        )
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            return reject(err);
          }
        );
    });
  }

}
