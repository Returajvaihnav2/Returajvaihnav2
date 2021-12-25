import { AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, NgZone, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Constants } from 'src/app/constants/app.constants';
import { ApiService } from 'src/app/services/api.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { MyTaskServiceService } from 'src/app/services/my-task-service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user/user.service';
import { BrowserStorageService } from 'src/app/utility/browser-storage.service';
import { UtilityProvider } from 'src/app/utility/utility';
import { environment } from 'src/environments/environment';
import * as lodash from 'lodash';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { AnalyseFastService } from 'src/app/services/analyse-fast/analyse-fast.service';
import { MatDialog } from '@angular/material/dialog';
import { dealoverviewModel } from 'src/app/staticdata/dealover.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isFast = false;
  newScreen2Form: FormGroup;
  myCompletedWorkflows: any = 0;
  myLegal: any = 0;
  myActiveWorkflows: any = 0;
  my: any = 0;
  Max = Number(0);
  Min = Number(0);
  summery = {};

  // private _hubConnection: HubConnection;
  public DsTradeCount = new class {
    AwaitingResponse: number;
    ExpireInTwoDays: string;
    LastMonthIssue: string;
    LastMonthReceive: string;
    NewRFQCounter: number;
    YearIssue: string;
    YearReceive: string;
    Accepted: string;
    MyTrades: string;
    TeamTrades: string;
  };

  customUserData: any;
  userId: string;
  userRole: any[];
  TapData = [];
  TapFastNotapchartDataCount = 0;
  TapFastActionNeedDataCount = 0;
  dropdownSettings = {};
  CommitmentsData = [];
  RevenueCostData = [];
  CurruntYear = 2016;
  LabelText = '';
  public dealtypedoughnutChartLabels: string[] = [];
  public dealtypedoughnutChartData: number[] = [];
  public dealtypedoughnutChartbackgroundColor: string[] = [];
  public dealtypedoughnutChartpointHoverBackgroundColor: string[] = [];
  completedTask: any;
  activeTasks: any;
  isApiCalled = false;
  minimumRolesIndex = 0;
  DashBoardRights = new DashboardAccess();
  Counterparty = 0;
  signed = 0;
  dealFastContactData: any[] = [];
  commitmentColors = {
    dark: '',
    medium: '',
    light: ''
  };

  globalCounts: any;

  @ViewChild('mySelect') mySelect;
  @ViewChild('DealOverviewDeails') DealOverviewDeails;
  ExpireType = [
    { ID: 1, Name: '3 Months' },
    { ID: 2, Name: '1 Months' },
    { ID: 3, Name: '2 Weeks' },
    { ID: 4, Name: '1 Day' }
  ];

  public ExpireIn = 1;

  //modalRef: BsModalRef;
  modalRef: any;
  public innerWidth: any;
  public dealOverData: any = [];
  public resp: any;
   dealoverview=new dealoverviewModel();
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    private myTaskService: MyTaskServiceService,
    private route: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private browserStorageService: BrowserStorageService,
    private dashBoardService: DashboardService,
    private apiService: ApiService,
    private spinner: SpinnerService,
    // private analyseFastService: AnalyseFastService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    public utility: UtilityProvider,
    private dialog: MatDialog
    
  ) {
    this.isFast = environment.isFast;
  }
  ngOnInit() {
    this.resp = this.dealoverview.getDealOverViewData();
    this.dealOverData=this.resp.result;
    this.apiService.isSpinner = false;
    this.spinner.displaySpinner(true);
     this.userId = this.browserStorageService.getLocalStorageItem('userId');
     this.userRole=JSON.parse(this.browserStorageService.getSessionStorageItem('UserRoleNames'));    
    if (this.browserStorageService.getLocalStorageItem('TritexToken')) {
    this.callData();
    } else {
      this.route.navigate(['/auth/login']);
    }

  }

  ngOnDestroy(): void {
    if (this.modalRef) { this.modalRef.close() }
  }
  // private tapFASTChart: am4charts.PieChart;

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }



  redirectToInbox() {
    this.browserStorageService.setSessionStorageItem('filterMenu', 'awaitingYourReview');
    this.route.navigate(['deal-fast/contracts']);
  }

  redirectToOutbox() {
    this.browserStorageService.setSessionStorageItem('filterMenu', 'awaitingReview');
    this.route.navigate(['deal-fast/contracts']);
  }

  redirectToSearch(state: any) {
    this.route.navigate(['custom-search', state]);
  }

  redirectToUnsignedContracts(state: any) {
    this.browserStorageService.setSessionStorageItem('filterMenu', 'awaitingCPSigns');
    this.route.navigate(['deal-fast/contracts']);
  }


  redirectToListing(days, label) {
    //'3m', 'Exp. in 3 Months'
    switch (this.ExpireIn) {
      case 1:
        days = '3m';
        label = 'Exp. in 3 Months';
        break;
      case 2:
        days = '1m';
        label = 'Exp. in 1 Months';
        break;
      case 3:
        days = '2w';
        label = 'Exp. in 2 Weeks';
        break;
      case 4:
        days = '1d';
        label = 'Exp. in 1 Day';
        break;
      default:
        days = '3m';
        label = 'Exp. in 3 Months';
        break;
    }
    if (this.minimumRolesIndex === 1 || this.minimumRolesIndex === 2 || this.minimumRolesIndex === 3) {
      this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME,
        Constants.DASHBOARD.SUBMODULE.DEAL, label + ' ' + Constants.USER_ACTIVITIES.Dashboard.Visit,
        Constants.NO_COMMENTS, Constants.NO_COMMENTS);
      this.browserStorageService.setSessionStorageItem('contractsExpiringDays', days);
      this.browserStorageService.setSessionStorageItem('label', label);
      this.route.navigate(['deal-fast/contracts/expires']);
    }
  }

  redirectToSigned() {
    this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME,
      Constants.DASHBOARD.SUBMODULE.DEAL, 'Signed ' + Constants.USER_ACTIVITIES.Dashboard.Visit,
      Constants.NO_COMMENTS, Constants.NO_COMMENTS);
    this.browserStorageService.setSessionStorageItem('filterMenu', 'Signed');
    this.route.navigate(['deal-fast/contracts']);
  }

  contractExecuted(state: any) {

    this.browserStorageService.setSessionStorageItem('filterMenu', 'completed');
    this.route.navigate(['deal-fast/contracts']);
  }

  redirectToDraft(Flag) {
    let navUrl = '';
    switch (Flag.toLowerCase()) {
      case 'counterparty':
        navUrl = '/deal-fast/contracts/counterParty';
        break;
      // case 'internal':
      //   navUrl = '/deal-fast/contracts/internal';
      //   break;
      // case 'teamcontract':
      //   navUrl = '/deal-fast/contracts/awaitingYourReview';
      //   break;
      case 'mycontract':
        navUrl = '/deal-fast/contracts/awaitingYourReview/me';
        break;
    }
    this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME,
      Constants.DASHBOARD.SUBMODULE.DEAL, Flag + ' ' + Constants.USER_ACTIVITIES.Dashboard.Visit,
      Constants.NO_COMMENTS, Constants.NO_COMMENTS);
    this.route.navigate([navUrl]);
  }

  redirectToBlotter(status: string) {
    this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME,
      Constants.DASHBOARD.SUBMODULE.TRADE, (status == 'ExpIn2') ? 'Exp. in 2 Days' : status + ' ' + Constants.USER_ACTIVITIES.Dashboard.Visit,
      Constants.NO_COMMENTS, Constants.NO_COMMENTS);
    this.browserStorageService.setSessionStorageItem('dbblotterstatus', status);
    this.route.navigate(['trade-fast/blotter/' + new Date().getTime() + '/' + new Date().getDate()]);
  }

  callData() {
   // this.userRole = this.userService.userRoles;
    const roleIndexs = [];
    for (let index = 0; index < this.userRole.length; index++) {
      const element = this.userRole[index];
      roleIndexs.push(Number(element.RolePriority));
    }

    this.minimumRolesIndex = Math.min(...roleIndexs);

    this.DashBoardRights = this.getDashboardAcessRight(this.minimumRolesIndex);
    this.DsTradeCount.AwaitingResponse = 0;
    this.DsTradeCount.NewRFQCounter = 0;
    const promises = [];
    
    const Tradefast = this.dashBoardService.getTradeDashoboard('Tradefast', this.userId).then((res: any) => {
      if (res !== undefined) {
        res['result'].forEach(element => {
          switch (element.keyname) {
            case 'AwaitingResponse':
            case 'SentApproval':
              this.DsTradeCount.AwaitingResponse += element.keyvalue;
              break;
            case 'ExpireInTwoDays':
              this.DsTradeCount.ExpireInTwoDays = element.keyvalue;
              break;
            case 'LastMonthIssue':
              this.DsTradeCount.LastMonthIssue = element.keyvalue;
              break;
            case 'LastMonthReceive':
              this.DsTradeCount.LastMonthReceive = element.keyvalue;
              break;
            case 'NewRFQCounter':
            case 'Pending':
              this.DsTradeCount.NewRFQCounter += element.keyvalue;
              break;
            case 'YearIssue':
              this.DsTradeCount.YearIssue = element.keyvalue;
              break;
            case 'YearReceive':
              this.DsTradeCount.YearReceive = element.keyvalue;
              break;
            case 'Accepted':
              this.DsTradeCount.Accepted = element.keyvalue;
              break;
            case 'MyTrades':
              this.DsTradeCount.MyTrades = element.keyvalue;
              break;
            case 'TeamTrades':
              this.DsTradeCount.TeamTrades = element.keyvalue;
              break;
          }
        });

      }
    }).catch(err => {
    });
    promises.push(Tradefast);
    // Trader Role
    if (this.DashBoardRights.IsDealType) {

    } else {
      const DealCount = this.dashBoardService.getDealTapDashoboard('DealFast', this.userId, '').then((res: any) => {
        if (res !== undefined) {
          this.dealFastContactData = res.result;
        }
      }).catch(err => { });
      promises.push(DealCount);
      // const dealover = this.getDealOverview();
      // promises.push(dealover);
    }
    const TapdashboardCount = this.getTapFASTData();
    promises.push(TapdashboardCount);

    // const dashboardCount = this.getDashboardCount();
    // promises.push(dashboardCount);
    Promise.all(promises)
      .then(() => {
        this.apiService.isSpinner = true;
        this.spinner.displaySpinner(false);
        this.isApiCalled = true;
      }, (err) => {
        this.apiService.isSpinner = true;
        this.spinner.displaySpinner(false);
        this.isApiCalled = true;
      });
  }

  getTapFASTData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashBoardService.getTapDashoboard('TAP', this.userId).then((res: any) => {
        this.TapData = res.result;
        return resolve(res);
      }).catch(err => {
        console.error(err);
        return reject(err);
      });
    });
  }


  getDashboardCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.myTaskService.getnewWorkflows('?isDashboardCount=' + 1)
        .then((countRes: any) => {
          this.globalCounts = countRes;
          this.my = countRes.my;
          this.Counterparty = countRes.withCounterparty;
          this.signed = countRes.signed;
          return resolve(countRes);
        }).catch((err) => {
          return reject(err);
        });
    });
  }



  getValues(arrayObj, key, value) {
    if (!arrayObj) {
      return;
    }
    return lodash.filter(arrayObj, (obj) => {
      return obj[key] === value;
    });
  }

  getValuesInbox(arrayObj, key, value) {
    if (!arrayObj) {
      return;
    }
    return lodash.filter(arrayObj, (obj) => {
      return obj.properties['trt_referenceId'] === value;
    });
  }

  public doughntchartHovered(e: any): void {
  }

  getDashboardAcessRight(minimumRolesIndex): DashboardAccess {
    const dashboardAccess = new DashboardAccess();
    switch (minimumRolesIndex) {
      case 1: // SUPER_ADMIN
      case 2: // CUSTOMER_SUPER_ADMIN
      case 3: // ROAMING
        dashboardAccess.setProperty(true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true);
        break;
      case 4: // LEGAL
      case 5: // SIGNATORY
      case 7: // OPS
        dashboardAccess.setProperty(null, null, null, true, null, null, null, null, null, null, null, null, null, null, false, false, true, false, false, false, false);
        break;
      case 6: // FINANCE
        dashboardAccess.setProperty(null, null, null, true, null, null, null, null, null, null, null, null, null, null, false, false, true, true, false, false, false);
        break;
      case 8: // TRADER
      case 9: //  NON_TRITEX_COUNTERPARTY
        dashboardAccess.setProperty(true, true, true, true, null, true, null, null, null, null, null, null, null, true, true, false, false, true, false, true, true);
        break;

      default:
        break;
    }
    return dashboardAccess;
  }


  redirectToPage(ID) {
    let label = '';
    switch (ID) {
      case 1:
        label = 'My Actions';
        this.browserStorageService.setSessionStorageItem('tapkeycodeArray', JSON.stringify([2, 5, 8, 9, 10]));
        break;
      case 2:
        label = 'Confirmed';
        this.browserStorageService.setSessionStorageItem('tapkeycodeArray', JSON.stringify([4, 11]));
        break;
    }
    this.userService.saveUserActivityLog(Constants.DASHBOARD.NAME,
      Constants.DASHBOARD.SUBMODULE.TAP, label + ' ' + Constants.USER_ACTIVITIES.Dashboard.Visit,
      Constants.NO_COMMENTS, Constants.NO_COMMENTS);

    this.route.navigate(['/tap-instruction/tap-dashboard/' + new Date().getTime()]);
  }

  // redirectToDetails(RegionName) {
  //  // RegionName = 'FR';
  //   const PostJson: any = JSON.parse('{"Period":[{"ID":1,"Value":"Forcasted"}],"Direction":[{"ID":1,"Value":"Inbound"}],"DealType":[{ "ID": 4, "Value": "IOT Discount"} ],"Deal":[{"ID":1,"Value":"Completed deals"},{"ID":2,"Value":"Negotiations in progress"}],"InboundOutBound":[],"Net":[]}');
  //   // const Region = this.analyseFastService.countryData.find(x => x.alpha2.toLocaleUpperCase() === RegionName.toLocaleUpperCase());
    
  //   // PostJson.RegionName = [{ 'ID': Region.id, 'Value': Region.name }];
  //   // PostJson.PageName = 'dashboard';
  //   // this.browserStorageService.setSessionStorageItem('Analysisscreen1', JSON.stringify(PostJson));
  //   // this.route.navigate(['operator/graph-detail']);
  // }
  click() {
    this.mySelect.open();
  }
  changeExpireIn(event) {
    this.ExpireIn = event.value;
  }
  get changeExpireInValue() {
    return this.ExpireType.find(x => x.ID == this.ExpireIn);
  }

  get ExpireInValue() {
    let expireCount = 0;
    if (this.globalCounts && this.ExpireIn) {
      switch (this.ExpireIn) {
        case 1:
          expireCount = this.globalCounts.exp3m;
          break;
        case 2:
          expireCount = this.globalCounts.exp1m;
          break;
        case 3:
          expireCount = this.globalCounts.exp2w;
          break;
        case 4:
          expireCount = this.globalCounts.exp1d;
          break;
        default:
          expireCount = 0;
          break;
      }

    }

    return expireCount;
  }


  openModal(template: TemplateRef<any>, type: any) {
    if (type === 'DealOverviewDeails') {
     // this.showModalPopup(template, 'modal-xl');
   return this.openDialogWithTemplateRef(template);
    }
  }
  openLocalModal(event) {
    if (event === 'DealOverviewDeails') {
    this.modalRef= this.openModal(this.DealOverviewDeails, event);
     }
  }

  openDialogWithTemplateRef(template: TemplateRef<any>) {
  return  this.dialog.open(template,{panelClass: 'popup-dialog',hasBackdrop:true, disableClose: true});
  }

  // private showModalPopup(template: TemplateRef<any>, className?: string) {
  //   this.modalRef = this.utility.openComponentModal(template, { class: className ? className : 'modal-lg', backdrop: 'static' });
  // }


  getDealOverview(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashBoardService.getDealOverview('Activity', this.userId, 0).then((res: any) => {
        this.dealOverData = res.result;
        this.resp = res;
        return resolve(res);
      });
    });
  }
}


class DashboardAccess {
  IsInbox: boolean;
  IsOutbox: boolean;
  IsExpireInTwoDays: boolean;
  IsMe: boolean;
  IsInternal: boolean;
  IsCounterParty: boolean;
  IsComplete: boolean;
  IsThreeMonths: boolean;
  IsOneMonths: boolean;
  IsTwoWeeks: boolean;
  IsTwentyFourHours: boolean;
  IsNoTAPInstruction: boolean;
  IsTAPInstruction: boolean;
  IsTradeAccepted: boolean;
  IsDealType: boolean;
  IsAnalyseFast: boolean;
  IsSigned: boolean;
  IsTapFast: boolean;
  IsDealOverView: boolean;
  IsMyAction: boolean;
  IsConfirmed: boolean;
  constructor() {
    this.IsInbox = false;
    this.IsOutbox = false;
    this.IsExpireInTwoDays = false;
    this.IsMe = false;
    this.IsInternal = false;
    this.IsCounterParty = false;
    this.IsComplete = false;
    this.IsThreeMonths = false;
    this.IsOneMonths = false;
    this.IsTwoWeeks = false;
    this.IsTwentyFourHours = false;
    this.IsNoTAPInstruction = false;
    this.IsTAPInstruction = false;
    this.IsTradeAccepted = false;
    this.IsDealType = false;
    this.IsAnalyseFast = false;
    this.IsSigned = false;
    this.IsTapFast = false;
    this.IsDealOverView = false;
    this.IsMyAction = false;
    this.IsConfirmed = false;
  }
  setProperty(IsInbox = false, IsOutbox = false, IsExpireInTwoDays = false, IsMe = false, IsInternal = false, IsCounterParty = false,
    IsComplete = false, IsThreeMonths = false, IsOneMonths = false, IsTwoWeeks = false, IsTwentyFourHours = false,
    IsNoTAPInstruction = false, IsTAPInstruction = false, IsTradeAccepted = false, IsDealType = false, IsAnalyseFast = false, IsSigned = false, IsTapFast = false, IsDealOverView = false, IsMyAction = false, IsConfirmed = false) {
    this.IsInbox = IsInbox;
    this.IsOutbox = IsOutbox;
    this.IsExpireInTwoDays = IsExpireInTwoDays;
    this.IsMe = IsMe;
    this.IsInternal = IsInternal;
    this.IsCounterParty = IsCounterParty;
    this.IsComplete = IsComplete;
    this.IsThreeMonths = IsThreeMonths;
    this.IsOneMonths = IsOneMonths;
    this.IsTwoWeeks = IsTwoWeeks;
    this.IsTwentyFourHours = IsTwentyFourHours;
    this.IsNoTAPInstruction = IsNoTAPInstruction;
    this.IsTAPInstruction = IsTAPInstruction;
    this.IsTradeAccepted = IsTradeAccepted;
    this.IsDealType = IsDealType;
    this.IsAnalyseFast = IsAnalyseFast;
    this.IsSigned = IsSigned;
    this.IsTapFast = IsTapFast;
    this.IsDealOverView = IsDealOverView;
    this.IsMyAction = IsMyAction;
    this.IsConfirmed = IsConfirmed;
  }
  setAll(flag) {
    this.IsInbox = flag;
    this.IsOutbox = flag;
    this.IsExpireInTwoDays = flag;
    this.IsMe = flag;
    this.IsInternal = flag;
    this.IsCounterParty = flag;
    this.IsComplete = flag;
    this.IsThreeMonths = flag;
    this.IsOneMonths = flag;
    this.IsTwoWeeks = flag;
    this.IsTwentyFourHours = flag;
    this.IsNoTAPInstruction = flag;
    this.IsTAPInstruction = flag;
    this.IsTradeAccepted = flag;
    this.IsDealType = flag;
    this.IsAnalyseFast = flag;
    this.IsSigned = flag;
    this.IsTapFast = flag;
    this.IsDealOverView = flag;
    this.IsMyAction = flag;
    this.IsConfirmed = flag;
  }

}
