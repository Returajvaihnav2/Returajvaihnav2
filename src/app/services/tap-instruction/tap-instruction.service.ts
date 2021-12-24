import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthenticationService } from '@alfresco/adf-core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { LoggerService } from '../log4ts/logger.service';
import { UserService } from '../user/user.service';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class TapInstructionService {
  private profileChangeListener = new Subject<any>();

  public isOpenNewWindow = false;
  currencyList: any[] = [];
  userId: any;
  isTapValid = true;
  fxRateList: any[] = [];
  fxRateListBaseonDate: any[] = [];
  isAutoRenewalRoot: boolean;
  FXdate: any;
  constructor(
    private apiService: ApiService,
    public loggerService: LoggerService
    , public commonService: CommonService
    , public authService: AuthenticationService
    , public userService: UserService,
    private browserStorageService: BrowserStorageService
  ) {
    this.userId = this.browserStorageService.getLocalStorageItem('userId');
  }


  emitChangeProfile(change: any) {
    this.profileChangeListener.next(change);
  }
  listenChangeProfile() {
    return this.profileChangeListener.asObservable();
  }

  // FormGroup declaration
  bindFormGroup() {
    return new FormGroup({
      ID: new FormControl(),
      ContractID: new FormControl(),
      AlfTicket: new FormControl(),
      TAPReferenceNo: new FormControl(),
      ContractReferenceNo: new FormControl(),
      TradeCounterPartyID: new FormControl(),
      TradeID: new FormControl(),
      TradeReferenceNo: new FormControl(),
      UserName: new FormControl(),
      TypeID: new FormControl(),
      DirectionID: new FormControl(),
      TradingEntity: new FormControl(),
      TradingEntityID: new FormControl(),
      TradingEntityTCID: new FormControl(),
      CounterParty: new FormControl(),
      CounterPartyID: new FormControl(),
      TradingEntityIsGroup: new FormControl(),
      CounterPartyIsGroup: new FormControl(),
      CounterPartyTCID: new FormControl(),
      HomeDiscountTypeID: new FormControl(),
      VisitorDiscountTypeID: new FormControl(),
      HomeEntity: new FormArray([]),
      VisitorEntity: new FormArray([]),
      DefaultCurrency: new FormArray([]),
      StatusEnumID: new FormControl(),
      Mode: new FormControl(),
      CancelReson: new FormControl(),
      isSendToOpco: new FormControl(),
      isHome: new FormControl(),
      IsAutoRenewal: new FormControl(),
      isOwner: new FormControl(),
      isHomeChange: new FormControl(),
      isVisitorChange: new FormControl(),
      HomeLocalCountry: new FormArray([]),
      CreatedEmail: new FormControl(),
      CreatedDate: new FormControl(),
      CounterPartyUser: new FormControl(),
      XlsxString: new FormControl(),
      HomeDataClearingHosuseID: new FormControl(),
      VisitorDataClearingHosuseID: new FormControl(),
      HomeFinanceClearingHosuseID: new FormControl(),
      VisitorFinanceClearingHosuseID: new FormControl()
    });
  }

  bindEntity() {
    return new FormGroup({
      isHome: new FormControl(),
      TradeStartDate: new FormControl('', Validators.required),
      TradeEndDate: new FormControl('', Validators.required),
      EffectiveDate: new FormControl('', Validators.required),
      Exclusions: new FormControl(),
      ExclusionCountry: new FormControl(),
      OperatorCode: new FormControl(),
      OperatorID: new FormControl(),
      OperatorName: new FormControl(),
      OperatorCurrencyID: new FormControl('', Validators.required),
      OperatorCurrencyISO: new FormControl(''),
      OperatorFXRateDate: new FormControl(moment(new Date()).format('DD/MM/YYYY')),
      PreviousOperatorFXRateDate: new FormControl(),
      EntityDetails: new FormArray([]),
      PreviousCurrencyValue: new FormControl(),
      isOperatorChange: new FormControl(),
      IsAutoRenewal: new FormControl(),
      PreviousIsAutoRenewal: new FormControl(),
      DecimalPoints: new FormControl(),
      // , Country: new FormControl(),
      // CountryID: new FormControl(),
      // TAPCurrencyID: new FormControl('', Validators.required)
    });
  }

  bindEntityDetails(temp?) {
    return new FormGroup({
      PartyATAPCode: new FormControl(),
      TradingEntityTADIGID: new FormControl(),
      PartyBTAPCode: new FormControl(),
      CounterPartyTADIGID: new FormControl(),
      // StartDate: new FormControl(''), // Not in use
      // EndDate: new FormControl(''), // Not in use
      TaxTreatmentEnumID: new FormControl('', Validators.required),
      PreviousTaxTreatment: new FormControl(),
      TapService: this.bindperioddata(temp),

    });
  }

  bindperioddata(temp: any) {
    const arrlen = (temp as FormArray).length;
    const tapperiodlist = new FormArray([]);
    for (let i = 0; i < arrlen; i++) {
      tapperiodlist.push(
        new FormGroup({
          PeriodID: new FormControl(),
          StartDate: new FormControl(),
          EndDate: new FormControl(),
          PreviousStartDate: new FormControl(),
          PreviousEndDate: new FormControl(),
          isPeriodChange: new FormControl(),
          TapServicePeriodWise: this.getForm(temp[i].TapServicePeriodWise),
          isRemove: new FormControl(temp && temp.isRemove ? temp.isRemove : 0),
          isExclude: new FormControl(temp && temp.isExclude ? temp.isExclude : 0),
          CanDelete: new FormControl(0),
          PreviousisExclude: new FormControl(temp && temp.PreviousisExclude ? temp.PreviousisExclude : 0),
          isTempExclude: new FormControl(0),
        })
      );
    }

    return tapperiodlist;
  }

  getForm(tapService): FormArray {
    const resultarr = new FormArray([]);
    for (let i = 0; i < tapService.length; i++) {
      resultarr.push(this.bindPriceDetails(tapService[i].O_Rate));
    }
    return resultarr;
    // return new FormArray(
    //   [
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.MOCLocal).map(x => x.O_Rate)),
    //     // MOCLocal
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID === TapServiceConst.TapServiceEnums.MOCHome).map(x => x.O_Rate)),
    //     // MOCHome
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.MOCRoW).map(x => x.O_Rate)), // MOCRoW
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.MTC).map(x => x.O_Rate)), // MTC
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.SMSMO).map(x => x.O_Rate)), // SMSMO
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.SMSMT).map(x => x.O_Rate)), // SMSMT
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.Data).map(x => x.O_Rate)), // Data
    //     this.bindPriceDetails(tapService.filter(x => x.TapServiceEnumID ===
    //       TapServiceConst.TapServiceEnums.VoLTE).map(x => x.O_Rate)), // Volte
    //   ]
    // );
  }

  bindPriceDetails(temp?) {
    return new FormGroup({
      ServiceEnumID: new FormControl(),
      O_CurrencyID: new FormControl(),
      CurrencyISO: new FormControl(),
      O_Rate: new FormControl(),
      FXRate: new FormControl(),
      O_FXRate: new FormControl(),
      Rate: new FormControl('', temp > -1 ? Validators.required : []),
      IntervalEnumID: new FormControl(),
      PerEnumID: new FormControl(),
      TapServiceEnumID: new FormControl(),
      TapServiceName: new FormControl(),
      // PeriodID: new FormControl(),
      // StartDate: new FormControl(),
      // EndDate: new FormControl(),
      PreviousRate: new FormControl(),
      PreviousIntervalEnum: new FormControl(),
      PreviousPerEnum: new FormControl(),
      TerminatedTypeID: new FormControl(),
      TAPRegionCountry: new FormControl(),
    });
  }

  bindFXRate(temp: any): FormGroup {

    return new FormGroup({
      PeriodID: new FormControl(),
      StartDate: new FormControl(),
      EndDate: new FormControl(),
      TapFXRatePeriodWise: this.bindperiodFXdata(temp.TapFXRatePeriodWise)
    });
  }

  bindperiodFXdata(temp) {

    const arrlen = (temp as FormArray).length;
    const FXRatelist = new FormArray([]);
    for (let i = 0; i < arrlen; i++) {
      FXRatelist.push(new FormGroup({
        ServiceEnumID: new FormControl(temp[i].ServiceEnumID),
        RegionEnumID: new FormControl(temp.RegionEnumID),
        TerminatedInEnumID: new FormControl(temp.TerminatedInEnumID),
        O_CurrencyID: new FormControl(temp.O_CurrencyID),
        FXRate: new FormControl(temp.FXRate),
        O_FXRate: new FormControl(temp.O_FXRate),
        TapServiceEnumID: new FormControl(temp.TapServiceEnumID),
        PeriodID: new FormControl(temp.PeriodID),
        StartDate: new FormControl(temp.StartDate),
        EndDate: new FormControl(temp.EndDate)
      }));
    }
    return FXRatelist;

  }

  bindDefaultCurrency(temp?) {
    return new FormGroup({
      'ISO': new FormControl(temp.ISO),
      'ID': new FormControl(temp.ID),
      'CurrencyName': new FormControl(temp.CurrencyName),
    });
  }

  bindHomeLocalCountry(temp?) {
    return new FormGroup({
      'PartyATapCode': new FormControl(temp.PartyATapCode),
      'PartyACountryID': new FormControl(temp.PartyACountryID),
      'PartyACountryName': new FormControl(temp.PartyACountryName),
      'PartyAISO': new FormControl(temp.PartyAISO)
    });
  }

  createTAPInstruction(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postWithHeader('TapInstruction/SaveTapInstruction', data)
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

  editTAPInstruction(tapInstructionID: any, operatorID: any = '', Flag: any = '', TradeCounterPartyID = null): Promise<any> {
    this.userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/EditTapInstruction?Flag=' + Flag + '&OperatorID=' + operatorID + '&UserID='
          + this.userId + '&TAPInstructionID=' + tapInstructionID + '&TradeCounterPartyID=' + TradeCounterPartyID)
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

  getTAPInstruction(contractID: any, TradeID: any, TradeCounterPartyId: any): Promise<any> {
    const userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/CreateTapInstruction?ContractID=' + contractID + '&TradeID=' + TradeID +
          '&TradeCounterPartyId=' + TradeCounterPartyId + '&UserID=' + userId)
        .subscribe(
          (resp: any) => {
            return resolve(resp);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getTAPList(Flag: any): Promise<any> {
    this.userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/GetTAPList?Flag=' + Flag + '&UserID=' + this.userId)
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

  getTAPOpcoStatusList(ID: any): Promise<any> {
    this.userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/GetTAPOpcoStatusList?TAPInstructionID=' + ID + '&Flag=OpcoStatusList&UserID=' + this.userId)
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

  getTAPInboxList(userID: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/GetTAPOpcoInboxList?Flag=InboxList&UserID=' + userID)
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

  getCurrencyList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonService.getCurrencies().then(res => {
        this.currencyList = res.result;
        return resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }

  getCurrencyName(currencyID: any) {
    return this.currencyList.filter(x => x.CurrencyID === currencyID).map(
      function (el) {
        return el.ISO;
      }
    );
  }


  getLastTapInstructionID(contractID: any, TradeCounterPartyId = null): Promise<any> {
    const userId = this.browserStorageService.getLocalStorageItem('userId');
    return new Promise((resolve, reject) => {
      this.apiService
        .getWithHeader('TapInstruction/GetLastTapInstructionID?ContractID=' + contractID + '&Flag=LastTapID&UserID=' + userId + '&TradeCounterPartyId=' + TradeCounterPartyId)
        .subscribe(
          (resp: any) => {
            return resolve(resp);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  public callAPI(DefaultCurrencyList): Promise<any> {
    return new Promise((resolve1, reject) => {
      const _fxRateDefault = DefaultCurrencyList;
      if (_fxRateDefault && this.isTapValid) {
        const promises: Promise<any>[] = [];
        _fxRateDefault.forEach((ele) => {
          promises.push(this.CallApiInLoop(Number(ele.ID), String(ele.ISO)));
        });
        Promise.all(promises).then((res) => {
          return resolve1(res);
        });
      } else {
        return resolve1(false);
      }
    });
  }

  CallApiInLoop(baseCurrencyID, baseCurrency) {
    return new Promise((resolve1, reject) => {
      const _fxRateDetails: any = this.fxRateList.filter(
        x => x.currencyID === baseCurrencyID
      );
      if (_fxRateDetails.length === 0) {
        let output: any;
        this.commonService
          .getFXRate(baseCurrency)
          .then((res: any) => {
            if (res.success) {
              if (res.base) {
                output = {
                  currencyID: baseCurrencyID,
                  currencyName: baseCurrency,
                  rate: [res.rates]
                };
              } else {
                output = {
                  currencyID: baseCurrencyID,
                  currencyName: baseCurrency,
                  rate: []
                };
              }
              this.fxRateList.push(output);
              if (res.base) {
                return resolve1(true);
              } else {
                return resolve1(false);
              }

            } else {
              output = {
                currencyID: baseCurrencyID,
                currencyName: baseCurrency,
                rate: []
              };
              this.fxRateList.push(output);
              return resolve1(false);
            }
          })
          .catch(error => {
            this.loggerService.error(error);
            return resolve1(false);
          });
      } else {
        return resolve1(true);
      }
    });
  }
  public callAPIBaseonDate(DefaultCurrencyList, date): Promise<any> {
    return new Promise((resolve1, reject) => {
      if (this.FXdate !== date) {
        this.fxRateListBaseonDate = [];
        this.FXdate = date;
        const _fxRateDefault = DefaultCurrencyList;
        if (_fxRateDefault && this.isTapValid) {
          const promises: Promise<any>[] = [];
          _fxRateDefault.forEach((ele) => {
            promises.push(this.CallApiInLoopBaseonDate(Number(ele.ID), String(ele.ISO), date));
          });

          Promise.all(promises).then((res) => {
            return resolve1(res);
          });
        } else {
          reject(true);
        }

      }

    });
    // }
  }
  CallApiInLoopBaseonDate(baseCurrencyID, baseCurrency, date) {
    return new Promise((resolve1, reject) => {
      const _fxRateDetails: any = this.fxRateListBaseonDate.filter(
        x => x.currencyID === baseCurrencyID
      );
      if (_fxRateDetails.length === 0) {
        let output: any;
        this.commonService
          .getFXRateBaseOnDate(baseCurrency, date)
          .then((res: any) => {
            if (res.success) {
              if (res.base) {
                output = {
                  currencyID: baseCurrencyID,
                  currencyName: baseCurrency,
                  rate: [res.rates]
                };
              } else {
                output = {
                  currencyID: baseCurrencyID,
                  currencyName: baseCurrency,
                  rate: []
                };
              }
              this.fxRateListBaseonDate.push(output);
              if (res.base) {
                return resolve1(true);
              } else {
                return resolve1(false);
              }

            } else {
              output = {
                currencyID: baseCurrencyID,
                currencyName: baseCurrency,
                rate: []
              };
              this.fxRateListBaseonDate.push(output);
              return resolve1(false);
            }

          })
          .catch(error => {
            this.loggerService.error(error);
            return resolve1(false);
          });
      } else {
        return resolve1(true);
      }
    });
  }

  SentNotification(NotificationsID: any, Title = null, Message = null): Promise<any> {
    const userId = this.browserStorageService.getLocalStorageItem('userId');
    const data = { 'NotificationsID': NotificationsID, 'Title': Title, 'Message': Message, 'UserID': userId };
    return new Promise((resolve, reject) => {
      this.apiService
        .postWithHeader('Common/SentNotification', data)
        .subscribe(
          (resp: any) => {
            return resolve(resp);
          },
          err => {
            reject(err);
          }
        );
    });
  }
  removeRow(i: number, j: number, k: number, entityName, newTAPInstructionForm: FormGroup, ActionType = 0) {
    const periods: FormArray = this.getPeriods(i, j, newTAPInstructionForm, entityName)
    if (periods.controls[k].get('isExclude').value === 1) {
      periods.controls[k].get('isTempExclude').patchValue(1);
      periods.controls[k].get('isTempExclude').updateValueAndValidity();
      periods.controls[k].get('isExclude').patchValue(0);
      periods.controls[k].get('isExclude').updateValueAndValidity();
    } else if (periods.controls[k].get('isTempExclude').value === 1) {
      periods.controls[k].get('isExclude').patchValue(1);
      periods.controls[k].get('isExclude').updateValueAndValidity();
      periods.controls[k].get('isTempExclude').patchValue(0);
      periods.controls[k].get('isTempExclude').updateValueAndValidity();
    } else {
      periods.controls[k].get('isRemove').patchValue(ActionType);
      periods.controls[k].get('isRemove').updateValueAndValidity();
    }

  }

  getPeriods(i, j, newTAPInstructionForm, entityName): FormArray {
    const entity = newTAPInstructionForm.get(entityName) as FormArray;
    const entityDetails = entity.controls[i].get('EntityDetails') as FormArray;
    const operators = entityDetails.controls[j] as FormArray;
    const periods = operators.get('TapService') as FormArray;
    return periods;
  }

  getPeriodRows(i, j, k, newTAPInstructionForm, entityName) {
    // const entity = newTAPInstructionForm.get(entityName) as FormArray;
    // const entityDetails = entity.controls[i].get('EntityDetails') as FormArray;
    // const data = entityDetails.value.filter(ed => ed.TapService.filter(x => (x.PeriodID - 1) === (k) && x.isExclude === 0 && x.isRemove === 0 && x.PreviousisExclude === 0 && x.isTempExclude === 0).length > 0);
    // return (data.filter(x => x == entityDetails.value[j]).length > 0 && data.length > 1) || entityDetails.value[j].TapService[k].isTempExclude === 1;
    return true;
  }

  removeInactivePricingRow(newTAPInstructionForm: FormGroup, entityName: string, FlagToExclude): Boolean {
    const entity: FormArray = newTAPInstructionForm.get(entityName) as FormArray
    const removingindex = [];
    entity.controls.forEach((entitycntl: FormGroup, i) => {
      const entityDetails: FormArray = entitycntl.get('EntityDetails') as FormArray;
      entityDetails.controls.forEach((entityDetailscntl: FormGroup, j) => {
        const periods: FormArray = entityDetailscntl.get('TapService') as FormArray;
        periods.controls.forEach((periodscntl: FormGroup, k) => {
          if (FlagToExclude === 1) {
            if (periodscntl.get('isExclude') && periodscntl.get('isExclude').value === 1) {
              removingindex.push(k);
            }
          } else {
            if ((periodscntl.get('isExclude') && periodscntl.get('isExclude').value === 1) || (periodscntl.get('isRemove') && periodscntl.get('isRemove').value === 1)) {
              removingindex.push(k);
            }
          }
        });
        removingindex.sort(function (a, b) { return b - a; });
        removingindex.forEach((xindex) => {
          periods.removeAt(xindex);
        });
      });
      //const _temp: FormArray = formFields;
    });

    return true;
  }
}
// TapService
export const TapServiceConst = {
  TapServiceEnums: {
    MOCLocal: 1,
    MOCHome: 2,
    MOCRoW: 3,
    MTC: 4,
    SMSMO: 5,
    SMSMT: 6,
    Data: 7,
    VoLTE: 8
  }
};
