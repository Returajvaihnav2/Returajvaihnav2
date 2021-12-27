import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as lodash from 'lodash';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityProvider } from 'src/app/utility/utility';
import { Constants } from 'src/app/constants/app.constants';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ApiService } from 'src/app/services/api.service';
import { ListExcelService } from 'src/app/services/export-file/list_excel.service';
import { BrowserStorageService } from 'src/app/utility/browser-storage.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-deal-over-view',
  templateUrl: './deal-over-view.component.html',
  styleUrls: ['./deal-over-view.component.scss']
})
export class DealOverViewComponent implements OnInit {
  @Input() public NoOfItems = 0;
  @Input() public innerWidth: any;
  @Input() public modalRef: any;
  @Output() openMoelEvent = new EventEmitter<string>();
  public HeadingList = [];
  public DealList: any = [];
  @Input() public dealOverData: any = [];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatPaginator') paginator: MatPaginator;
  rowCount = 0;
  userId: string;
  inboxList: any = [];
  isInboxRef = false;
  ItemEffected: string

  constructor(private listexcelService: ListExcelService,
    private browserStorageService: BrowserStorageService,
    private apiService: ApiService,
    private spinner: SpinnerService, private route: Router,
    public userService: UserService,
    public utility: UtilityProvider
  ) {


  }
  displayedColumns = ['CounterParty', 'TradeStatus', 'ContractStatus',
    'SignStatus', 'TAPStatus'];

  //this.headings
  ngOnInit(): void {
    this.apiService.isSpinner = false;
    this.spinner.displaySpinner(true);
    this.userId = this.browserStorageService.getLocalStorageItem('userId');
    this.getdata().then((resp) => {
      this.apiService.isSpinner = true;
      this.spinner.displaySpinner(false);
    }, (err) => {
      this.apiService.isSpinner = true;
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getdata(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.HeadingList = this.dealOverData.ActivityHeaderModel;
      this.DealList = this.dealOverData.ActivityDetailModel;
      if (this.NoOfItems) {
        this.DealList = lodash.slice(this.DealList, 0, this.NoOfItems);
      } else {
        this.DealList = this.DealList;
      }
      this.dataSource = new MatTableDataSource(this.DealList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.rowCount = this.DealList ? this.DealList.length : 0;
      return resolve(this.dataSource);
    });
  }

  get headings() {
    this.HeadingList = this.dealOverData.ActivityHeaderModel;
    return this.HeadingList;
  }

  generateListExcel() {
    const data: any = { 'Headings': [], 'Items': [] };
    this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME, Constants.USER_ACTIVITIES.DEALOVERVIEW.NAME,
      Constants.USER_ACTIVITIES.DEALOVERVIEW.EXPORT_EXCEL, Constants.NO_COMMENTS, '');
    if (this.dataSource && this.dataSource.filteredData && this.dataSource.filteredData.length > 0) {
      this.apiService.isSpinner = false;
      this.spinner.displaySpinner(true);
      data.Headings = this.headings;
      data.Items = lodash.cloneDeep(this.dataSource.filteredData);
      this.listexcelService.generateExcel(data, 'DealOverView').then((res) => {
        this.apiService.isSpinner = true;
        this.spinner.displaySpinner(false);
      }).catch((err) => {
        this.apiService.isSpinner = true;
        this.spinner.displaySpinner(false);
      });
    }
  }

  getCount(filter) {
    if (!filter) {
      if (this.dealOverData && this.dealOverData.ActivityDetailModel && this.dealOverData.ActivityDetailModel.length) {
        return this.dealOverData.ActivityDetailModel.length;
      } else {
        return 0;
      }
    } else {
      if (this.dealOverData && this.dealOverData.ActivityDetailModel && this.dealOverData.ActivityDetailModel.length) {
        return this.dealOverData.ActivityDetailModel.slice(0, filter).length;
      } else {
        return 0;
      }
    }

  }

  openModal(template: any) {
    this.openMoelEvent.emit(template);
  }

  addNewItem(value: string) {

  }

  getclass(i) {
    return {
      'background': '',
      'color': ''
    }
    // if (this.HeadingList && this.HeadingList.length) {
    //   return {
    //     'background': this.HeadingList[i].Background,
    //     'color': this.HeadingList[i].Color
    //   };
    // } else {
    //   return {
    //     'background': '',
    //     'color': ''
    //   }
    // }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToPage(element, FlagPage, ctrlKey) {
    // #region "added block"
    sessionStorage.removeItem('IsSignedContract');
    // #endregion 
    if (FlagPage == 'TRADE') {
      this.userService.saveUserActivityLog(Constants.DASHBOARD.SUBMODULE.DEALOVERVIEW,
        Constants.TRADE_FAST.NAME, Constants.USER_ACTIVITIES.TRADE.READ,
        Constants.NO_COMMENTS, element.TradeID);
      this.getTradeDetails(element, ctrlKey);
    } else if (FlagPage == 'TAP') {
      this.userService.saveUserActivityLog(Constants.DASHBOARD.SUBMODULE.DEALOVERVIEW,
        Constants.USER_ACTIVITIES.TAP.NAME, Constants.USER_ACTIVITIES.TAP.READ,
        Constants.NO_COMMENTS, element.TAPID);
      this.redirectoTap(element, ctrlKey);
    } else if (FlagPage == 'DEAL') {
      this.userService.saveUserActivityLog(Constants.DASHBOARD.SUBMODULE.DEALOVERVIEW,
        Constants.DEAL_FAST.NAME, Constants.USER_ACTIVITIES.CONTRACT.READ,
        element.referenceNo, element.ContractID);
      this.redirectToDetailPage(element, ctrlKey);
    }
  }

  redirectoTap(element, ctrlKey) {
    if (element.ContractID != '' && element.ContractID != '01000000-0000-0000-0000-000000000000') {
      this.browserStorageService.setSessionStorageItem('tapcontractID', element.ContractID);
    } else {
      this.browserStorageService.setSessionStorageItem('taptradeid', element.TradeID);
    }
    if (element.OpcoID && element.OpcoID.length) {
      this.browserStorageService.setSessionStorageItem('tapOperatorID', element.OpcoID);
    }
    this.browserStorageService.setSessionStorageItem('taptype', this.route.url);
    this.browserStorageService.setSessionStorageItem('tapID', element.TAPID);
    this.utility.openInNewTabIfCtrl('/tap-instruction/create-tap/tap/' + new Date().getTime(), ctrlKey);
  }

  getTradeDetails(element, ctrlKey) {
    let navUrl = '';
    if (element.TradeStatusEnumID === 9) {
      this.browserStorageService.setSessionStorageItem('newtradeId', element.TradeID);
      this.browserStorageService.setSessionStorageItem('newcpid', '0');
      this.browserStorageService.setSessionStorageItem('newstatus', element.TradeStatus);
      if (element.TypeEnumID == 2) {
        navUrl = '/trade-fast/newtrade/trade-nb-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
      } else if (element.TypeEnumID == 3) {
        navUrl = '/trade-fast/newtrade/trade-m-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
      } else {
        navUrl = '/trade-fast/newtrade/trade-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
      }
    } else {
      this.browserStorageService.setSessionStorageItem('submittradeid', element.TradeID);
      this.browserStorageService.setSessionStorageItem('submitcpid', element.TradeCounterPartyID);
      this.browserStorageService.setSessionStorageItem('submitstatus', element.TradeStatus);
      this.browserStorageService.setSessionStorageItem('submittradtype', element.TypeEnumID);
      navUrl = '/trade-fast/submit/' + new Date().getTime() + '/' + new Date().getDate();
    }
    this.utility.openInNewTabIfCtrl(navUrl, ctrlKey);
  }

  redirectToDetailPage(data, ctrlKey) {
    //#region "new code added"
    let IsSignedContract = false;
    //#endregion 
    const OriginalStatus = data.originalStatus.toLowerCase();
    data.workflowId = 'activiti$' + data.wfId;
    //#region "new code added"
    if (data.FromEnumID === 2 && (!data.taskId && !data.wfId && OriginalStatus.toLowerCase() === 'completed')) {
      this.browserStorageService.setSessionStorageItem('IsSignedContract', true);
      IsSignedContract = true;
    }
    //#endregion
    if ((OriginalStatus === 'internal' || OriginalStatus === 'counterParty'
      || OriginalStatus === 'checked-out' || OriginalStatus === 'expires'
      || OriginalStatus === 'completed') && !IsSignedContract) {
      this.sendTOUnsignedOnly(data, ctrlKey);
      //#region "new code added"
    } else if (OriginalStatus === 'drafted' || OriginalStatus === 'screensaved' || IsSignedContract) {
      this.taskDetailDraft(data, ctrlKey, IsSignedContract);
      //#endregion
    } else if ((OriginalStatus === 'withCounterParty' || OriginalStatus === 'withinternal') && (data.taskId !== data.wfId && data.taskId !== data.workflowId)) {
      this.taskDetailOutbox(data, ctrlKey);
    } else if (OriginalStatus === 'completed') {
      this.taskDetailExecutedContract(data, ctrlKey);
    } else if (OriginalStatus === 'awaitingmysignature' && data.wfId === data.taskId) {
      this.sendTOUnsignedOnly(data, ctrlKey);
    } else if ((OriginalStatus === 'withmyteam') || OriginalStatus === 'awaitingmysignature' || data.isActive) {
      this.taskDetailInbox(data, null, ctrlKey); //// ask vikas
    } else if (data.listType === 'checkedOut') {
      this.taskDetailCheckedOut(data, ctrlKey);
    } else {
      this.taskDetailUnsigned(data, ctrlKey);
    }

  }

  // workflowId
  sendTOUnsignedOnly(data, ctrlKey) {
    this.browserStorageService.setSessionStorageItem('unsignedWorkflowId', data.workflowId);
    this.utility.openInNewTabIfCtrl('/deal-fast/inbox/unsigned/detail', ctrlKey);
  }

  // statusDisplay and contractFolder
  taskDetailDraft(data, ctrlKey, IsSignedContract = false) {

    this.logEventCall(data, 'DRAFT');
    let ContractUrl = '';
    if (data.originalStatus.toLowerCase() === 'drafted' || data.originalStatus.toLowerCase() === 'draft' || IsSignedContract) {
      this.browserStorageService.setSessionStorageItem('draftnodeId', data.contractFolder);
      ContractUrl = 'draft-detail';
    } else if (data.originalStatus.toLowerCase() === 'screensaved') {
      let FormType = '';
      if (data.FromEnumID === 1 && data.TypeEnumID == 1) {
        ContractUrl = '/deal-fast/new/iot-disc-agreement/' + new Date().getTime() + '/' + new Date().getDate();
        FormType = 'iot';
      } else if (data.FromEnumID === 1 && data.TypeEnumID == 2) {
        ContractUrl = '/deal-fast/new/nb-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
        FormType = 'nbiot';
      } else if (data.FromEnumID === 1 && data.TypeEnumID == 3) {
        ContractUrl = '/deal-fast/new/m-iot-agreement/' + new Date().getTime() + '/' + new Date().getDate();
        FormType = 'miot';
      } else if (data.FromEnumID === 2) {
        ContractUrl = '/deal-fast/new/offline-agreement/' + new Date().getTime() + '/' + new Date().getDate();
        FormType = 'offline';
      }

      this.browserStorageService.setSessionStorageItem(FormType + 'contractId', data.ContractID);
      this.browserStorageService.setSessionStorageItem(FormType + 'type', 'deal-fast/contracts');
      this.browserStorageService.setSessionStorageItem(FormType + 'tageID', '');
      this.browserStorageService.setSessionStorageItem(FormType + 'dealtype', data.TypeEnumID);
    }
    this.utility.openInNewTabIfCtrl(ContractUrl, ctrlKey);
  }

  // taskId and referenceNo and inboxList/isInboxRef
  taskDetailOutbox(data, ctrlKey) {
    this.logEventCall(data, 'OUTBOX');

    if (!data.taskId.includes('activiti$')) {
      data.taskId = 'activiti$' + data.taskId;
    }
    this.browserStorageService.setSessionStorageItem('OutboxTaskId', data.taskId);
    if (this.inboxList.length > 0) {
      for (let i = 0; i < this.inboxList.length; i++) {
        if (this.inboxList[i].referenceNo === data.referenceNo) {
          this.isInboxRef = true;
          break;
        }
      }
    }
    // check if task is present in inbox then redirect to inbox-detail page else outbox-detail page
    let navigateUrl = 'deal-fast/outbox/task-detail';
    if (this.isInboxRef) {
      navigateUrl = '/deal-fast/inbox/' + data.taskId;
    }
    this.utility.openInNewTabIfCtrl(navigateUrl, ctrlKey);
  }

  // workflowId
  taskDetailExecutedContract(data: any, ctrlKey) {

    this.logEventCall(data, 'EXECUTED');

    this.browserStorageService.setSessionStorageItem('ExecutedTaskId', data.workflowId);
    this.utility.openInNewTabIfCtrl('/deal-fast/executed/completed/task-detail', ctrlKey);
  }

  // taskId
  taskDetailInbox(data, taskId: string, ctrlKey) {

    this.logEventCall(data, 'INBOX');

    if (taskId) {
      data.taskId = taskId;
    }
    if (!data.taskId.includes('activiti$')) {
      data.taskId = 'activiti$' + data.taskId;
    }
    this.utility.openInNewTabIfCtrl('/deal-fast/inbox/' + data.taskId, ctrlKey);
  }

  // taskId and workflowId and referenceNo and inboxList/isInboxRef
  taskDetailCheckedOut(data: any, ctrlKey) {
    this.logEventCall(data, 'CHECKEDOUT');
    if (this.inboxList.length > 0) {
      for (let i = 0; i < this.inboxList.length; i++) {
        if (this.inboxList[i].referenceNo === data.referenceNo) {
          this.isInboxRef = true;
          break;
        }
      }
    }
    let navigateUrl = '';
    if (this.isInboxRef) {
      if (!data.taskId.includes('activiti$')) {
        data.taskId = 'activiti$' + data.taskId;
      }
      navigateUrl = '/deal-fast/inbox/' + data.taskId;
    } else {
      this.browserStorageService.setSessionStorageItem('unsignedWorkflowId', data.workflowId);
      navigateUrl = '/deal-fast/inbox/unsigned/detail';
    }
    this.utility.openInNewTabIfCtrl(navigateUrl, ctrlKey);
  }

  // referenceNo and workflowId and 
  taskDetailUnsigned(data, ctrlKey) {
    this.logEventCall(data, 'UNSIGNED');
    const taskId = this.checkTasks(data.referenceNo);
    if (taskId) {
      this.taskDetailInbox(data, taskId, ctrlKey);
    } else {
      this.browserStorageService.setSessionStorageItem('unsignedWorkflowId', data.workflowId);
      this.utility.openInNewTabIfCtrl('/deal-fast/inbox/unsigned/detail', ctrlKey);
    }
  }

  //  referenceNo and inboxList
  checkTasks(referenceNo: string) {
    let taskId = null;
    if (referenceNo) {
      if (this.inboxList) {
        for (let i = 0; i < this.inboxList.length; i++) {
          if (this.inboxList[i].referenceNo === referenceNo) {
            taskId = this.inboxList[i].taskId;
          }
        }
      }
    }
    return taskId;
  }

  // referenceNo
  logEventCall(data, type) {
    // const FromEnumText = (data.FromEnumID == 2) ? 'OFFLINE' : 'ONLINE';
    // const TypeEnumText = (data.TypeEnumID == 2) ? 'NBIOT' : (data.TypeEnumID == 3) ? 'MIOT' : 'IOT';
    // const SUBMODULE = FromEnumText + TypeEnumText;
    // this.userService.saveUserActivityLog(Constants.DEAL_FAST.NAME,
    //   Constants.DEAL_FAST.SUBMODULE[SUBMODULE], Constants.USER_ACTIVITIES.CONTRACT.READ,
    //   Constants.USER_ACTIVITIES.CONTRACT.STATUS[type], data.ContractID ? data.ContractID : data.referenceNo);
  }

close(){
  this.modalRef.close();
  this.apiService.isSpinner = true;
  this.spinner.displaySpinner(false);
}
}
