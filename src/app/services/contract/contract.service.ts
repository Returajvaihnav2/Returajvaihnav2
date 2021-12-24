import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthenticationService } from '@alfresco/adf-core';
import { AlfrescoMiddlewareApiService } from '../alfresco-middleware-api.service';
import { CommonService } from '../common.service';
import { LoggerService } from '../log4ts/logger.service';
import { UserService } from '../user/user.service';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import * as lodash from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ContractService {
  public isOpenNewWindow = false;
  constructor(
    private browserStorageService: BrowserStorageService,
    private apiService: ApiService,
    private alfrescoMiddleware: AlfrescoMiddlewareApiService,
    private commonService: CommonService,
    private loggerService: LoggerService,
    public authService: AuthenticationService,
    public userService: UserService
  ) { }

  public tabCountryListBid: any = [];
  public tabCodeListBid: any = [];
  public tabCountryListOffer: any = [];
  public tabCodeListOffer: any = [];
  public tabAppliesToListbid: any = [];
  public tabRoamingOnListbid: any = [];
  public tabAppliesToListoffer: any = [];
  public tabRoamingOnListoffer: any = [];
  public userId: string;
  public contractData: any = {};
  public contractTypeList: any[] = [];
  public contractDirectionList: any[] = [];
  public discountTypeList: any[];
  public discountTypeListTemp: any[];
  public signingProcessList: any[] = [];
  public exclusionsList: any[] = [];
  public terminationPeriodList: any[] = [];
  public discountPeriodList: any[] = [];
  public discountPeriodListMain: any[] = [];
  public taxTreatmentList: any[] = [];
  public settlementTypeList: any[] = [];
  public baisCalculationList: any[] = [];
  public regionList: any[] = [];
  public regionCustomList: any[] = [];
  public b_regionCustomList: any[] = [];
  public o_regionCustomList: any[] = [];
  public currencyList: any[] = [];
  public countryList: any[] = [];
  public b_countryList: any[] = [];
  public o_countryList: any[] = [];
  //public countryDefaultList: any[] = [];
  public bycountryList: any[] = [];
  public serviceList: any[] = [];
  public serviceListAYC: any[] = [];
  public serviceListMToM: any[] = [];
  public tapServiceList: any[] = [];
  public terminatedInList: any[] = [];
  public chargingIntervalSmsList: any[] = [];
  public chargingIntervalDataList: any[] = [];
  public chargingIntervalVoiceList: any[] = [];
  public chargingIntervalM2MList: any[] = [];
  public perSmsList: any[] = [];
  public perDataList: any[] = [];
  public perVoiceList: any[] = [];
  public thresholdTypeList: any[] = [];
  public counterpartyByList: any[] = [];
  public defaultDiscoutType: any[] = [];
  public TerminatedInRegionList: any[] = [];
  public TempRegionCountryList: any[] = [];
  public RegionListM2M: any[] = [];
  public isCopyDealTrade: boolean;
  public AnaliseFastModel: any;
  private excludeitem = [6, 7, 8, 9, 10];

  getTradingEntityByUserId(userId, isTritexAdmin?: number, isAdmin?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/GetTritexOperatorsbyUserId?' + 'isTritexAdmin=' + isTritexAdmin + '&isAdmin=' + isAdmin +
          '&userId=' + userId)
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
  deleteDraft(nodeRef) {
    const body = {
      'nodeRef': nodeRef
    };
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.postWebscript('tritex/delete-draft', body)
        .then((res: any) => {
          return resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  }

  removeContract(contractId) {
    const body = {
      'ContractID': contractId
    };
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader('Contract/RemoveContract', body)
        .subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getContractTemplateByTradingEntity(Flag, TradingEntityID, CounterPartyID?, TemplateID?, isSender = 1, isExtra = 0, DealTypeID = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(
          'Common/GetContractTemplates?Flag=' + Flag +
          '&TemplateID=' + TemplateID + '&TradingEntityID=' + TradingEntityID +
          '&CounterPartyID=' + CounterPartyID + '&isSender=' + isSender + '&isExtra=' + isExtra + '&DealTypeID=' + DealTypeID
        )
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

  getTradingEntity(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware
        .getWebScript('tritex/trading-entity')
        .then((res: any) => {
          return resolve(res);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getOperatorByCountry(countryid: number, UserId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Trade/GetOperatorByCountry?CountryID=' + countryid + '&UserId=' + UserId)
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

  // login api call
  searchContract(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('user/GroupProfile').subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  saveContract(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('Contract/SaveContract', data)
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

  validateContractDocument(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('Contract/ValidateDocument', data)
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

  removeHilightedText(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/ProcessDocument?' + params)
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

  GetContractDetail(ContractID: any, MetaDataFlag = 'Active', MetaDataVersion = 0,
    UserID: any): Promise<any> {
    MetaDataVersion = (MetaDataVersion !== null) ? MetaDataVersion : 0;
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/GetContractByID?ContractID=' + ContractID + '&Flag=' + MetaDataFlag + '&VersionNo=' + MetaDataVersion +
          '&UserID=' + UserID)
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


  downloadPDF(referenceNo: string, fileId: string, ext): Promise<any> {
    return new Promise((resolve, reject) => {

      this.apiService
        .getFile('Contract/GetContractPDF?referenceNo=' + referenceNo + '&fileId=' + fileId
          + '&alfToken=' + this.authService.getTicketEcm() + '&extension=' + ext)
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

  getDiscTypeFlatRate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Common/GetDiscTypeFlat?UserId=' + this.userId)
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

  getDiscTypeBalancedUnbalanced(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(
          'Common/GetDiscTypeBalancedUnbalanced?UserId=' + this.userId
        )
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

  getDiscTypeBandedTiered(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Common/GetDiscTypeBandedTiered?UserId=' + this.userId)
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

  // M2M
  getDiscTypeFlatRateM2M(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Common/GetDiscTypeM2MFlat?UserId=' + userId)
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

  getDiscTypeBandedTieredM2M(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Common/GetDiscTypeM2MBandedTiered?UserId=' + userId)
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
  // TODO :
  getDiscountTypeDefaultData(discountTypeID?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(
          'Contract/GetDiscountTypeDefaultData?DiscountTypeID=' +
          discountTypeID
        )
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

  getDraft() {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.getWebScript('tritex/draft')
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  getTapTasks() {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.getWebScript('/tritex/tap-workflow-task')
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  getSingleDraftDetails(nodeId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.getWebScript('tritex/draft?isDetails=true&nodeId=' + nodeId)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  cancelWF(wfId: any) {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.deleteWebScript('api/workflow-instances/' + wfId)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }

  startWorkflow(postBody) {
    return new Promise((resolve, reject) => {
      this.alfrescoMiddleware.postWebscript('tritex/start-workflow', postBody)
        .then(function (data) {
          return resolve(data);
        }).catch(err => {
          return reject(err);
        });
    });
  }
  getLists() {
    // COUNTRY LIST
    this.commonService
      .getCountries()
      .then(res => {
        this.bycountryList = res.result;
        this.countryList = res.result;
        this.b_countryList = lodash.cloneDeep(this.countryList);
        this.o_countryList = lodash.cloneDeep(this.countryList);
      })
      .catch(error => {
        this.loggerService.error(error);
      });
  }
  // COUNTRY LIST
  getCountryList() {
    this.commonService
      .getCountries()
      .then(res => {
        this.countryList = res.result.map(function (el) {
          return { CountryID: el.CountryID, CountryName: el.CountryName };
        });
        this.b_countryList = lodash.cloneDeep(this.countryList);
        this.o_countryList = lodash.cloneDeep(this.countryList);
      })
      .catch(error => {
        this.loggerService.error(error);
      });
  }
  // CURRENCY LIST
  getCurrencyList() {
    this.commonService
      .getCurrencies()
      .then(res => {
        this.currencyList = res.result.map(x => {
          return {
            'ISO': x.ISO,
            'CurrencyID': x.CurrencyID,
            'My': true
          }
        });
      })
      .catch(error => {
        this.loggerService.error(error);
      });
  }
  public setdiscouttypelist(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDiscountTypeDefaultData().then((res) => {
        this.defaultDiscoutType = res['result'];
        return resolve(res);
      });
    });
  }
  public getdiscouttypelist(): any {
    return this.defaultDiscoutType;
  }

  getTerminationTypeIDRecord(Name: string, isTE?) {
    let FinaleName = Name;
    let TCID = null;
    let SelectedTermination;
    if (Name && Name !== '') {
      const namearr = Name.split('~');
      if (namearr.length > 1) {
        FinaleName = namearr[1];
        TCID = namearr[0];
        SelectedTermination = this.TerminatedInRegionList.filter(x => x.DisplayName === FinaleName && (x.TCID === TCID || x.PTCID === TCID));
      } else {
        SelectedTermination = this.TerminatedInRegionList.filter(x => x.DisplayName === FinaleName);
      }
    }

    if (SelectedTermination && SelectedTermination.length) {
      return SelectedTermination[0];
    } else {
      return [{ 'EnumID': null, 'DisplayName': '', 'TerminatedTypeID': 1, 'isTE': null }][0];
    }
  }

  setTCIDinTerminatedRegionList(TradinPTCID, TradingTCID, CPPTCID, CPTCID) {
    this.TerminatedInRegionList.map(function (a) {
      a.TCID = a.isTE === 1 ? TradingTCID :
        ((a.isTE === 0) ? CPTCID : null);
      a.PTCID = a.isTE === 1 ? TradinPTCID :
        ((a.isTE === 0) ? CPPTCID : null);
    });
  }

  // ENUMS LIST
  getEnumList(discountSubType?: string): Promise<any> {
    let enumList: Promise<any>;
    enumList = this.getEnum(
      'ContractTypes,ContractDirections,DiscountType,SigningProcess,Exclusions,' +
      'TerminationPeriod,DiscountPeriod,TaxTreatment,SettlementType,Service,TerminatedIn,' +
      'ChargingInterval,Per,ThresholdType,CounterPartyBy,BaisCalculation'
    );
    return enumList.then(res => {
      this.contractTypeList = res.filter(
        (x: any) => x.EnumType === 'ContractTypes'
      );
      this.counterpartyByList = res.filter(
        (x: any) => x.EnumType === 'CounterPartyBy'
      );
      this.contractDirectionList = res.filter(
        (x: any) => x.EnumType === 'ContractDirections'
      );
      this.discountTypeList = res.filter(
        (x: any) => x.EnumType === 'DiscountType' && x.SubType === discountSubType && !(this.excludeitem.includes(x.EnumID))
      ).map(function (el) {
        return { DiscountTypeID: el.EnumID, DiscountTypeName: el.DisplayName, isDisabled: false };
      });

      this.discountTypeListTemp = res.filter(
        (x: any) => x.EnumType === 'DiscountType' && x.SubType === discountSubType
      ).map(function (el) {
        return { DiscountTypeID: el.EnumID, DiscountTypeName: el.DisplayName, isDisabled: false };
      });

      this.signingProcessList = res.filter(
        (x: any) => x.EnumType === 'SigningProcess'
      );
      this.exclusionsList = res.filter((x: any) => x.EnumType === 'Exclusions').map(function (el) {
        return { ExclusionID: el.EnumID, ExclusionName: el.DisplayName };
      });
      this.terminationPeriodList = res.filter(
        (x: any) => x.EnumType === 'TerminationPeriod'
      );
      this.discountPeriodList = res
        .filter((x: any) => x.EnumType === 'DiscountPeriod')
        .filter((x: any) => x.EnumID !== 3);
      this.discountPeriodListMain = res.filter(
        (x: any) => x.EnumType === 'DiscountPeriod'
      );
      this.taxTreatmentList = res.filter(
        (x: any) => x.EnumType === 'TaxTreatment'
      );
      this.settlementTypeList = res.filter(
        (x: any) => x.EnumType === 'SettlementType'
      );
      this.baisCalculationList = res.filter(
        (x: any) => x.EnumType === 'BaisCalculation'
      );
      this.serviceList = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'Normal'
      );
      this.serviceListAYC = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'M2M'
      );
      this.serviceListMToM = this.serviceListAYC.filter(
        (x: any) => x.EnumID === 9 || x.EnumID === 10
      );
      this.terminatedInList = res.filter(
        (x: any) => x.EnumType === 'TerminatedIn'
      );
      this.chargingIntervalSmsList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'SMS'
      );
      this.chargingIntervalDataList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Data'
      );
      this.chargingIntervalVoiceList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Voice'
      );
      this.chargingIntervalM2MList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'M2M'
      );
      this.perSmsList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'SMS'
      );
      this.perDataList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Data'
      );
      this.perVoiceList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Voice'
      );
      this.thresholdTypeList = res.filter(
        (x: any) => x.EnumType === 'ThresholdType'
      );

    });
  }


  // BCE ENUMS LIST
  getBCEEnumList(discountSubType?: string): Promise<any> {
    let enumList: Promise<any>;
    enumList = this.getEnum(
      'ContractTypes,ContractDirections,DiscountType,SigningProcess,Exclusions,' +
      'TerminationPeriod,DiscountPeriod,TaxTreatment,SettlementType,Service,TerminatedIn,' +
      'ChargingInterval,Per,ThresholdType,CounterPartyBy,BaisCalculation'
    );
    return enumList.then(res => {
      this.contractTypeList = res.filter(
        (x: any) => x.EnumType === 'ContractTypes'
      );
      this.counterpartyByList = res.filter(
        (x: any) => x.EnumType === 'CounterPartyBy'
      );
      this.contractDirectionList = res.filter(
        (x: any) => x.EnumType === 'ContractDirections'
      );
      this.discountTypeList = res.filter(
        (x: any) => x.EnumType === 'DiscountType' && x.SubType === discountSubType && !(this.excludeitem.includes(x.EnumID))
      ).map(function (el) {
        return { DiscountTypeID: el.EnumID, DiscountTypeName: el.DisplayName, isDisabled: false };
      });

      this.discountTypeList.push({
        DiscountTypeID: 99,
        DiscountTypeName: 'Network Access Fee'
      });

      this.signingProcessList = res.filter(
        (x: any) => x.EnumType === 'SigningProcess'
      );
      this.exclusionsList = res.filter((x: any) => x.EnumType === 'Exclusions').map(function (el) {
        return { ExclusionID: el.EnumID, ExclusionName: el.DisplayName };
      });
      this.terminationPeriodList = res.filter(
        (x: any) => x.EnumType === 'TerminationPeriod'
      );
      this.discountPeriodList = res
        .filter((x: any) => x.EnumType === 'DiscountPeriod')
        .filter((x: any) => x.EnumID !== 3);
      this.discountPeriodListMain = res.filter(
        (x: any) => x.EnumType === 'DiscountPeriod'
      );
      this.taxTreatmentList = res.filter(
        (x: any) => x.EnumType === 'TaxTreatment'
      );
      this.settlementTypeList = res.filter(
        (x: any) => x.EnumType === 'SettlementType'
      );
      this.baisCalculationList = res.filter(
        (x: any) => x.EnumType === 'BaisCalculation'
      );
      this.serviceList = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'Normal'
      );
      this.serviceListAYC = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'M2M'
      );
      this.serviceListMToM = this.serviceListAYC.filter(
        (x: any) => x.EnumID === 9 || x.EnumID === 10
      );
      this.terminatedInList = res.filter(
        (x: any) => x.EnumType === 'TerminatedIn'
      );
      this.chargingIntervalSmsList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'SMS'
      );
      this.chargingIntervalDataList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Data'
      );
      this.chargingIntervalVoiceList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Voice'
      );
      this.chargingIntervalM2MList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'M2M'
      );
      this.perSmsList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'SMS'
      );
      this.perDataList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Data'
      );
      this.perVoiceList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Voice'
      );
      this.thresholdTypeList = res.filter(
        (x: any) => x.EnumType === 'ThresholdType'
      );

    });
  }
  getEnumPerList(): Promise<any> {
    let enumList: Promise<any>;
    enumList = this.getEnum('ChargingInterval,Per,TaxTreatment,Service,TapService,Exclusions');
    return enumList.then(res => {
      this.serviceList = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'Normal'
      );
      this.serviceListAYC = res.filter(
        (x: any) => x.EnumType === 'Service' && x.SubType === 'M2M'
      );
      this.serviceListMToM = this.serviceListAYC.filter(
        (x: any) => x.EnumID === 9 || x.EnumID === 10
      );
      this.exclusionsList = res.filter((x: any) => x.EnumType === 'Exclusions').map(function (el) {
        return { ExclusionID: el.EnumID, ExclusionName: el.DisplayName };
      });
      this.tapServiceList = res.filter(
        (x: any) => x.EnumType === 'TapService'
      );
      this.taxTreatmentList = res.filter(
        (x: any) => x.EnumType === 'TaxTreatment'
      );
      this.chargingIntervalSmsList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'SMS'
      );
      this.chargingIntervalDataList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Data'
      );
      this.chargingIntervalVoiceList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'Voice'
      );
      this.chargingIntervalM2MList = res.filter(
        (x: any) => x.EnumType === 'ChargingInterval' && x.SubType === 'M2M'
      );
      this.perSmsList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'SMS'
      );
      this.perDataList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Data'
      );
      this.perVoiceList = res.filter(
        (x: any) => x.EnumType === 'Per' && x.SubType === 'Voice'
      );
    });
  }

  getEnum(enumType: string) {
    return new Promise((resolveEnum, reject) => {
      this.commonService
        .getEnum(enumType)
        .then((res: any) => {
          return resolveEnum(res.result);
        })
        .catch(error => {
          this.loggerService.error(error);
          return reject(error);
        });
    });
  }
  // need to user in pricing grid
  getRegionList(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonService.getRegions(userId, 'Region').then(element => {
        this.regionList = element.result;
        this.regionCustomList = element.result.filter(x => x.IsDefault === false).map(function (el) {
          return { RegionID: el.RegionID, RegionName: el.RegionName };
        });
        this.b_regionCustomList = lodash.cloneDeep(this.regionCustomList);
        this.o_regionCustomList = lodash.cloneDeep(this.regionCustomList);
        return resolve(true);
      }).catch(error => {
        this.loggerService.error(error);
      });
    });
  }


  saveTrade(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('Trade/SaveTrade', data)
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
  GetTradeDetail(TradeID: string, ID: Number, UserID: string, Flag?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Trade/GetTradeByID?TradeID=' + TradeID + '&ID=' + ID + '&UserID=' + UserID + '&Flag=' + Flag)
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

  CheckCounterPartyContact(cpList: any[]): Promise<any> {
    const _temp = { 'CounterPartyContact': cpList };
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('Trade/CounterPartyContactCheck', _temp)
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
  getPerList(service) {
    let _temp = [];
    switch (service) {
      case 1:
      case 2:
      case 6:
      case 8: {
        _temp = this.perVoiceList;
        break;
      }
      case 3:
      case 7:
      case 9: {
        _temp = this.perSmsList;
        break;
      }
      case 4:
      case 10: {
        _temp = this.perDataList;
        break;
      }
      case 5:
      case 11: {
        _temp = this.perVoiceList.concat(this.perDataList);
        break;
      }
      default: {
        _temp = [];
        break;
      }
    }
    return _temp;
  }

  getDefaultValPerList(service) {
    const _temp = this.getPerList(service);
    if (_temp.length > 0) {
      return _temp[0].EnumID;
    } else {
      return 0;
    }
  }


  getChargingIntervalList(service, perunitid) {
    let _temp = [];
    switch (service) {
      case 1:
      case 2:
      case 6:
      case 8: {
        _temp = this.chargingIntervalVoiceList;
        break;
      }
      case 3:
      case 7:
      case 9: {
        _temp = this.chargingIntervalSmsList;
        break;
      }
      case 4:
      case 10: {
        _temp = this.chargingIntervalDataList;
        break;
      }
      case 5:
      case 11: {
        switch (perunitid) {
          case 6:
          case 7:
          case 8:
          case 9: {
            _temp = this.chargingIntervalDataList;
            break;
          }
          case 10: {
            _temp = this.chargingIntervalVoiceList;
            break;
          }
          default: {
            _temp = [];
            break;
          }
        }
        break;
      }
      default: {
        _temp = [];
        break;
      }
    }
    return _temp;
  }

  getDefaultValChargingIntervalList(service, perunitid) {
    const _temp = this.getChargingIntervalList(service, perunitid);
    if (_temp.length > 0) {
      return _temp[0].EnumID;
    } else {
      return 0;
    }
  }

  saveContractStatus(contractId: String, isCompleted: number, isCountered?: boolean): Promise<any> {
    const data = {
      ContractID: contractId,
      isStarted: 1,
      isCompleted: isCompleted,
      isCountered: isCountered ? 1 : 0
    };

    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('Contract/AlfContractStatus', data)
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

  mapOperatorOriginated(Oldtrademodel) {
    if (Oldtrademodel) {
      Oldtrademodel.forEach(eleflatrate => {
        eleflatrate.forEach(eleflatrateinner => {
          if (eleflatrateinner.OperatorAffiliate.length > 0 && eleflatrateinner.OperatorAffiliate[0].TADIGID != null) {
            eleflatrateinner.OperatorAffiliate = (eleflatrateinner.OperatorAffiliate as any[]).map(x => x.TADIGID);
          }
          if (eleflatrateinner.OriginatedIn.length > 0 && eleflatrateinner.OriginatedIn[0].CountryID != null) {
            eleflatrateinner.OriginatedIn = (eleflatrateinner.OriginatedIn as any[]).map(x => x.CountryID);
          }
        });
      });
    }
  }

  mapPricingServices(Oldtrademodel) {
    if (Oldtrademodel) {
      Oldtrademodel.forEach(eleaycService => {
        eleaycService.forEach(eleaycServiceinner => {
          if (eleaycServiceinner.Services.length > 0 && eleaycServiceinner.Services[0].ServiceID != null) {
            eleaycServiceinner.Services = (eleaycServiceinner.Services as any[]).map(x => x.ServiceID);
          }
        });
      });
    }
  }
  mapPricingServicesM2M(Oldtrademodel) {
    if (Oldtrademodel) {
      Oldtrademodel.forEach(eleaycService => {
        if (eleaycService.Services.length > 0 && eleaycService.Services[0].ServiceID != null) {
          eleaycService.Services = (eleaycService.Services as any[]).map(x => x.ServiceID);
        }
      });
    }
  }

  GetTradeHistory(TradeID: string, ID: Number, isBid: Number, isSender: Number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Trade/GetTradeHistory?TradeID=' + TradeID + '&ID=' + (ID ? ID : 0) + '&isBid=' + isBid + '&isSender=' + isSender)
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

  GetContractTradeDetail(ContractID: string, Flag: string): Promise<any> {
    const UserId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/GetContractTradeDetail?ContractID=' + ContractID + '&Flag=' + Flag + '&UserID=' + UserId)
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

  GetContractHistory(ContractID: string, ID: Number, isBid: Number, isSender: Number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/GetContractHistory?ContractID=' + ContractID + '&ID=' + ID + '&isBid=' + isBid + '&isSender=' + isSender)
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

  setDefaultCurrencyinPricing(PricingData: any, DefaultCurrencyID) {
    if (PricingData && PricingData.controls) {
      PricingData.controls.forEach(element => {
        if (element.get('CurrencyID')) {
          element.get('CurrencyID').setValue(DefaultCurrencyID);
        } else {
          return;
        }
      });
    }
  }

  getDefaultCurrency(PartyList, selectedOperatorvalue) {
    const selectedcpdata = PartyList.filter(x => x.OperatorIds === selectedOperatorvalue);
    if (selectedcpdata.length > 0) {
      return selectedcpdata[0].CurrencyID;
    } else {
      return 0;
    }
  }
  GetRegionCountrybyRegion(RegionData, RegionCountryRecords) {
    if (RegionData.EnumID && RegionData.EnumID !== 0) {
      this.commonService.getCountriesByRegion(RegionData.EnumID).then((res) => {
        const Countries = res['result'].countryByRegionModelList;
        RegionCountryRecords.setValue(Countries ? Countries.map(function (el) {
          return { CountryID: el.CountryID, CountryName: el.CountryName, isRemove: 0, isExclude: 0 };
        }) : []);
      });
    } else {
      const Countries = this.TempRegionCountryList.filter(x => x.RegionName === RegionData.DisplayName);
      if (Countries && Countries.length > 0) {
        RegionCountryRecords.setValue(Countries[0].CountryList ? Countries[0].CountryList : []);
      }
    }
  }

  getthresholdTypeList(isNotFilter = true, EnumID = 3) {
    if (isNotFilter) {
      return this.thresholdTypeList;
    } else {
      return this.thresholdTypeList.filter(x => x.EnumID !== EnumID);
    }

  }

  saveSplitData(data: any, TradeCPID = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader((TradeCPID ? 'Trade' : 'Contract') + '/SaveSplit', data)
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


  getNonTritexUserByCounterParty(TradingEntity: string, CounterPartyList?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('Contract/GetNonCounterPartyContact?Flag=NonTritex&ContractID=' + TradingEntity +
          '&CounterPartyID=' + CounterPartyList)
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

  getNonTritexCP(Flag: string, ContractID: string, CounterPartyID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader(`Contract/GetNonCounterPartyContact?Flag=${Flag}&ContractID=${ContractID}&CounterPartyID=${CounterPartyID}`)
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

  SaveNonCounterPartyContact(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postWithHeader(`Contract/SaveNonCounterPartyContact`, data)
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
  orderbyRegionValue(discountFormGroup, isBid) {
    if (this.regionCustomList && this.regionCustomList.length > 0) {
      const curruntlist = discountFormGroup.get('ExclusionsCountryRegion').get('Regions').value;
      var selectedItem = this.regionCustomList.filter(x => curruntlist.map(t => t.RegionID).includes(x.RegionID));
      var selectedNoItem = this.regionCustomList.filter(x => !curruntlist.map(t => t.RegionID).includes(x.RegionID));
      if (isBid) {
        this.b_regionCustomList = [];
        this.b_regionCustomList = lodash.unionBy(selectedItem, selectedNoItem, 'RegionName');
      } else {
        this.o_regionCustomList = [];
        this.o_regionCustomList = lodash.unionBy(selectedItem, selectedNoItem, 'RegionName');
      }
    }
  }

  orderbyCountryValue(discountFormGroup, isBid) {
    if (this.countryList && this.countryList.length > 0) {
      const curruntlist = discountFormGroup.get('ExclusionsCountryRegion').get('Countries').value;
      var selectedItem = this.countryList.filter(x => curruntlist.map(t => t.CountryID).includes(x.CountryID));
      var selectedNoItem = this.countryList.filter(x => !curruntlist.map(t => t.CountryID).includes(x.CountryID));
      if (isBid) {
        this.b_countryList = [];
        this.b_countryList = lodash.unionBy(selectedItem, selectedNoItem, 'CountryName');
      } else {
        this.o_countryList = [];
        this.o_countryList = lodash.unionBy(selectedItem, selectedNoItem, 'CountryName');
      }
    }
  }

}
