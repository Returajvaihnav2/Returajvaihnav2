import { Injectable } from '@angular/core';
import { AuthenticationService, AlfrescoApiService } from '@alfresco/adf-core';
import { AlfrescoMiddlewareApiService } from './alfresco-middleware-api.service';
import { ApiService } from './api.service';
import { UserService } from './user/user.service';
import { BrowserStorageService } from '../utility/browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyTaskServiceService {

  alfrescoJsApi: any;
  constructor(private authService: AuthenticationService,
    private apiService: AlfrescoApiService,
    private alfrescoApiServices: AlfrescoMiddlewareApiService,
    private httpApiService: ApiService,
    private browserStorageService: BrowserStorageService,
    private userService: UserService) {
  }

  getWorkflows(params?: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/contracts-list-v2' + params)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }
  getnewWorkflows(params?: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/contract-counts' + params)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getExpiringWorkflows(params: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflows-by-days?filter=' + params)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getCompetedTasks(getCount?: boolean) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflow-task-completed?getCount=' + getCount)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getTradCounterGrp(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/trading-cp-groups', body)
        .then(function (res) {
          return resolve(res);
        }, function (err) {
          return reject(err);
        });
    });
  }

  getActiveTasks() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('api/task-instances?authority='
        + this.authService.getEcmUsername() + '&exclude=wcmwf:*')
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getActiveWF(wfID) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('api/workflow-instances/' + wfID + '?includeTasks=true')
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getTaskDetails(taskId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('api/task-instances/' +
        taskId + '?detailed=true&noCache=' + new Date().getTime())
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getTaskDetailsWithHistory(taskId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflow-task?taskId=' + taskId)
        .then((data) => {
          return resolve(data);
        }).catch((error) => {
          return reject(error);
        });
    });
  }

  getTaskDetailsWithHistoryOutbox(taskId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflow-task-completed?taskId=' + taskId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getTaskDetailsExecutedContract(workflowId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/completed-wf-history?workflowId=' + workflowId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getTaskDetailsUnsignedContract(workflowId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/active-wf-detail-by-id?workflowId=' + workflowId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getActiveTask() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflow-task')
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getActiveWorkflows() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflowDetails?state=active&deal=my')
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getUnsignedTask() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/unsignedWorkflow')
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getInBoxUnReadCount() {
    let unReadCount = 0;
    return new Promise((resolve, reject) => {
      this.getActiveTask().then((res: any) => {
        const myTask = res.data;
        myTask.forEach(element => {
          if (this.isUnRead(element)) {
            unReadCount += 1;
          }
        });
      });
      return unReadCount;
    });
  }

  getMyTasks() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('api/task-instances?authority=' + this.authService.getEcmUsername())
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
    // return this.apiService.getInstance().webScript.executeWebScript(
    //   'GET',
    //   'tasks',
    //   [],
    //   null,
    //   'api/-default-/public/workflow/versions/1',
    //   null
    // ).then(
    //   (response: any) => {
    //     return response;
    //   }
    // );
  }

  // setUserRoles() {
  //   return new Promise((resolve, reject) => {
  //     this.alfrescoApiServices.getWebScript('tritex/userDetails')
  //       .then(function (data) {
  // if (data != null && data !== undefined && data['groups'] != null && data['groups'] !== undefined) {
  //   for (let groupIndex = 0; groupIndex < data['groups'].length; groupIndex++) {
  //     if (data['groups'][groupIndex]['itemName'] === 'GROUP_tritex_roaming_manager') {
  //       this.browserStorageService.setSessionStorageItem('userRole', 'Roaming');
  //     } else if (data['groups'][groupIndex]['itemName'] === 'GROUP_tritex_signatory_manager') {
  //       this.browserStorageService.setSessionStorageItem('userRole', 'Signatory');
  //     } else if (data['groups'][groupIndex]['itemName'] === 'GROUP_tritex_legal_manager') {
  //       this.browserStorageService.setSessionStorageItem('userRole', 'Legal');
  //     } else if (data['groups'][groupIndex]['itemName'] === 'GROUP_tritex_other_manager') {
  //       this.browserStorageService.setSessionStorageItem('userRole', 'Other');
  //     }
  //   }
  // }
  //         if (data != null && data !== undefined && data['role'] != null && data['role'] !== undefined) {
  //           if (data['role'] === 'ROAMING_MANAGER') {
  //             this.browserStorageService.setSessionStorageItem('userRole', 'Roaming');
  //           } else if (data['role'] === 'SIGNATORY_MANAGER') {
  //             this.browserStorageService.setSessionStorageItem('userRole', 'Signatory');
  //           } else if (data['role'] === 'LEGAL_MANAGER') {
  //             this.browserStorageService.setSessionStorageItem('userRole', 'Legal');
  //           } else if (data['role'] === 'OTHER_MANAGER') {
  //             this.browserStorageService.setSessionStorageItem('userRole', 'Other');
  //           }
  //         }
  //         return resolve(data);
  //       }, function (error) {
  //         return reject(error);
  //       });
  //   });
  // }
  // getLoginUserDetails() {
  //   return new Promise((resolve, reject) => {
  //     this.alfrescoApiServices.getWebScript('api/people/' + this.authService.getEcmUsername() + '?groups=true')
  //       .then(function (data) {
  //         return resolve(data);
  //       }, function (error) {
  //         return reject(error);
  //       });
  //   });
  // }


  getAssignee(tradingCode: any, counterCode: any, isRoaming) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/getsubGroup?tradingCode=' + tradingCode +
        '&counterCode=' + counterCode + '&isRoaming=' + isRoaming).then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getCounterParty(counterCode: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/get-roaming-user?OperatorId=' + counterCode)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getgroupUser(groupName: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/getgroupUser?groupName=' + groupName)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  approveRejectTask(taskId, body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('api/task/' + taskId + '/formprocessor', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  cancelSignatureAndRecallTask(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('/tritex/cancel-sign-recall-task', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getChild(nodeId: any) {

    return new Promise((resolve, reject) => {
      this.apiService.nodesApi.getNodeChildren(nodeId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  isUnRead(task: any) {
    let isUnRead = false;
    const readUsers = task['taskReadUsers'];
    if (readUsers == null) {
      isUnRead = true;
    } else {
      const array = readUsers.split(',');
      if (!(array.indexOf(this.authService.getEcmUsername()) > -1) ||
        !(array.indexOf(this.authService.getEcmUsername().toLowerCase()) > -1)) {
        isUnRead = true;
      }
    }
    return isUnRead;
  }

  markAsRead(taskId: any) {
    const body = { 'taskId': taskId };
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/mark-contract-read', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }



  sendInvitationMail(email: string) {
    const body = {
      'emailId': email
    };
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/send-alert', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  setInBoxCountValue(value: any) {
    this.userService.navMenuItems.forEach(elem => {
      if (elem.name === 'DealFAST') {
        elem.children.forEach(childRoute => {
          if (childRoute.name === 'Inbox') {
            if (value > 0) {
              childRoute['badge'] = {
                variant: 'count',
                text: String(value)
              };
            } else {
              childRoute['badge'] = {};
            }
            return;
          }
        });
      }
    });
  }

  reAssignTask(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/claim-reassign-task', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  saveSignatory(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/add-docu-sign-prop', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  removeDocuSignAspect(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/remove-docu-sign-aspect', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  cancelDocuSignProcess(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/cancel-signature-process', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }
  sendCompletionEmail(body) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/send-completion-email', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  sendForSign(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/sign-contract', body)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  getDocuSignEnvStatus(nodeId: string, envelopId: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/docu-sign-envelop-status?nodeId=' + nodeId + '&envelopId=' + envelopId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }

  convertDocToPdf(data: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/doc-to-pdf', data)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  updateSigntureProcess(data: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/update-wet-ink-sign-process', data)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  moveSignedDocs(data: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/remove-signature-doc', data)
        .then(function (res) {
          return resolve(res);
        }, function (error) {
          return reject(error);
        });
    });
  }

  // nonTritexCounterParty(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.httpApiService.getWithHeader('Contract/GetNonTritex?Flag=NonTritex').subscribe((res: any) => {
  //       return resolve(res);
  //     }, (err) => {
  //       reject(err);
  //     });
  //   });
  // }
  setInBoxCount(data: any[]) {
    let unReadCount = 0;
    // this.getActiveTask().then((res: any) => {
    const myTask = data;
    if (myTask && myTask.length > 0) {
      myTask.forEach(element => {
        if (this.isUnRead(element)) {
          unReadCount += 1;
          this.setInBoxCountValue(unReadCount);
        }
      });
    } else {
      this.setInBoxCountValue(unReadCount);
    }
    // });
  }


  getNonTritexUsers(code: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/non-tritex-user?code=' + code)
        .then(function (data) {
          return resolve(data);
        }, function (error) {

        });
    });
  }

  lockTask(body: any) {

    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/lock-task', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  addPropsToNode(body: any, id: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/add-first-draft-props', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  isDocControlled(body: any, id: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('api/node/workspace/SpacesStore/' + id + '/formprocessor', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  addAspectToNode(body: any, id: string) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('slingshot/doclib/action/aspects/node/workspace/SpacesStore/' + id, body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  getGroupUsers(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/get-multi-group-users', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  sendEmailAlert(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/send-alert', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  recallContract(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/recall/task', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  completeCPSigning(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/complete-cp-signing/task', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  completeCPContract(body: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.postWebscript('tritex/complete-cp-signing-task', body)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  getContractByRefId(refId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/workflowDetails?isByRefId=true&refId=' + refId)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }
  getChargeableMenus() {
    return new Promise((resolve, reject) => {
      this.alfrescoApiServices.getWebScript('tritex/list-chargeable-menus')
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }
}
