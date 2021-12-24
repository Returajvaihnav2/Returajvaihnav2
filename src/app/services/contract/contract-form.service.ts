
import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
import {
 DiscTypeM2MFinancial, DiscTypeM2MFlatRate, DiscTypeM2MBandedTiered
} from '../../models/contract/contract.model';
import * as moment from 'moment';
import { ContractService } from './contract.service';
import * as lodash from 'lodash';
import { UtilityProvider } from '../../utility/utility';

@Injectable()
export class ContractFormService {
  isValid: Boolean = true;
  allRegionId: String = '1';
  allTerminationInId: String = '-1';
  errorMsgs = '';
  errorTitle = '';
  tempObjectTradingEntity: FormGroup;
  tempObjectCounterParty: FormGroup;
  tempObjectIsLongStub: any;
  copyControls: EventEmitter<any> = new EventEmitter();
  GridErrorDetail: GridErrorDetail[] = [];
  ErrorKeyClass = null;
  Allowsplit = false;
  isSubmitPress = false;
  constructor(private contractService: ContractService, private utility: UtilityProvider) {
  }
  // get year and month
  getDateDetails() {
    const dt = new Date();
    return {
      month: dt.getMonth(),
      year: dt.getFullYear()
    };
  }
  emitDiscountChangeEvent(data) {
    this.copyControls.emit(data);
  }
  getDiscountTypeEmitter() {
    return this.copyControls;
  }
  // FormGroup declaration Iot
  bindFormGroup() {
    const dt = this.getDateDetails();
    return new FormGroup({
      'TradingEntityID': new FormControl('', Validators.required),
      'CounterPartyBy': new FormControl(1, Validators.required),
      'CounterParty': new FormControl('', Validators.required),
      'TemplateID': new FormControl(),
      'AbusiveTrafficRate': new FormControl('', Validators.required),
      'AppFixDelayPayRate': new FormControl('', Validators.required),
      'isSender': new FormControl(-1),
      'Bid': this.bindDiscountDetails(),
      'ContractID': new FormControl(),
      'DirectionID': new FormControl(1),
      'DiscountPeriods': new FormArray([this.bindDiscountPeriods()]),
      'TypeID': new FormControl(1),
      'CounterPartyCountry': new FormControl(''),
      'CounterPartyTapCode': new FormControl(''),
      'CounterPartyParentCode': new FormControl(),
      'CounterPartyTCID': new FormControl(),
      'DiscountPeriodID': new FormControl(2, Validators.required),
      'EndDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, 11, 31)).format('DD/MM/YYYY'), Validators.required),
      'IsAutoRenewal': new FormControl(true),
      'isLongStub': new FormControl(0),
      'Offer': this.bindDiscountDetails(),
      'NoOfDiscountPeriods': new FormControl(1),
      // 'StartDate': new FormControl(new Date(dt.year, dt.month, 1), Validators.required),
      'StartDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 0 : dt.month, 1)).format('DD/MM/YYYY'), Validators.required),
      'TradingEntityTADIGCodes': new FormArray([]),
      'CounterPartyTADIGCodes': new FormArray([]),
      'TerminationID': new FormControl(''),
      // 'TradeDate': new FormControl(new Date(), Validators.required),
      'TradeDate': new FormControl(moment(new Date()).format('DD/MM/YYYY'), Validators.required),

      'TradingEntityTCID': new FormControl(),
      'TradingEntityParentCode': new FormControl(),
      'ContractFromEnumID': new FormControl(1),
      'DealTypeEnumID': new FormControl(1),
      'ContractDocument': new FormControl(''),
      'DocumentID': new FormControl(''),
      'ExistingContractStatusEnumID': new FormControl(0),
      'isCompleted': new FormControl(0),
      'OfflineFileName': new FormControl(''),
      'ContractDealType': new FormControl(''),
      'OfferDefaultCurrency': new FormControl(0),
      'BidDefaultCurrency': new FormControl(0),
      'Comments': new FormControl(),
      "CounterPartyDomainList": new FormControl()
    });
  }
  // FormGroup declaration NBIot
  bindNBFormGroup() {
    const dt = this.getDateDetails();
    return new FormGroup({
      'isSender': new FormControl(-1),
      'Bid': this.bindDiscountDetails(),
      'ContractID': new FormControl(),
      'OneCancelsOther': new FormControl(),
      'DirectionID': new FormControl(1),
      'DiscountPeriods': new FormArray([this.bindDiscountPeriods()]),
      'TypeID': new FormControl(1),
      'CounterPartyBy': new FormControl(1, Validators.required), // Rituraj Added
      'CounterPartyCountry': new FormControl(''), // Rituraj Added
      'CounterPartyTapCode': new FormControl(''),
      'CounterParty': new FormControl('', Validators.required),
      'TemplateID': new FormControl(),
      'DiscountPeriodID': new FormControl(2, Validators.required),
      'EndDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, 11, 31)).format('DD/MM/YYYY'), Validators.required),
      'IsAutoRenewal': new FormControl(true),
      'isLongStub': new FormControl(0),
      'Offer': this.bindDiscountDetails(),
      'TradingEntityValidDate': new FormControl(1), // Rituraj Added
      'NoOfDiscountPeriods': new FormControl(1),
      // 'StartDate': new FormControl(new Date(dt.year, dt.month, 1), Validators.required),
      'StartDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 0 : dt.month, 1)).format('DD/MM/YYYY'), Validators.required),
      // 'TradeDate': new FormControl(new Date(), Validators.required),
      'TradeDate': new FormControl(moment(new Date()).format('DD/MM/YYYY'), Validators.required),
      'TradingEntityTADIGCodes': new FormArray([]),
      'CounterPartyTADIGCodes': new FormArray([]),
      'TerminationID': new FormControl(''),
      'TradingEntityID': new FormControl('', Validators.required),
      'TradingEntityTCID': new FormControl(),
      'TradingEntityParentCode': new FormControl(),
      'ContractFromEnumID': new FormControl(1),
      'DealTypeEnumID': new FormControl(2),
      'ContractDocument': new FormControl(''),
      'isCompleted': new FormControl(0),
      'DocumentID': new FormControl(''),
      'ExistingContractStatusEnumID': new FormControl(0),
      'OfflineFileName': new FormControl(''),
      'ContractDealType': new FormControl(''),
      'OfferDefaultCurrency': new FormControl(0),
      'BidDefaultCurrency': new FormControl(0),
      'AbusiveTrafficRate': new FormControl('', Validators.required),
      'AppFixDelayPayRate': new FormControl('', Validators.required),
      'Comments': new FormControl()
    });
  }
  bindTradeFormGroup() {
    const dt = this.getDateDetails();
    return new FormGroup({
      // 'AlfTicket': new FormControl(),
      'isSender': new FormControl(-1),
      'TradeID': new FormControl(),
      // 'ReferenceNo': new FormControl(),
      'TradingEntityID': new FormControl('', Validators.required),
      'TradingEntityName': new FormControl(),
      'TradingEntityTCID': new FormControl(),
      'TradingEntityParentCode': new FormControl(),
      'TradingEntityisTrader': new FormControl(),
      'CounterPartyBy': new FormControl(1),
      'CounterPartyCountry': new FormControl(''),
      'CounterPartyTapCode': new FormControl(''),
      'CounterParty': new FormControl('', Validators.required),
      'CounterPartyParentCode': new FormControl(),
      'isOCO': new FormControl(false),
      'TypeID': new FormControl(1),
      'DirectionID': new FormControl(1),
      'TemplateID': new FormControl('', Validators.required),
      'TemplateName': new FormControl(''),
      'StartDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 0 : dt.month, 1)).format('DD/MM/YYYY'), Validators.required),
      'EndDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, 11, 31)).format('DD/MM/YYYY'), Validators.required),
      'TradingEntityValidDate': new FormControl(),
      'TerminationID': new FormControl(''),
      'TerminationName': new FormControl(),
      'IsAutoRenewal': new FormControl(true),
      'DiscountPeriodID': new FormControl(2, Validators.required),
      'DiscountPeriodName': new FormControl(),
      'NoOfDiscountPeriods': new FormControl(1),
      'isLongStub': new FormControl(0),
      'isFillKill': new FormControl(0),
      'DiscountPeriods': new FormArray([this.bindDiscountPeriods()]),
      'TradingEntityTADIGCodes': new FormArray([]),
      'CounterPartyTADIGCodes': new FormArray([]),
      'Offer': this.bindDiscountDetails(),
      'Bid': this.bindDiscountDetails(),
      'TradeFromEnumID': new FormControl(1), // online/offline
      'TradeTypeEnumID': new FormControl(1), // IOt/NBIOT
      'TradeDealType': new FormControl(''), // IOt/NBIOT
      'CounterPartyValidDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 1 : dt.month + 1, 0)).format('DD/MM/YYYY'), Validators.required),
      'RespondComments': new FormControl(''),
      'RejectReason': new FormControl(''),
      'CounterPartyContact': new FormArray([]),
      'TradingEntityStatus': new FormControl(0),
      'OfferDefaultCurrency': new FormControl(0),
      'BidDefaultCurrency': new FormControl(0),
      'ContractDocument': new FormControl(''),
      'TradeApproval': new FormArray([]),
      'AbusiveTrafficRate': new FormControl(''),
      'AppFixDelayPayRate': new FormControl(''),
      'Comments': new FormControl('')
    });
  }

  bindBCEFormGroup() {
    const dt = this.getDateDetails();
    return new FormGroup({
      // 'AlfTicket': new FormControl(),
      'isSender': new FormControl(-1),
      'TradeID': new FormControl(),
      // 'ReferenceNo': new FormControl(),
      'TradingEntityID': new FormControl('', Validators.required),
      'TradingEntityName': new FormControl(),
      'TradingEntityTCID': new FormControl(),
      'TradingEntityParentCode': new FormControl(),
      'TradingEntityisTrader': new FormControl(),
      'CounterPartyBy': new FormControl(1),
      'CounterPartyCountry': new FormControl(''),
      'CounterPartyTapCode': new FormControl(''),
      'CounterParty': new FormControl('', Validators.required),
      'CounterPartyParentCode': new FormControl(),
      'isOCO': new FormControl(false),
      'TypeID': new FormControl(1),
      'DirectionID': new FormControl(1),
      'TemplateID': new FormControl('', Validators.required),
      'TemplateName': new FormControl(''),
      'CommercialLaunchStatus': new FormControl(''),
      'Reconciliation': new FormControl(''),
      'ReconciliationTolerenceThreshold': new FormControl(''),
      'CLLStartDate': new FormControl(moment(new Date(dt.year, dt.month, 1)).format('DD/MM/YYYY'), Validators.required),
      'StartDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 0 : dt.month, 1)).format('DD/MM/YYYY'), Validators.required),
      'EndDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, 11, 31)).format('DD/MM/YYYY'), Validators.required),
      'TradingEntityValidDate': new FormControl(),
      'TerminationID': new FormControl(''),
      'TerminationName': new FormControl(),
      'IsAutoRenewal': new FormControl(true),
      'DiscountPeriodID': new FormControl(2, Validators.required),
      'DiscountPeriodName': new FormControl(),
      'NoOfDiscountPeriods': new FormControl(1),
      'isLongStub': new FormControl(0),
      'isFillKill': new FormControl(0),
      'DiscountPeriods': new FormArray([this.bindDiscountPeriods()]),
      'TradingEntityTADIGCodes': new FormArray([]),
      'CounterPartyTADIGCodes': new FormArray([]),
      'Offer': this.bindBCEDiscountDetails(),
      'Bid': this.bindBCEDiscountDetails(),
      'TradeFromEnumID': new FormControl(1), // online/offline
      'TradeTypeEnumID': new FormControl(1), // IOt/NBIOT
      'CounterPartyValidDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 1 : dt.month + 1, 0)).format('DD/MM/YYYY'), Validators.required),
      'RespondComments': new FormControl(''),
      'RejectReason': new FormControl(''),
      'CounterPartyContact': new FormArray([]),
      'TradingEntityStatus': new FormControl(0),
      'OfferDefaultCurrency': new FormControl(0),
      'BidDefaultCurrency': new FormControl(0),
      'ContractDocument': new FormControl(''),
      'AbusiveTrafficRate': new FormControl(''),
      'AppFixDelayPayRate': new FormControl(''),
      'Comments': new FormControl(''),
    });
  }

  bindDiscountPeriods() {
    return new FormGroup({
      'DiscountPeriod': new FormControl(),
      'DiscountPeriodStartDate': new FormControl(),
      'DiscountPeriodEndDate': new FormControl()
    });
  }

  setDiscountPeriods(period, startDate, endDate) {
    return new FormGroup({
      'DiscountPeriod': new FormControl(period),
      'DiscountPeriodStartDate': new FormControl(moment(startDate).format('DD/MM/YYYY')),
      'DiscountPeriodEndDate': new FormControl(moment(endDate).format('DD/MM/YYYY'))
    });
  }

  // DiscountDetails
  bindBCEDiscountDetails() {
    return new FormGroup({
      'IsBid': new FormControl(false, Validators.required),
      'DiscountTypes': new FormControl([], Validators.required),
      'SettlementTypeID': new FormControl(3, Validators.required),
      'IsIncludeM2M': new FormControl(false),
      'SigningProcess': new FormControl(null, Validators.required),
      'Reconciliation': new FormControl(false),
      'ReconciliationTolerenceThreshold': new FormControl(null, Validators.required),
      'TaxTreatmentID': new FormControl(2, Validators.required),
      'TaxTreatmentName': new FormControl(),
      'BaisCalculationID': new FormControl(1),
      'BaisCalculationIDName': new FormControl(),
      'Exclusions': new FormControl([]),
      'ExclusionsCountryRegion': this.bindExclusionsCountryRegion(),
      // 'ExclusionTemp': this.bindExclusionTemp(),
      'MinimumPaymentCommitment': new FormArray([]),
      'BalancedUnbalanced': new FormArray([]),
      'BandedTiered': new FormArray([]),
      'Financial': new FormArray([]),
      'FlatRate': new FormArray([]),
      'VolumeConditionalCommitment': new FormArray([]),
      'MarketShare': new FormArray([]),
      'DiscountInvoice': new FormArray([]),
      'FinancialWithFair': new FormArray([]),
      'FinancialDiscountFair': new FormArray([]),
      'M2M': this.bindBCEM2M(),
      'Tabs': new FormControl(1, Validators.required)
    });
  }

  // DiscountDetails
  bindDiscountDetails() {
    return new FormGroup({
      'IsBid': new FormControl(false, Validators.required),
      'DiscountTypes': new FormControl([], Validators.required),
      'SettlementTypeID': new FormControl(3, Validators.required),
      'IsIncludeM2M': new FormControl(false),
      'SigningProcess': new FormControl(1, Validators.required),
      'TaxTreatmentID': new FormControl(2, Validators.required),
      'TaxTreatmentName': new FormControl(),
      'BaisCalculationID': new FormControl(1),
      'BaisCalculationIDName': new FormControl(),
      'Exclusions': new FormControl([]),
      'ExclusionsCountryRegion': this.bindExclusionsCountryRegion(),
      // 'ExclusionTemp': this.bindExclusionTemp(),
      'MinimumPaymentCommitment': new FormArray([]),
      'BalancedUnbalanced': new FormArray([]),
      'BandedTiered': new FormArray([]),
      'Financial': new FormArray([]),
      'FlatRate': new FormArray([]),
      'VolumeConditionalCommitment': new FormArray([]),
      'MarketShare': new FormArray([]),
      'DiscountInvoice': new FormArray([]),
      'FinancialWithFair': new FormArray([]),
      'FinancialDiscountFair': new FormArray([]),
      'M2M': this.bindM2M(),
      'Tabs': new FormControl(1, Validators.required)
    });
  }

  // Exclusions
  bindExclusions() {
    return new FormGroup({
      'ExclusionName': new FormControl(),
      'ExclusionID': new FormControl()
    });
  }

  // ExclusionsCountryRegion
  bindExclusionsCountryRegion() {
    return new FormGroup({
      'Countries': new FormControl([]),
      'Regions': new FormControl([])
    });
  }

  // TadigCode
  bindTadigCode(ele: any) {
    return new FormGroup({
      TadigId: new FormControl(ele.TadigId),
      OperatorId: new FormControl(ele.OperatorId),
      OperatorName: new FormControl(ele.OperatorName),
      TadigCode: new FormControl(ele.TadigCode),
      TCID: new FormControl(ele.TCID),
      CodeTypeId: new FormControl(ele.CodeTypeId),
      CodeType: new FormControl(ele.CodeType),
      CountryID: new FormControl(ele.CountryID),
      CountryName: new FormControl(ele.CountryName),
      CountryISO: new FormControl(ele.CountryISO),
      CountryTAPCodeId: new FormControl(ele.CountryTAPCodeId),
      CountryName1: new FormControl(ele.CountryName1),
      CountryTAPISO: new FormControl(ele.CountryTAPISO),
      RegionId: new FormControl(ele.RegionId),
      RegionName: new FormControl(ele.RegionName),
      RegionType: new FormControl(ele.RegionType),
      IsSelected: new FormControl(ele.IsSelected),
      RowNo: new FormControl(ele.RowNo),
      IsTritexOperator: new FormControl(ele.IsTritexOperator),
      ShortName: new FormControl(ele.ShortName),
      GroupID: new FormControl(ele.GroupID),
      CounterPartyDomainList: new FormControl(ele.CounterPartyDomainList)

    });
  }

  // MinimumPaymentCommitment
  bindMinimumPaymentCommitment(index = null, ele?) {
    const Splits = [];
    if (ele && ele.Splits && ele.Splits.length > 0) {
      ele.Splits.forEach(elsplit => {
        Splits.push(this.bindMinimumPaymentCommitmentSplit(null, elsplit, ele.CurrencyID ? ele.CurrencyID : 58));
      });
    }
    return new FormGroup({
      'OrderIndex': new FormControl(ele && ele.OrderIndex ? ele.OrderIndex : 1, Validators.required),
      'PeriodID': new FormControl(ele && ele.PeriodID ? ele.PeriodID : index),
      'Commitment': new FormControl(ele && ele.Commitment ? ele.Commitment : ''),
      'CurrencyID': new FormControl(ele && ele.CurrencyID ? ele.CurrencyID : 58),
      'ISO': new FormControl(ele && ele.ISO ? ele.ISO : ''),
      'CurrencyName': new FormControl(ele && ele.CurrencyName ? ele.CurrencyName : ''),
      'AppliesTo': new FormControl(ele && ele.AppliesTo ? ele.AppliesTo : '', Validators.required),
      'RoamingOn': new FormControl(ele && ele.RoamingOn ? ele.RoamingOn : '', Validators.required),
      'AppliesToCode': new FormControl(ele && ele.AppliesToCode ? ele.AppliesToCode : ''),
      'RoamingOnCode': new FormControl(ele && ele.RoamingOnCode ? ele.RoamingOnCode : ''),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(ele && ele.CanDelete ? ele.CanDelete : 0),
      'Splits': new FormArray(Splits)
    });
  }


  // MinimumPaymentCommitment
  bindMinimumPaymentCommitmentSplit(index = null, ele?, curruncy?) {
    return new FormGroup({
      'SAppliesTo': new FormControl(ele && ele.SAppliesTo ? ele.SAppliesTo : '', Validators.required),
      'SRoamingOn': new FormControl(ele && ele.SRoamingOn ? ele.SRoamingOn : '', Validators.required),
      'SCurrencyID': new FormControl(ele && ele.SCurrencyID ? ele.SCurrencyID : curruncy),
      'SCommitment': new FormControl(ele ? ele.SCommitment : '', Validators.required),
    });
  }

  // BalancedUnbalanced
  bindBalancedUnbalanced(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'BalancedTrafficRate': new FormControl(ele && ele.BalancedTrafficRate >= 0 ? ele.BalancedTrafficRate : '', [Validators.required, Validators.min(0)]),
      'UnbalancedTrafficRate': new FormControl(ele && ele.UnbalancedTrafficRate >= 0 ? ele.UnbalancedTrafficRate : '', [Validators.required, Validators.min(0)]),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }

  // BandedTiered
  bindBandedTiered(copyField?: any[], values?, index?, ele?: any) {
    let tempArray = [];
    if (copyField) {
      copyField.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    }
    const rows = values ? values.discountTypeRate : null;
    if (rows && rows.length && rows[index]) {
      const bands = rows[index].bands;
      bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (ele && ele.Bands && ele.Bands.length) {
      ele.Bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (!tempArray.length) {
      tempArray = [this.bindBands(null)];
    }
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'Bands': new FormArray(tempArray),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      // bce added
      'ThresholdCalculatedID': new FormControl(ele ? ele.ThresholdCalculatedID : '0'),
      'ThresholdCalculationTypeID': new FormControl(ele ? ele.ThresholdCalculationTypeID : '0'),
      // bce
      'ChangeIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }

  // bands
  bindBands(eleBands: any) {
    return new FormGroup({
      'TrafficRate': new FormControl(eleBands && eleBands.TrafficRate >= 0 ? eleBands.TrafficRate : '',
        [Validators.required, Validators.min(0)]),
      'BandThreshold': new FormControl(eleBands && eleBands.BandThreshold >= 0 ? eleBands.BandThreshold : '',
        (eleBands && eleBands.BandThresholdTypeID === 3) ?
          null : [Validators.required, Validators.min(0)]),
      'IsBandBackToFirst': new FormControl(eleBands && eleBands.IsBandBackToFirst ? eleBands.IsBandBackToFirst : false),
      'BandThresholdTypeID': new FormControl(eleBands ? eleBands.BandThresholdTypeID : 1, Validators.required),
      'BandThresholdTypeName': new FormControl(),
    });
  }

  // Financial
  bindFinancial(ele) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele && ele.OrderIndex ? ele.OrderIndex : 1, Validators.required),
      'AYCERate': new FormControl(ele && ele.AYCERate >= 0 ? ele.AYCERate : '', [Validators.required, Validators.min(0)]),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele && ele.CurrencyID ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'Services': new FormControl(ele && ele.Services ? ele.Services : '', Validators.required),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0)
    });
  }

  // FlatRate
  bindFlatRate(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'TrafficRate': new FormControl(ele && ele.TrafficRate >= 0 ? ele.TrafficRate : '', [Validators.required, Validators.min(0)]),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChargingIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }


  // DiscountInvoice
  bindDiscountInvoice(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'DiscountPercentage': new FormControl(ele && ele.DiscountPercentage >= 0 ? ele.DiscountPercentage : '', [Validators.required, Validators.min(0)]),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }

  // FinancialWithFair
  bindFinancialWithFair(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele && ele.OrderIndex ? ele.OrderIndex : 1, Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'AYCERate': new FormControl(ele && ele.AYCERate >= 0 ? ele.AYCERate : '', [Validators.required, Validators.min(0)]),
      'FairUseCAP': new FormControl(ele && ele.FairUseCAP >= 0 ? ele.FairUseCAP : '', [Validators.required, Validators.min(0)]),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele && ele.CurrencyID ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0)
    });
  }

  // FinancialDiscountFair
  bindFinancialDiscountFair(copyField?: any[], values?, index?, ele?: any) {
    let tempArray = [];
    if (copyField) {
      copyField.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    }
    const rows = values ? values.discountTypeRate : null;
    if (rows && rows.length && rows[index]) {
      const bands = rows[index].bands;
      bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (ele && ele.Bands && ele.Bands.length) {
      ele.Bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (!tempArray.length) {
      tempArray = [this.bindBands(null)];
    }
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(''),
      'Bands': new FormArray(tempArray),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }

  // VolumeConditionalCommitment
  bindVolumeConditionalCommitment(ele?: any, copyfield?: any) {
    const Splits = [];
    if (ele && ele.Splits && ele.Splits.length > 0) {
      ele.Splits.forEach(elsplit => {
        Splits.push(this.bindMinimumPaymentCommitmentSplit(null, elsplit, ele.CurrencyID ? ele.CurrencyID : 58));
      });
    }
    if (copyfield && copyfield.length > 0) {
      copyfield.forEach(elsplit => {
        Splits.push(this.bindMinimumPaymentCommitmentSplit(null, elsplit, 58));
      });
    }
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'PeriodID': new FormControl(ele && ele.PeriodID ? ele.PeriodID : null),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'AppliesTo': new FormControl(ele && ele.AppliesTo ? ele.AppliesTo : '', Validators.required),
      'RoamingOn': new FormControl(ele && ele.RoamingOn ? ele.RoamingOn : '', Validators.required),
      'AppliesToCode': new FormControl(ele && ele.AppliesToCode ? ele.AppliesToCode : ''),
      'RoamingOnCode': new FormControl(ele && ele.RoamingOnCode ? ele.RoamingOnCode : ''),
      'Volume': new FormControl(ele && ele.Volume >= 0 ? ele.Volume : '', [Validators.required, Validators.min(0)]),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChargingIntervalName': new FormControl(),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0),
      'Splits': new FormArray(Splits)
    });
  }

  // MarketShareCommitment
  bindMarketShareCommitment(ele?: any, copyfield?: any) {
    const Splits = [];
    if (ele && ele.Splits && ele.Splits.length > 0) {
      ele.Splits.forEach(elsplit => {
        Splits.push(this.bindMinimumPaymentCommitmentSplit(null, elsplit, ele.CurrencyID ? ele.CurrencyID : 58));
      });
    }
    if (copyfield && copyfield.length > 0) {
      copyfield.forEach(elsplit => {
        Splits.push(this.bindMinimumPaymentCommitmentSplit(null, elsplit, 58));
      });
    }

    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'PeriodID': new FormControl(ele && ele.PeriodID ? ele.PeriodID : null),
      'AppliesTo': new FormControl(ele && ele.AppliesTo ? ele.AppliesTo : '', Validators.required),
      'RoamingOn': new FormControl(ele && ele.RoamingOn ? ele.RoamingOn : '', Validators.required),
      'AppliesToCode': new FormControl(ele && ele.AppliesToCode ? ele.AppliesToCode : ''),
      'RoamingOnCode': new FormControl(ele && ele.RoamingOnCode ? ele.RoamingOnCode : ''),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'VolumePercentage': new FormControl(ele && ele.VolumePercentage >= 0 ? ele.VolumePercentage : '', [Validators.required, Validators.min(0)]),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0),
      'Splits': new FormArray(Splits)
    });
  }

  // M2M
  bindM2M() {
    return new FormGroup({
      'IsIMSI': new FormControl(false, Validators.required),
      'IsTAP': new FormControl(false, Validators.required),
      'IsAPN': new FormControl(false, Validators.required),
      'TAPCodeList': new FormControl(),
      'IMSIFileRange': new FormControl(),
      'APNList': new FormArray([]),
      'DiscountTypes': new FormControl([], Validators.required),
      'IsAccessTraffic': new FormControl(false),
      'CurrencyID': new FormControl(''),
      'AccessFeeType': new FormControl(1),
      'FinancialM2M': new FormArray([]),
      'BandedTieredM2M': new FormArray([]),
      'FlatRateM2M': new FormArray([]),
      'BalancedUnbalancedM2M': new FormArray([]),
      'AccessFeeM2M': new FormArray([]),
      'MinimumPaymentCommitmentM2M': new FormArray([]),
      'VolumeConditionalCommitmentM2M': new FormArray([]),
      'MarketShareM2M': new FormArray([]),
      'DiscountInvoiceM2M': new FormArray([]),
      'FinancialWithFairM2M': new FormArray([]),
      'FinancialDiscountFairM2M': new FormArray([]),
      'Tabs': new FormControl(1)
    });
  }

  // M2M
  bindBCEM2M() {
    return new FormGroup({
      'IsIMSI': new FormControl(false, Validators.required),
      'IsTAP': new FormControl(false, Validators.required),
      'IsAPN': new FormControl(false, Validators.required),
      'IsIMEI': new FormControl(false, Validators.required),
      'IsRAT8': new FormControl(false, Validators.required),
      'IsUSR': new FormControl(false, Validators.required),
      'IsBSR': new FormControl(false, Validators.required),
      'IsUDR': new FormControl(false, Validators.required),
      'USR': new FormControl('Not Applicable', Validators.required),
      'BSR': new FormControl('Not Applicable', Validators.required),
      'UDR': new FormControl('Not Applicable', Validators.required),
      'TAPCodeList': new FormControl(),
      'IMSIFileRange': new FormControl(),
      'APNList': new FormArray([]),
      'DiscountTypeID': new FormControl(''),
      'IsAccessTraffic': new FormControl(false),
      'AccessFeeCurrencyID': new FormControl(''),
      'AccessFeeRatePerIMSI': new FormControl(''),
      'AccessFeeChargeIntervalID': new FormControl(''),
      'FinancialM2M': new FormArray([]),
      'BandedTieredM2M': new FormArray([]),
      'FlatRateM2M': new FormArray([]),
    });
  }


  // TAPCodeList
  bindTAPCodeList() {
    return new FormGroup({
      'TAPCodeID': new FormControl('', Validators.required)
    });
  }

  // APNList
  bindAPNList(ele = null) {
    return new FormGroup({
      'TADIGID': new FormControl('', Validators.required),
      'APNCode': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      'OrderIndex': new FormControl(ele && ele.OrderIndex ? ele.OrderIndex : 1, Validators.required),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(ele && ele.CanDelete ? ele.CanDelete : 0),
    });
  }

  bindAccessFeeM2M(ele?) {
    return new FormGroup({
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : '', Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'RatePerIMSI': new FormControl(ele && ele.RatePerIMSI >= 0 ? ele.RatePerIMSI : '', [Validators.required, Validators.min(0)]),
      'AppliesTo': new FormControl(ele && ele.AppliesTo ? ele.AppliesTo : '', Validators.required),
      'AppliesToCode': new FormControl(),
      'RoamingOn': new FormControl(ele && ele.RoamingOn ? ele.RoamingOn : '', Validators.required),
      'RoamingOnCode': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChargeIntervalNAME': new FormControl(),
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(ele ? ele.CanDelete : 0)
    });
  }


  // BandedTieredM2M
  bindBandedTieredM2M(copyField?: any[], values?, index?, ele?) {
    let tempArray = [];
    if (copyField) {
      copyField.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    }
    const rows = values ? values.discountTypeRate : null;
    if (rows && rows.length && rows[index]) {
      const bands = rows[index].Bands;

      bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (ele && ele.Bands && ele.Bands.length) {
      ele.Bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (!tempArray.length) {
      tempArray = [this.bindBands(null)];
    }

    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'Bands': new FormArray(tempArray),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChargingIntervalName': new FormControl(),
      'ThresholdCalculatedID': new FormControl(ele ? ele.ThresholdCalculatedID : '', Validators.required),
      'ThresholdCalculatedName': new FormControl(),
      'ThresholdCalculationTypeID': new FormControl(ele ? ele.ThresholdCalculationTypeID : '', Validators.required),
      'ThresholdCalculationTypeName': new FormControl(),
      'IMSIApplicationFeeID': new FormControl(ele ? ele.IMSIApplicationFeeID : '', Validators.required),
      'IMSIApplicationFeeName': new FormControl(),

      'isRemove': new FormControl(0),
      'isExclude': new FormControl(0),
      'CanDelete': new FormControl(0)
    });
  }

  // FlatRateM2M
  bindFlatRateM2M(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'TrafficRate': new FormControl(ele && ele.TrafficRate >= 0 ? ele.TrafficRate : '', [Validators.required, Validators.min(0)]),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChargingIntervalName': new FormControl(),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0)
    });
  }


  // BalancedUnbalancedM2M
  bindBalancedUnbalancedM2M(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'BalancedTrafficRate': new FormControl(ele && ele.BalancedTrafficRate >= 0 ? ele.BalancedTrafficRate : '', [Validators.required, Validators.min(0)]),
      'UnbalancedTrafficRate': new FormControl(ele && ele.UnbalancedTrafficRate >= 0 ? ele.UnbalancedTrafficRate : '', [Validators.required, Validators.min(0)]),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }


  // DiscountInvoiceM2M
  bindDiscountInvoiceM2M(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'DiscountPercentage': new FormControl(ele && ele.DiscountPercentage >= 0 ? ele.DiscountPercentage : '', [Validators.required, Validators.min(0)]),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }

  // FinancialWithFairM2M
  bindFinancialWithFairM2M(ele?: any) {
    return new FormGroup({
      'OrderIndex': new FormControl(ele && ele.OrderIndex ? ele.OrderIndex : 1, Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'AYCERate': new FormControl(ele && ele.AYCERate >= 0 ? ele.AYCERate : '', [Validators.required, Validators.min(0)]),
      'FairUseCAP': new FormControl(ele && ele.FairUseCAP >= 0 ? ele.FairUseCAP : '', [Validators.required, Validators.min(0)]),
      'OperatorAffiliate': new FormControl(ele && ele.OperatorAffiliate ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele && ele.OriginatedIn ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele && ele.CurrencyID ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CanDelete': new FormControl(0)
    });
  }

  // FinancialDiscountFairM2M
  bindFinancialDiscountFairM2M(copyField?: any[], values?, index?, ele?: any) {
    let tempArray = [];
    if (copyField) {
      copyField.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    }
    const rows = values ? values.discountTypeRate : null;
    if (rows && rows.length && rows[index]) {
      const bands = rows[index].bands;
      bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (ele && ele.Bands && ele.Bands.length) {
      ele.Bands.forEach((xcopy) => {
        tempArray.push(this.bindBands(xcopy));
      });
    } else if (!tempArray.length) {
      tempArray = [this.bindBands(null)];
    }
    return new FormGroup({
      'OrderIndex': new FormControl(ele ? ele.OrderIndex : '', Validators.required),
      'ServiceID': new FormControl(ele ? ele.ServiceID : '', Validators.required),
      'ServiceName': new FormControl(),
      'OperatorAffiliate': new FormControl(ele ? ele.OperatorAffiliate : '', Validators.required),
      'OriginatedIn': new FormControl(ele ? ele.OriginatedIn : '', Validators.required),
      'CurrencyID': new FormControl(ele ? ele.CurrencyID : 58, Validators.required),
      'CurrencyName': new FormControl(),
      'ISO': new FormControl(),
      'TerminatedID': new FormControl(0, Validators.required),
      'TerminatedTypeID': new FormControl(),
      'TerminatedName': new FormControl(ele ? ((ele.TerminatedInID === -1) ? 'All' : ele.TerminatedName) : ''),
      'Bands': new FormArray(tempArray),
      'PerUnitID': new FormControl(ele ? ele.PerUnitID : '', Validators.required),
      'PerUnitName': new FormControl(),
      'ChargingIntervalID': new FormControl(ele ? ele.ChargingIntervalID : '', Validators.required),
      'ChangeIntervalName': new FormControl(),
      'RegionCountryID': new FormControl(ele ? ele.RegionCountryID : []),
      'isRemove': new FormControl(ele && ele.isRemove ? ele.isRemove : 0),
      'isExclude': new FormControl(ele && ele.isExclude ? ele.isExclude : 0),
      'CustomTerminatedName': new FormControl(),
      'isTE': new FormControl(ele ? ele.isTE : null),
      'CanDelete': new FormControl(0)
    });
  }


  bindCounterPartyValidDate(OperatorDetails, validDate?) {
    const dt = this.getDateDetails();
    return new FormGroup({
      'OperatorIds': new FormControl(OperatorDetails.OperatorIds, Validators.required),
      'OperatorName': new FormControl(OperatorDetails.OperatorName, Validators.required),
      'CounterPartyValidDate': new FormControl(moment(new Date((dt.month === 10 || dt.month === 11) ? dt.year + 1 : dt.year, (dt.month === 10 || dt.month === 11) ? 1 : dt.month + 1, 0)).format('DD/MM/YYYY'), Validators.required),
    });
  }

  bindCounterPartyContact(ele) {
    return new FormGroup({
      'OperatorIds': new FormControl(ele.OperatorIds, Validators.required),
      'OperatorName': new FormControl(ele.OperatorName, Validators.required),
      'FirstName': new FormControl(ele.FirstName, Validators.required),
      'LastName': new FormControl(ele.LastName, Validators.required),
      'EmailID': new FormControl(ele.EmailID, Validators.compose([Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      Validators.maxLength(50)])),
      'DomainID': new FormControl(ele.DomainID, Validators.required),
      'DomainName': new FormControl(ele.DomainName, Validators.required),
      'TradingEntityID': new FormControl(ele.TradingEntityID, Validators.required),
      'IsDefault': new FormControl(ele.IsDefault),
    });
  }


  bindTradeApproval(element, order): FormGroup {
    return new FormGroup({
      'Number': new FormControl(order ? order : 0),
      'UserID': new FormControl(element ? element.UserID : '', [Validators.required]),
      'Comment': new FormControl(element ? element.Comment : ''),
      'Notes': new FormControl(element ? element.Notes : '')
    });
  }

  sortFormFields(j: number, newContractIOTForm: FormGroup, discountType: string, arrayIndexes: AbstractControl[], TypeID, isM2M) {
    const discountTypeList = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value : newContractIOTForm.get(discountType).get('DiscountTypes').value;
    if (discountTypeList) {
      let DiscountTypeTemp = lodash.cloneDeep(discountTypeList);
      if (TypeID == -1) {
        DiscountTypeTemp.push({ 'DiscountTypeID': -1, 'DiscountTypeName': 'AccessFeeM2M' });
      }

      for (let index = 0; index < DiscountTypeTemp.length; index++) {
        const discountTypeID = DiscountTypeTemp[index].DiscountTypeID;
        const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
          : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
        if (TypeID === discountTypeID) {
          const _temp: FormArray = offerFields.controls[j] as FormArray;
          arrayIndexes.forEach((ele: FormGroup, i) => {
            const fields = _temp.controls[i] as FormGroup;
            fields.setValue(ele.value);
          });
        }
      }
    }
  }

  removeInactivePricingRow(contractForm: FormGroup, bidOrOffer: string, FlagToExclude): Boolean {
    const discountTypeNameList = lodash.cloneDeep((contractForm.get(bidOrOffer).get('DiscountTypes').value));
    discountTypeNameList.push({ 'DiscountTypeID': -2, 'DiscountTypeName': 'MinimumPaymentCommitment' });
    discountTypeNameList.forEach((el) => {
      const DiscGrid = contractForm.get(bidOrOffer).get((el.DiscountTypeID === -2) ?
        'MinimumPaymentCommitment' : this.getDiscountTypeName(el.DiscountTypeID, false)) as FormArray;
      DiscGrid.controls.forEach((ex) => {
        const exFormArray = ex as FormArray;
        const removingindex = [];
        exFormArray.controls.forEach((x, j) => {
          if (FlagToExclude === 1) {
            if (x.get('isExclude') && x.get('isExclude').value === 1) {
              removingindex.push(j);
            }
          } else {
            if ((x.get('isExclude') && x.get('isExclude').value === 1) || (x.get('isRemove') && x.get('isRemove').value === 1)) {
              removingindex.push(j);
            }
          }
          if (x.get('RegionCountryID') && x.get('RegionCountryID').value && x.get('RegionCountryID').value.length > 0) {
            const removingCountryindex = [];
            const exRegionCountryFormArray = x.get('RegionCountryID').value as any[];
            exRegionCountryFormArray.forEach((elementRegioncountry, k) => {
              if (FlagToExclude === 1) {
                if (elementRegioncountry.isExclude && elementRegioncountry.isExclude === 1) {
                  removingCountryindex.push(k);
                }
              } else {
                if ((elementRegioncountry.isExclude && elementRegioncountry.isExclude === 1)
                  || (elementRegioncountry.isRemove && elementRegioncountry.isRemove === 1)) {
                  removingCountryindex.push(k);
                }
              }
            });
            removingCountryindex.sort(function (a, b) { return b - a; });
            removingCountryindex.forEach((xindex) => {
              exRegionCountryFormArray.splice(xindex, 1);
            });
          }
        });
        removingindex.sort(function (a, b) { return b - a; });
        removingindex.forEach((xindex) => {
          exFormArray.removeAt(xindex);
        });
      });
    });

    const discountTypeM2M = contractForm.get(bidOrOffer).get('M2M') as FormGroup;
    if (discountTypeM2M && discountTypeM2M.value) {
      const discountTypeM2MNameList = lodash.cloneDeep((discountTypeM2M.get('DiscountTypes').value));
      if (discountTypeM2MNameList && discountTypeM2MNameList.length > 0) {
        if (discountTypeM2M.get('AccessFeeM2M').value && discountTypeM2M.get('AccessFeeM2M').value.length > 0) {
          discountTypeM2MNameList.push({ 'DiscountTypeID': -1, 'DiscountTypeName': 'AccessFeeM2M' });
        }
        if (discountTypeM2M.get('MinimumPaymentCommitmentM2M').value && discountTypeM2M.get('MinimumPaymentCommitmentM2M').value.length > 0) {
          discountTypeM2MNameList.push({ 'DiscountTypeID': -2, 'DiscountTypeName': 'MinimumPaymentCommitmentM2M' });
        }

        discountTypeM2MNameList.forEach((el) => {
          const DiscName = (el.DiscountTypeID === -1) ? 'AccessFeeM2M' : (el.DiscountTypeID === -2) ? 'MinimumPaymentCommitmentM2M' : this.getDiscountTypeName(el.DiscountTypeID, true);
          const DiscGrid = discountTypeM2M.get(DiscName) as FormArray;
          DiscGrid.controls.forEach((ex) => {
            const exFormArray = ex as FormArray;
            const removingindex = [];
            exFormArray.controls.forEach((x, j) => {
              if (FlagToExclude === 1) {
                if (x.get('isExclude') && x.get('isExclude').value === 1) {
                  removingindex.push(j);
                }
              } else {
                if ((x.get('isExclude') && x.get('isExclude').value === 1) || (x.get('isRemove') && x.get('isRemove').value === 1)) {
                  removingindex.push(j);
                }
              }
            });
            removingindex.sort(function (a, b) { return b - a; });
            removingindex.forEach((xindex) => {
              exFormArray.removeAt(xindex);
            });
          });
        });
      }
      const DiscGridAPNM2M = discountTypeM2M.get('APNList') as FormArray;
      if (DiscGridAPNM2M && DiscGridAPNM2M.length) {
        const removingindex = [];
        DiscGridAPNM2M.controls.forEach((ex, j) => {
          const exFormArray = ex as FormGroup;
          if (FlagToExclude === 1) {
            if (exFormArray.get('isExclude') && exFormArray.get('isExclude').value === 1) {
              removingindex.push(j);
            }
          } else {
            if ((exFormArray.get('isExclude') && exFormArray.get('isExclude').value === 1) ||
              (exFormArray.get('isRemove') && exFormArray.get('isRemove').value === 1)) {
              removingindex.push(j);
            }
          }
        });
        removingindex.sort(function (a, b) { return b - a; });
        removingindex.forEach((xindex) => {
          DiscGridAPNM2M.removeAt(xindex);
        });
      }

    }

    return true;
  }

  //#region  "TDR-490 Pricing Grid TAP code validation"
  checkSameOptionValues(contractForm: FormGroup, bidOrOffer: string, isM2M) {
    const duplicateTabs = [];

    const discType = [];

    const NoOfDiscountPeriods = contractForm.get('NoOfDiscountPeriods').value;
    const DiscTypeGroup = isM2M ? contractForm.get(bidOrOffer).get('M2M') : contractForm.get(bidOrOffer);
    let DiscountTypesID = lodash.cloneDeep(DiscTypeGroup.get('DiscountTypes').value.filter(x =>
      x.DiscountTypeID != 7));
    if (DiscountTypesID && DiscountTypesID.length > 0) {
      isM2M ?? DiscountTypesID.push({ 'DiscountTypeID': -1, 'DiscountTypeName': 'AccessFeeM2M' });
      DiscountTypesID.forEach((el, ind) => {
        const DiscName = this.getDiscountTypeName(el.DiscountTypeID, isM2M);
        const DiscGrid = DiscTypeGroup.get(DiscName) as FormArray;
        DiscGrid.value.forEach((ex, i) => {
          ex.forEach((x, j) => {
            const serviceID = [];
            let OperatorAffiliate = [];
            let OriginatedIn = [];
            let TerminatedID = 0;
            let Bands = [];
            let RegionCountryID: any[] = [];
            let TerminatedTypeID = null;
            let TerminatedName = '';
            let TrafficRate = null;
            let BalancedTrafficRate = null;
            let DiscountPercentage = null;
            if (x.hasOwnProperty('Services')) {
              x.Services.forEach((t) => {
                switch (t) {
                  case 8:
                    serviceID.push(1);
                    serviceID.push(2);
                    break;
                  case 9:
                    serviceID.push(3);
                    serviceID.push(7);
                    break;
                  case 10:
                    serviceID.push(4);
                    break;
                  case 11:
                    serviceID.push(5);
                    break;
                }
              });
            } else {
              serviceID.push(x.ServiceID);
            }
            if (x.hasOwnProperty('TerminatedID')) {
              TerminatedID = x.TerminatedID;
            }
            if (x.hasOwnProperty('OperatorAffiliate')) {
              OperatorAffiliate = x.OperatorAffiliate;
            } else if (x.hasOwnProperty('AppliesTo')) {
              OperatorAffiliate = x.AppliesTo;
            }
            if (x.hasOwnProperty('OriginatedIn')) {
              OriginatedIn = x.OriginatedIn;
            } else if (x.hasOwnProperty('RoamingOn')) {
              OriginatedIn = x.RoamingOn;
            }
            if (x.hasOwnProperty('Bands')) {
              Bands = x.Bands;
            }
            if (x.hasOwnProperty('TerminatedTypeID')) {
              TerminatedTypeID = x.TerminatedTypeID;
            } else {
              TerminatedTypeID = 1;
            }
            if (x.hasOwnProperty('TerminatedName')) {
              TerminatedName = x.TerminatedName;
            }
            if (x.hasOwnProperty('RegionCountryID')) {
              RegionCountryID = x.RegionCountryID;
            }
            if (x.hasOwnProperty('TrafficRate')) {
              TrafficRate = x.TrafficRate;
            }
            if (x.hasOwnProperty('BalancedTrafficRate')) {
              BalancedTrafficRate = x.BalancedTrafficRate;
            }
            if (x.hasOwnProperty('DiscountPercentage')) {
              DiscountPercentage = x.DiscountPercentage;
            }

            discType.push({
              'ServiceID': serviceID, 'TerminatedID': TerminatedID, 'TerminatedTypeID': TerminatedTypeID, 'TerminatedName': TerminatedName,
              'OriginatedIn': OriginatedIn, 'OperatorAffiliate': OperatorAffiliate, 'ID': DiscountTypesID[ind].DiscountTypeID, 'Name': DiscName,
              'PeriodNo': i, 'Bands': Bands, 'RegionCountryID': RegionCountryID, 'TrafficRate': TrafficRate,
              'BalancedTrafficRate': BalancedTrafficRate, 'DiscountPercentage': DiscountPercentage
            });

          });

        });
      });

      const PeriodGrid = lodash.values(lodash.groupBy(lodash.sortBy(discType, ['ID'], ['desc']), 'PeriodNo'));

      let OprtrOrigntd;
      let OprtrOrigntdRowList;
      if (bidOrOffer === 'Offer') {
        OprtrOrigntd = this.contractService.tabCodeListOffer;
      } else {
        OprtrOrigntd = this.contractService.tabCountryListBid;
      }
      OprtrOrigntdRowList = lodash.uniq(OprtrOrigntd.map(t => t.RowNo));

      for (let x = 0; x < NoOfDiscountPeriods; x++) {
        if (PeriodGrid.length > 0) {
          if (this.AtLeastAffiliatesOriginatedIn(bidOrOffer, OprtrOrigntd, OprtrOrigntdRowList, PeriodGrid, x)) {
            const isM2Mstr = isM2M ? 'M2M' : '';
            let WhichCommitment = DiscTypeGroup.get('MarketShare' + isM2Mstr).value;
            let CommitmentName = 'Market Share';
            let isVolumcommitment = false;
            if (!WhichCommitment || WhichCommitment.length === 0) {
              WhichCommitment = DiscTypeGroup.get('VolumeConditionalCommitment' + isM2Mstr).value;
              isVolumcommitment = true;
              CommitmentName = 'Volume Conditional Commitment';
              if (!WhichCommitment || WhichCommitment.length === 0) {
                WhichCommitment = DiscTypeGroup.get('MinimumPaymentCommitment' + isM2Mstr).value;
                CommitmentName = 'Minimum Payment Commitment';
              }
            }
            let isDupMini = this.checkDuplicateMinimum(WhichCommitment, x, CommitmentName, isVolumcommitment);
            if (isDupMini) {
              this.isValid = false;
              duplicateTabs.push(x + 1);
              return duplicateTabs;
            } else {
              if (isM2M) {
                isDupMini = this.checkDuplicateAccesFee(DiscTypeGroup.get('AccessFeeM2M').value, x, 'AccessFeeM2M');
              }
              if (isDupMini) {
                this.isValid = false;
                duplicateTabs.push(x + 1);
                return duplicateTabs;
              } else {
                const isDup = this.checkDuplicate(PeriodGrid, x, isM2Mstr);
                if (isDup) {
                  this.isValid = false;
                  duplicateTabs.push(x + 1);
                  return duplicateTabs;
                }
              }
            }
          } else {
            this.isValid = false;
            duplicateTabs.push(x + 1);
            return duplicateTabs;
          }
        }
      }
    }
  }

  checkDuplicate(discType, index, isM2Mstr) {
    if (discType.length > 0) {
      for (let i = 0; i < discType[index].length; i++) {
        if (discType[index][i].Name !== 'VolumeConditionalCommitment' + isM2Mstr) {
          for (let j = i; j < discType[index].length; j++) {
            if (i !== j && discType[index][j].Name !== 'VolumeConditionalCommitment' + isM2Mstr) {
              let Message = 'Duplicate record';
              let Match = false;
              let isOriginatedOperatorAffiliate = false;
              if (discType[index][i].OperatorAffiliate) {
                isOriginatedOperatorAffiliate = this.checkOriginatedOperatorAffiliate(discType[index], i, j);
              }

              if (discType[index][i].TerminatedName === '' || discType[index][j].TerminatedName === '') {
                if (isOriginatedOperatorAffiliate) {
                  Match = true;
                }
              } else {
                if (
                  (
                    ((discType[index][i].TerminatedID === -1 ||
                      (discType[index][i].TerminatedTypeID === 2 && discType[index][i].TerminatedID === 1))
                      && discType[index][j].TerminatedName !== '')
                    ||
                    ((discType[index][j].TerminatedID === -1 ||
                      (discType[index][j].TerminatedTypeID === 2 && discType[index][j].TerminatedID === 1))
                      && discType[index][i].TerminatedName !== '')
                  )
                  &&
                  isOriginatedOperatorAffiliate
                ) {
                  Match = true;
                } else {
                  if (discType[index][i].TerminatedTypeID === 2 && discType[index][j].TerminatedTypeID === 2) {
                    if (isOriginatedOperatorAffiliate &&
                      (discType[index][i].TerminatedName === discType[index][j].TerminatedName)) {
                      Match = true;
                    } else {
                      if (isOriginatedOperatorAffiliate &&
                        this.checkCustomeRegionCountryList(discType[index], i, j)) {
                        Match = true;
                        Message = 'Duplicate RegionCountry record';
                      }
                    }
                  } else if (isOriginatedOperatorAffiliate &&
                    (discType[index][i].TerminatedName === discType[index][j].TerminatedName)) {
                    Match = true;
                  }
                }
              }
              if (Match) {
                this.GridErrorDetail.push(this.getErrorRowMessage(discType[index], i, j, index, Message));
                return Match;
              }
            }
          }
          if (discType[index][i].Name.indexOf('BandedTiered') > -1 ||
            discType[index][i].Name.indexOf('FinancialDiscountFair') > -1) {
            if (this.checkBandDuplicate(discType[index], index, i)) {
              return true; /// Match
            }
          }
        }
      }
    }
    return false;
  }

  checkDuplicateMinimum(value, Period, CommitmentName, isVolumcommitment) {
    // Hybridge
    if (value.length > 0) {
      for (let i = 0; i < value[Period].length; i++) {
        for (let j = i; j < value[Period].length; j++) {
          if (i !== j) {
            let Match = false;
            if ((isVolumcommitment && value[Period][i].ServiceID === value[Period][j].ServiceID) ||
              !isVolumcommitment) {
              if (this.checkAppliesToRoamingOn(value[Period], i, j)) {
                Match = true;
                this.GridErrorDetail.push(this.getMinErrorRowMessage(value[Period], i, j, Period, CommitmentName));
              }
            }

            if (Match) {
              return Match;
            }
          }
        }
      }
    }
    return false;
  }


  checkDuplicateAccesFee(value, Period, CommitmentName) {
    // Hybridge
    if (value.length > 0) {
      for (let i = 0; i < value[Period].length; i++) {
        for (let j = i; j < value[Period].length; j++) {
          if (i !== j) {
            let Match = false;
            if (value[Period][i].ServiceID === value[Period][j].ServiceID) {
              if (this.checkAppliesToRoamingOn(value[Period], i, j)) {
                Match = true;
                this.GridErrorDetail.push(this.getMinErrorRowMessage(value[Period], i, j, Period, CommitmentName));
              }
            }
            if (Match) {
              return Match;
            }
          }
        }
      }
    }
    return false;
  }
  //#endregion

  // check same options -> M-Iot
  checkSameOptionValuesM2M(m2mFormGroup: FormGroup) {
    const duplicateTabs = [];
    let selectedDiscountType = 0;
    selectedDiscountType = m2mFormGroup.get('DiscountTypeID').value;
    const pricingModelName = this.getDiscountTypeName(selectedDiscountType, true);
    const discTypeArray = m2mFormGroup.get(pricingModelName) as FormArray;
    const isDup = this.checkDuplicateM2M(discTypeArray.value, Number(selectedDiscountType));
    if (isDup) {
      duplicateTabs.push(1);
    }
    return duplicateTabs;
  }

  checkDuplicateM2M(values: any, selectedDiscountType: Number) {
    // AYCE
    if (selectedDiscountType === 1) {
      for (let i = 0; i < values.length; i++) {
        for (let j = i; j < values.length; j++) {
          if (i !== j) {
            for (let k = 0; k < values[j].Services.length; k++) {
              const serviceID_k: Number = Number(values[j].Services[k]);
              const affiliatesID_i: Number = Number(values[i].AffiliatesID);
              const affiliatesID_j: Number = Number(values[j].AffiliatesID);

              if ((values[i].Services.filter(function (e) {
                return Number(e) === serviceID_k;
              }).length > 0)
                && (affiliatesID_i === 1 || affiliatesID_j === 1 || (affiliatesID_i === affiliatesID_j))) {
                return true;
              }
            }
          }
        }
      }
    } else if (selectedDiscountType === 4 || selectedDiscountType === 5) {
      // Banded Tiered, Flat Rate
      for (let i = 0; i < values.length; i++) {
        for (let j = i; j < values.length; j++) {
          if (i !== j) {
            const serviceID_i: Number = Number(values[i].ServiceID);
            const serviceID_j: Number = Number(values[j].ServiceID);
            const regionID_i: Number = Number(values[i].RegionID);
            const regionID_j: Number = Number(values[j].RegionID);
            // Voice MO
            if (serviceID_i === 1 || serviceID_j === 1) {
              if (serviceID_i === serviceID_j && (serviceID_i === 1 || serviceID_j === 1) &&
                (regionID_i === regionID_j && (regionID_i === 1 || regionID_j === 1))) {
                return true;
              } else if (serviceID_i === serviceID_j && regionID_i === regionID_j) {
                return true;
              } else if (serviceID_i === serviceID_j &&
                ((regionID_i !== regionID_j) && (regionID_i === 1 || regionID_j === 1))) {
                return true;
              }
            } else {
              // Check Duplicate rows for other values
              if ((serviceID_i === serviceID_j && regionID_i === regionID_j)
                || (serviceID_i === serviceID_j && (regionID_i === 1 || regionID_j === 1))) {
                return true;
              }
            }
          }
        }
        if (selectedDiscountType === 4) {
          if (this.checkBandDuplicateM2M(values, i)) {
            return true; /// Match
          }
        }
      }
    }
    return false;
  }

  AtLeastAffiliatesOriginatedIn(bidOrOffer, OprtrOrigntd,
    OprtrOrigntdRowList, PeriodGrid, x) {
    let selectedOperatorAffiliateList;
    const selectedOperatorAffiliate = lodash.uniq(lodash.flattenDeep(PeriodGrid[x].map(y =>
      (bidOrOffer === 'Offer') ? y.OperatorAffiliate : y.OriginatedIn)));
    selectedOperatorAffiliateList = lodash.uniq(OprtrOrigntd.filter(xop =>
      selectedOperatorAffiliate.includes((bidOrOffer === 'Offer') ? xop.TADIGID : xop.CountryID)).map(t => t.RowNo));

    if (selectedOperatorAffiliateList && OprtrOrigntdRowList.length !== selectedOperatorAffiliateList.length) {
      const error = new GridErrorDetail();
      error.PeriodID = x + 1;
      const item = lodash.difference(OprtrOrigntdRowList, selectedOperatorAffiliateList);
      const selectedItem = lodash.uniq(OprtrOrigntd.filter(xor => item.includes(xor.RowNo)).map(xname => xname.OperatorName));
      error.Message = `At least one service required for ` +
        selectedItem.toString() + ` in Period ${error.PeriodID}`;
      this.GridErrorDetail.push(error);
      return false;
    } else {
      return true;
    }

  }

  getFieldsLength(value) {
    let formFields: number;
    switch (value) {
      case 1:
        formFields = 0;
        break;
      case 2:
        formFields = 0;
        break;
      case 3:
        formFields = 0;
        break;
      case 4:
        formFields = 0;
        break;
      case 5:
        formFields = 0;
        break;
    }
    return formFields;
  }

  // START M2M
  discountTypeChangedM2M(newContractIOTForm: FormGroup, contractType: string, discountType: string, selectedValue) {
    this.resetTabsM2M(newContractIOTForm, discountType);

    const noOfFields = this.getIOTFieldsLength(Number(selectedValue));
    const discountTypeRate = this.getDiscountFieldsM2M(newContractIOTForm, discountType, Number(selectedValue));
    const formControls = this.getDiscountFormFields(newContractIOTForm, discountType, noOfFields, selectedValue, true);

    formControls.forEach(ele => {
      discountTypeRate.push(ele);
    });
  }

  getIOTFieldsLength(value) {
    let formFields: number;
    switch (value) {
      case 1:
        formFields = 0;
        break;
      case 5:
        formFields = 0;
        break;
      case 4:
        formFields = 0;
        break;
    }
    return formFields;
  }

  discFieldsM2M(discountType, copyField?: any[], values?, index?) {
    const number = Number(discountType);
    let formFields: FormGroup;
    switch (number) {
      case 1:
        formFields = this.bindFinancial(null);
        break;
      case 3:
        formFields = this.bindBalancedUnbalancedM2M(null);
        break;
      case 4:
        formFields = this.bindBandedTieredM2M(copyField, values, index);
        break;
      case 5:
        formFields = this.bindFlatRateM2M(null);
        break;
      case 6:
        formFields = this.bindVolumeConditionalCommitment(null, copyField);
        break;
      case 7:
        formFields = this.bindMarketShareCommitment(null, copyField);
        break;
      case 8:
        formFields = this.bindDiscountInvoiceM2M(null);
        break;
      case 9:
        formFields = this.bindFinancialWithFairM2M(null);
        break;
      case 10:
        formFields = this.bindFinancialDiscountFairM2M(copyField);
        break;
      case -1:
        formFields = this.bindAccessFeeM2M(null);
        break;
    }
    return formFields;
  }

  sortFormFieldsIOT(newContractIOTForm: FormGroup, contractType: string, discountType: string, formArrayFields, discountTypeValue: number) {
    let controls = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeValue);
    const newcontrols = new FormArray([]);
    const values = [];
    if (formArrayFields && formArrayFields.length > 0) {
      formArrayFields.forEach((ele: FormGroup, i) => {
        values.push(ele.value);
      });
      formArrayFields.forEach((ele: FormGroup, i) => {
        const formFields = this.discFieldsM2M(discountTypeValue, null, values, i);
        formFields.setValue(ele.value);
        newcontrols.insert(i, formFields);
      });
      controls = newcontrols;
    }
  }

  addServiceOfferAccessIOT(newContractIOTForm: FormGroup,
    contractType: string, discountType: string, discountTypeValue: number, valueObj?: any, index?, typeRates?) {

    // const offerFields: FormArray = this.getDiscountFieldsM2M(newContractIOTForm, discountType);
    const controls = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeValue);
    //const discountTypeID = newContractIOTForm.get(discountType).get('M2M').get('DiscountTypeID').value;
    const formGroup = this.discFieldsM2M(discountTypeValue, null, typeRates, index) as FormGroup;
    formGroup.get('OrderIndex').patchValue(this.findmaxorderindex(controls.value) + 1);
    if (formGroup.get('CurrencyID')) {
      formGroup.get('CurrencyID').patchValue(newContractIOTForm.get(discountType + 'DefaultCurrency').value);
    }
    formGroup.get('CanDelete').patchValue(1);
    if (valueObj) {
      formGroup.patchValue(valueObj);
    }
    controls.push(formGroup);
  }

  copyOfferControlIOT(newContractIOTForm: FormGroup, contractType: string, discountType: string, i: number, discountTypeValue: number) {
    const offerFields: FormArray = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeValue);
    const copiedControl = offerFields.controls[i] as FormGroup;
    const formFields = this.discFieldsM2M(discountTypeValue, copiedControl.value.Bands);
    formFields.setValue(copiedControl.value);
    formFields.get('OrderIndex').patchValue(this.findmaxorderindex((offerFields.value)) + 1);
    formFields.get('CanDelete').patchValue(1);
    offerFields.insert(i + 1, formFields);
  }

  removeServiceOfferAccessIOT(newContractIOTForm: FormGroup, contractType: string, discountType: string, discountTypeID: number, i: number, ActionType = 0) {
    const controls = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID);
    if (controls.controls[i].get('CanDelete').value === 1) {
      ActionType = -1;
    }
    switch (ActionType) {
      case -1:
        controls.removeAt(i);
        break;
      default:
        controls.controls[i].get('isRemove').patchValue(ActionType);
        controls.controls[i].get('isRemove').updateValueAndValidity();
        break;
    }

  }

  formFieldsIOT(newContractIOTForm: FormGroup, contractType: string, discountType: string, discountTypeID: number) {
    const controls = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID);
    return controls.controls;
  }

  // reset all tabs
  resetIOTFormFields(newContractIOTForm: FormGroup, contractType: string, discountType: string, discountTypeID: number) {
    const controls = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID);
    controls.controls = [];
  }

  // reset m2m tabs
  resetTabsM2M(newContractIOTForm: FormGroup, discountType: string) {

    const minimumPaymentCommitment = newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray;
    minimumPaymentCommitment.controls = [];
    minimumPaymentCommitment.patchValue([]);

    const ayceControls = newContractIOTForm.get(discountType).get('M2M').get('FinancialM2M') as FormArray;
    ayceControls.controls = [];
    ayceControls.patchValue([]);
    const balancedControls = newContractIOTForm.get(discountType).get('M2M').get('BalancedUnbalancedM2M') as FormArray;
    balancedControls.controls = [];
    balancedControls.patchValue([]);
    const bandedControls = newContractIOTForm.get(discountType).get('M2M').get('BandedTieredM2M') as FormArray;
    bandedControls.controls = [];
    bandedControls.patchValue([]);
    const flatrateControls = newContractIOTForm.get(discountType).get('M2M').get('FlatRateM2M') as FormArray;
    flatrateControls.controls = [];
    flatrateControls.patchValue([]);
    const VolumeConditionalCommitmentControls = newContractIOTForm.get(discountType).get('M2M').get('VolumeConditionalCommitmentM2M') as FormArray;
    VolumeConditionalCommitmentControls.controls = [];
    VolumeConditionalCommitmentControls.patchValue([]);
    const MarketShareControls = newContractIOTForm.get(discountType).get('M2M').get('MarketShareM2M') as FormArray;
    MarketShareControls.controls = [];
    MarketShareControls.patchValue([]);
    const DiscountInvoiceControls = newContractIOTForm.get(discountType).get('M2M').get('DiscountInvoiceM2M') as FormArray;
    DiscountInvoiceControls.controls = [];
    DiscountInvoiceControls.patchValue([]);
    const FinancialWithFairControls = newContractIOTForm.get(discountType).get('M2M').get('FinancialWithFairM2M') as FormArray;
    FinancialWithFairControls.controls = [];
    FinancialWithFairControls.patchValue([]);
    const FinancialDiscountFairControls = newContractIOTForm.get(discountType).get('M2M').get('FinancialDiscountFairM2M') as FormArray;
    FinancialDiscountFairControls.controls = [];
    FinancialDiscountFairControls.patchValue([]);
    const DiscTypelen = newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value;
    // if (!(DiscTypelen && DiscTypelen.length > 0)) {
    //   const AccessFeeM2MControls = newContractIOTForm.get(discountType).get('M2M').get('AccessFeeM2M') as FormArray;
    //   AccessFeeM2MControls.controls = [];
    //   AccessFeeM2MControls.patchValue([]);
    // }
    const AccessFeeM2MControls = newContractIOTForm.get(discountType).get('M2M').get('AccessFeeM2M') as FormArray;
    AccessFeeM2MControls.controls = [];
    AccessFeeM2MControls.patchValue([]);


  }


  getOfferValues(DiscountTypeM2M, values, isBid) {
    const typeArray = [];
    if (values) {
      values.forEach((disTypeRate) => {
        switch (DiscountTypeM2M) {
          case 1:
            const serviceArray = [];
            if (disTypeRate.service) {
              disTypeRate.service.forEach(ele => {
                serviceArray.push(String(ele.EnumID));
              });
            }
            const output: DiscTypeM2MFinancial = {
              ID: 0,
              Service: serviceArray,
              Affiliates: disTypeRate.affiliates,
              Currency: disTypeRate.currency,
              AYCERate: disTypeRate.ayceRate,
              IsActive: false,
              isBid: isBid
            };

            typeArray.push(output);
            break;
          case 2:
            const output1: DiscTypeM2MFlatRate = {
              ID: 0,
              Service: disTypeRate.service,
              Region: disTypeRate.region,
              Currency: disTypeRate.currency,
              TrafficRate: disTypeRate.trafficRate,
              Per: disTypeRate.per,
              ChargingInterval: disTypeRate.chargingInterval,
              ParentId: 0,
              IsActive: false,
              isBid: isBid
            };
            typeArray.push(output1);
            break;
          case 3:
            disTypeRate.bands.forEach(item => {
              const output2: DiscTypeM2MBandedTiered = {
                ID: 0,
                Service: disTypeRate.service,
                Region: disTypeRate.region,
                Currency: disTypeRate.currency,
                // BandThresholdType: disTypeRate.bandThresholdType,
                band: item.band,
                bandThreshold: item.bandThreshold,
                backToFirst: item.backToFirst,
                Per: disTypeRate.per,
                ChargingInterval: disTypeRate.chargingInterval,
                ThresholdCalculated: disTypeRate.thresholdCalculated,
                ThresholdCalculationType: disTypeRate.thresholdCalculatedImsi,
                IMSIApplicationFee: disTypeRate.imsiAccessFee,
                ParentId: 0,
                IsActive: false,
                isBid: isBid
              };
              typeArray.push(output2);
            });
            break;
        }
      });

    }
    return typeArray;
  }

  // getM2MDiscount(index, MIOTValues, disctypeM2Moffer, isBid) {
  //   const accessFeeM2M = new DisctypeM2MAccessFee();
  //   accessFeeM2M.ID = 0;
  //   accessFeeM2M.Currency = MIOTValues.accessFee.currency;
  //   accessFeeM2M.RatePerIMSI = MIOTValues.accessFee.ratePerIMSI;
  //   accessFeeM2M.ChargingInterval = MIOTValues.accessFee.chargingInterval;
  //   accessFeeM2M.TransactionType = null;
  //   accessFeeM2M.IsActive = false;
  //   accessFeeM2M.isBid = isBid;
  //   disctypeM2Moffer.AccessFeeM2M.push([accessFeeM2M]);
  // }

  // discountTypeChangedNBIot(newContractIOTForm: FormGroup, type: string, option: string, fieldArrayLength, discTyepeChanged?: boolean) {
  //   const fieldArray = this.getFieldsLength(Number(fieldArrayLength));
  //   const rollOvers = newContractIOTForm.get('NoOfDiscountPeriods').value;
  //   let autoRenewal = newContractIOTForm.get('autoRenewal').value;
  //   autoRenewal = autoRenewal === true || autoRenewal === 'true' ? true : false;
  //   let newTabsCount = 0;

  //   if (!discTyepeChanged) {
  //     const tabsCount = this.getExistingTabs(newContractIOTForm, type, false);
  //     newTabsCount = rollOvers - tabsCount;
  //     if (newTabsCount <= 0) {
  //       const removeTabsCount = newTabsCount * (-1);
  //       for (let index = 1; index <= Number(removeTabsCount); index++) {
  //         const eXTabsCount = this.getExistingTabs(newContractIOTForm, type, false);
  //         if (eXTabsCount > 1) {
  //           this.removeTabs(newContractIOTForm, type, tabsCount - index);
  //         }
  //       }
  //       return;
  //     }
  //   } else {
  //     this.resetTabs(newContractIOTForm, type);
  //     newTabsCount = rollOvers;
  //   }

  // }

  createExclusionsControls(ele: any) {
    return new FormGroup({
      Exclusion: new FormControl(false),
      ExclusionName: new FormControl(ele.DisplayName),
      ExclusionID: new FormControl(ele.EnumID)
    });
  }

  resetM2MTAPCodeAPNList(miotFormGroup: FormGroup) {
    if (miotFormGroup.get('TAPCodeList')) {
      const TapCodeControlArray = miotFormGroup.get('TAPCodeList') as FormArray;
      TapCodeControlArray.controls = [];
      TapCodeControlArray.patchValue([]);
      miotFormGroup.get('TAPCodeList').clearValidators();
      miotFormGroup.get('TAPCodeList').updateValueAndValidity();
    }
    if (miotFormGroup.get('APNList')) {
      const apnControlArray = miotFormGroup.get('APNList') as FormArray;
      apnControlArray.controls = [];
      apnControlArray.patchValue([]);
    }
  }

  resetM2MOther(miotFormGroup) {
    miotFormGroup.get('IsTAP').setValue(false);
    miotFormGroup.get('IsAPN').setValue(false);
    miotFormGroup.get('IsIMSI').setValue(false);
    miotFormGroup.get('IsAccessTraffic').setValue(false);
    miotFormGroup.get('AccessFeeType').setValue(1);
  }

  /* START - Form Submit */
  FormSubmit(contractForm, DealType: number, isoffline: boolean, isFullSave: boolean, isValidateDuplicate: boolean): Boolean {

    if (this.removeInactivePricingRow(contractForm, 'Offer', 0) && this.removeInactivePricingRow(contractForm, 'Bid', 0)) {

      const values = contractForm.value;
      this.isValid = true;
      let isTemplateRequired = false;
      if (!isoffline) {
        isTemplateRequired = true;
        contractForm.get('TemplateID').setValidators([Validators.required]);
        contractForm.get('TemplateID').updateValueAndValidity();
        this.checkTemplatevalue(contractForm);
      } else {
        contractForm.get('TemplateID').clearValidators();
        contractForm.get('AbusiveTrafficRate').clearValidators();
        contractForm.get('AppFixDelayPayRate').clearValidators();
      }
      if (this.isValid) {
        if (isFullSave) {
          this.isValid = this.isFormValid(contractForm, [], []);
        } else {
          this.isValid = this.isFormValidOnNew(contractForm, isTemplateRequired);
        }

        if (this.isValid) {
          this.compareDates(values.StartDate, values.EndDate);
          if (this.isValid) {
            this.validationTAPCodes(contractForm);
            if (this.isValid) {
              if ((contractForm.get('TypeID').value === 2 && contractForm.get('DirectionID').value === 2) ||
                contractForm.get('TypeID').value === 1) {
                if (DealType == 1) {
                  this.ValidContractSideGrid(contractForm, 'Bid', isFullSave, isValidateDuplicate, false);
                }
                if (this.isValid && (contractForm.get('Bid').get('IsIncludeM2M').value || DealType != 1)) {
                  this.ValidContractSideGrid(contractForm, 'Bid', isFullSave, isValidateDuplicate, true);
                }
              }
              if (this.isValid) {
                if ((contractForm.get('TypeID').value === 2 && contractForm.get('DirectionID').value === 1) ||
                  contractForm.get('TypeID').value === 1) {
                  if (DealType == 1) {
                    this.ValidContractSideGrid(contractForm, 'Offer', isFullSave, isValidateDuplicate, false);
                  }
                  if (this.isValid && (contractForm.get('Offer').get('IsIncludeM2M').value || DealType != 1)) {
                    this.ValidContractSideGrid(contractForm, 'Offer', isFullSave, isValidateDuplicate, true);
                  }
                }
              }
              if (isoffline && this.isValid && isFullSave) {
                let cDocument = contractForm.get('ContractDocument');
                if (!(cDocument.valid && cDocument.value)) {
                  cDocument = contractForm.get('OfflineFileName');
                  if (!(cDocument.valid && cDocument.value)) {
                    this.isValid = false;
                    this.errorTitle = 'Warning';
                    this.errorMsgs = 'Contract Document is required !';
                    //Offline-file-upload-wraper
                    this.showErrorPopup('Offline-file-upload-wraper');
                  }
                }
              }
            } else {
              this.showErrorPopup();
            }
          } else {
            this.errorMsgs = 'EndDate must be greater than StartDate !';
            this.showErrorPopup();
          }
        } else {
          this.showErrorPopup();
          // this.showErrorPopup(this.ErrorKeyClass);
        }
      } else {
        this.showErrorPopup();
        // this.showErrorPopup(this.ErrorKeyClass);
      }
      this.resetErrorMsgs();
      return this.isValid;

    }
  }

  /* START - Form Submit */
  FormSubmitTrade(contractForm, TradeType: number, isSender, isAccept, isFullSave: boolean, isValidateDuplicate: boolean): Boolean {
    if (this.removeInactivePricingRow(contractForm, 'Offer', 0) && this.removeInactivePricingRow(contractForm, 'Bid', 0)) {
      const values = contractForm.value;
      let isBidRequired = false;
      let isOfferRequired = false;
      this.isValid = true;
      this.validationTAPCodes(contractForm);
      if (this.isValid) {
        if (isAccept === 1) {
          this.checkTemplatevalue(contractForm);
        } else {
          contractForm.get('AbusiveTrafficRate').clearValidators();
          contractForm.get('AppFixDelayPayRate').clearValidators();
        }
        this.compareDates(values.StartDate, values.EndDate);
        if (this.isValid) {
          if (isFullSave) {
            this.isValid = this.isFormValid(contractForm, [], []);
          } else {
            //this.isValid = this.isFormValidOnNew(contractForm, true);
          }
          if (this.isValid) {

            if (contractForm.get('TypeID').value === 1) {
              isBidRequired = true;
              isOfferRequired = true;
              if (isAccept === 0) {
                if (isSender === 1) {
                  isBidRequired = false;
                } else {
                  isOfferRequired = false;
                }
                // isBidRequired = false;
              }
            } else {
              if (contractForm.get('DirectionID').value === 1) {
                isOfferRequired = true;
              } else {
                isBidRequired = true;
              }
            }

            if (this.isValid && (isBidRequired || contractForm.get('TypeID').value === 1)) {
              if (TradeType == 1) {
                this.ValidContractSideGrid(contractForm, 'Bid', (isFullSave) ? isBidRequired : false, isValidateDuplicate, false);
              }
              if (this.isValid && (contractForm.get('Bid').get('IsIncludeM2M').value || TradeType != 1)) {
                this.ValidContractSideGrid(contractForm, 'Bid', (isFullSave) ? isBidRequired : false, isValidateDuplicate, true);
              }
            }
            if (this.isValid && (isOfferRequired || contractForm.get('TypeID').value === 1)) {
              if (TradeType == 1) {
                this.ValidContractSideGrid(contractForm, 'Offer', (isFullSave) ? isOfferRequired : false, isValidateDuplicate, false);
              }
              if (this.isValid && (contractForm.get('Offer').get('IsIncludeM2M').value || TradeType != 1)) {
                this.ValidContractSideGrid(contractForm, 'Offer', (isFullSave) ? isOfferRequired : false, isValidateDuplicate, true);
              }
            }
          } else { this.showErrorPopup(); return false; }
        } else {
          this.errorMsgs = 'End Date must be greater than Start Date.';
          this.showErrorPopup();
        }
      } else {
        this.showErrorPopup();
      }
      if (this.isValid) { return this.isValid; } else { return false; }
      this.resetErrorMsgs();
    }
  }

  /* START - TAP Codes validations */
  validationTAPCodes(contractForm) {
    const _tempObjectTradingEntity = [...contractForm.get('TradingEntityTADIGCodes').value];
    const _tempObjectCounterParty = [...contractForm.get('CounterPartyTADIGCodes').value];

    const isTradingEntity = _tempObjectTradingEntity.filter(x => x.IsSelected === true);
    const isCounterParty = _tempObjectCounterParty.filter(x => x.IsSelected === true);
    if (isTradingEntity.length === 0 || isCounterParty.length === 0) {
      this.errorTitle = 'Amend TAP Codes';
      if (isTradingEntity.length === 0) {
        this.errorMsgs = 'Please select TADIG Code of Trading Entity.';
      } else {
        this.errorMsgs = 'Please select TADIG Code of Counterparty.';
      }
      this.isValid = false;
    } else {
      this.checkCounterPartyTADIGCodes(_tempObjectCounterParty);
      this.checkCounterPartyDuplicateOperator(_tempObjectCounterParty);
    }
  }
  checkCounterPartyDuplicateOperator(_tempObjectCounterParty, isPartialSave = false) {
    let CounterParty = _tempObjectCounterParty;
    CounterParty = this.utility.getDuplicate(CounterParty, ['OperatorId', 'TadigCode']);
    if (CounterParty && CounterParty.length == 0) {
      this.isValid = true;
    } else {
      if (!isPartialSave) {
        const errormsg = 'Please select unique Counterparty';
        let error_class = 'CounterPartyClass';
        const firstElementWithError = document.querySelectorAll('.' + (error_class ? error_class : 'ng-invalid'));
        this.utility.displaySwalPopup('', 'Please select unique Counterparty.', 'warning', firstElementWithError, false,
          '', false, null, errormsg);
      }
      this.isValid = false;
    }
    return this.isValid;
  }

  isDiscTaken(contractForm: any, DiscType: string, isM2M): any {
    let result: any = {};
    result.DiscTaken = false;
    result.ComtTaken = false;
    result.isComtWrong = false;
    const CommitmentDiscTypeList = [6, 7];
    let discountTypeID = isM2M ? (contractForm.get(DiscType).get('M2M').get('DiscountTypes').value as any[]) : (contractForm.get(DiscType).get('DiscountTypes').value as any[]);
    if (discountTypeID && discountTypeID.length) {
      let DiscTakenList = discountTypeID.filter(x => !CommitmentDiscTypeList.includes(x.DiscountTypeID));
      let ComtTakenList = discountTypeID.filter(x => CommitmentDiscTypeList.includes(x.DiscountTypeID));

      if (DiscTakenList && DiscTakenList.length) {
        result.DiscTaken = true;
      }
      if (ComtTakenList && ComtTakenList.length) {
        result.ComtTaken = true;
        if (!(DiscTakenList && DiscTakenList.length)) {
          result.isComtWrong = true;
        }
      }
    }
    return result;
  }

  checkCounterPartyTADIGCodes(_tempObjectCounterParty) {
    const _maxRawNo = Math.max.apply(null, _tempObjectCounterParty.map(x => x.RowNo));
    let isCounterParty = [];
    for (let index = 1; index <= _maxRawNo; index++) {
      isCounterParty = _tempObjectCounterParty.filter(x => x.IsSelected === true && x.RowNo === index);
      if (isCounterParty.length === 0) {
        const _temp = _tempObjectCounterParty.filter(x => x.RowNo === index).map(x => x.TadigCode);
        this.errorMsgs = '';
        if (_temp.length === 1) {
          this.errorMsgs = 'Please select TADIG Code <b style="color:#3084d6">' + _temp.join(', ') + '</b> of Counterparty.';
        } else {
          this.errorMsgs = 'Please select at least one TADIG Code <b style="color:#3084d6">' + _temp.join(', ') + '</b> of Counterparty.';
        }
        this.isValid = false;
        break;
      } else {
        this.isValid = true;
      }
    }
  }

  /* START - M2M validations */
  validationM2M(M2MFormGroup, ContractDirection, isRateRequired: boolean = true, isValidateDuplicate = true) {
    if (M2MFormGroup.get('IsIMSI').value || M2MFormGroup.get('IsTAP').value ||
      M2MFormGroup.get('IsAPN').value || (M2MFormGroup.get('DiscountTypes').value && M2MFormGroup.get('DiscountTypes').value.length)) {
      // if (this.isValid) { this.isFormValidM2M(M2MFormGroup, ContractDirection, isRateRequired); }
      if (this.isValid) { this.validateApnListRows(M2MFormGroup, ContractDirection, isRateRequired); }
      // if (this.isValid) { this.validatePricingModelRows(M2MFormGroup, ContractDirection); }
      // if (this.isValid && isValidateDuplicate) { this.ValidateDuplicateRows(M2MFormGroup, ContractDirection); }
    } else {
      this.errorTitle = ContractDirection + ' M-IoT';
      this.errorMsgs = 'M2M Data is required !';
      this.showErrorPopup();
      this.isValid = false;
    }
    return this.isValid;
  }

  public isFormValidM2M(group: FormGroup | FormArray, ContractDirection, isRateRequired: boolean) {
    if (this.isValid) {
      for (const key of Object.keys(group.controls)) {
        const abstractControl = group.controls[key];

        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          this.isFormValidM2M(abstractControl, ContractDirection, isRateRequired);
        } else {
          if (!abstractControl.valid) {
            if ((key !== 'TrafficRate' && key !== 'AYCERate' && key !== 'BalancedTrafficRate'
              && key !== 'UnbalancedTrafficRate' && key !== 'RatePerIMSI' && key !== 'BandThreshold') || isRateRequired) {
              const keyStr = key.charAt(0).toUpperCase() + key.slice(1);
              const value = keyStr.replace(/([A-Z])/g, ' $1').trim();
              const errMessage = this.getValidatorErrorMessageM2M(keyStr);
              this.errorTitle = ContractDirection + ' M-IoT';
              this.errorMsgs = errMessage;
              this.showErrorPopup();
              this.isValid = false;
              return this.isValid;

            }
            abstractControl.markAsTouched({ onlySelf: true });
          } else { this.isValid = true; }
        }
        if (!this.isValid) {
          break;
        }
      }
    }

    return this.isValid;
  }

  getValidatorErrorMessageM2M(validatorName: string) {
    const config = {
      'TadigCode': 'TAP Code is required!',
      'TAPCodeList': 'TAP Code is required!',
      'IMSIFileRange': 'IMSI Codes file is required!',
      'APNCode': 'APN Code is required!',
      'Services': 'Service(s) is required!',
      'ServiceID': 'Service is required!',
      'RegionID': 'Region is required!',
      'AffiliatesID': 'Affiliates is required!',
      'CurrencyID': 'Currency is required!',
      'BandThresholdTypeID': 'Band Threshold Type is required!',
      'TrafficRate': 'Traffic Rate is required!',
      'BandThreshold': 'Band Threshold is required!',
      'PerUnitID': 'Per: is required!',
      'ChargingIntervalID': 'Charging Interval is required!',
      'ThresholdCalculatedID': 'Threshold Calculated is required!',
      'ThresholdCalculationTypeID': 'Threshold calculated per IMSI or aggregated is required!',
      'IMSIApplicationFeeID': 'IMSI Acess fee applicable is required!',
      'AYCERate': 'AYCE Rate is required!',
      'RatePerIMSI': 'Network Access Fee - Rate per IMSI is required!',
      'AccessFeeCurrencyID': 'Network Access Fee - Currency is required!',
      'TADIGID': 'Tadig ID is required!',
      'TapID': 'TAP Code is required!',
    };
    return config[validatorName];
  }

  private validateApnListRows(M2MFormGroup, ContractDirection, isRateRequired: boolean = true) {
    if (this.isValid) {
      const apnValue = M2MFormGroup.get('IsAPN').value;
      const apnList = M2MFormGroup.get('APNList').value;
      if (apnValue === true) {
        if (!apnList.length) {
          this.errorTitle = ContractDirection + ' M-IoT';
          this.errorMsgs = 'Please add records for APN list!';
          this.showErrorPopup();
          this.isValid = false;
        } else {
          this.isFormValidM2M(M2MFormGroup.get('APNList'), ContractDirection, isRateRequired);
        }
      }
    }
  }

  private validatePricingModelRows(M2MFormGroup, ContractDirection) {
    if (this.isValid) {
      const selectedPricingModelValue = M2MFormGroup.get('DiscountTypeID').value;
      if (selectedPricingModelValue) {
        const pricingModelName = this.getDiscountTypeName(selectedPricingModelValue, true);
        if (pricingModelName !== '') {
          const pricingModelList = M2MFormGroup.get(pricingModelName).value;
          if (selectedPricingModelValue && selectedPricingModelValue > 0) {
            if (!pricingModelList.length) {
              this.errorTitle = ContractDirection + ' M-IoT';
              this.errorMsgs = 'Please add records for Pricing Model!';
              this.showErrorPopup();
              this.isValid = false;
            }
          }
        }
      }
    }
  }

  private ValidateDuplicateRows(M2MFormGroup, ContractDirection) {
    if (this.isValid) {
      if (M2MFormGroup.get('DiscountTypes').value && M2MFormGroup.get('DiscountTypes').value.length > 0) {
        const bidTypeDuplicateArray = this.checkSameOptionValuesM2M(M2MFormGroup);
        if (bidTypeDuplicateArray && bidTypeDuplicateArray.length) {
          this.errorTitle = ContractDirection + ' M-IoT';
          this.errorMsgs = 'Duplicate record(s) found in Pricing Data !';
          this.showErrorPopup();
          this.isValid = false;
        }
      }
    }
  }
  ValidContractSideGrid(contractForm, ContractDirection, isRateRequired: boolean, isValidateDuplicate: boolean, isM2M: boolean) {
    const m2mClass = isM2M ? 'M2M' : '';
    let DiscFormGroup;
    const OfferBidResult = this.isDiscTaken(contractForm, ContractDirection, isM2M);
    if (isM2M) {
      DiscFormGroup = contractForm.get(ContractDirection).get('M2M');
    } else {
      DiscFormGroup = contractForm.get(ContractDirection);
    }
    const discountTypeList: any[] = lodash.cloneDeep(DiscFormGroup.get('DiscountTypes').value);
    if (OfferBidResult.DiscTaken) {
      if (isM2M && DiscFormGroup.get('AccessFeeM2M').value && DiscFormGroup.get('AccessFeeM2M').value.length > 0) {
        discountTypeList.push({ 'DiscountTypeID': -1, 'DiscountTypeName': 'AccessFeeM2M' });
      }
      for (let index = 0; index < discountTypeList.length; index++) {
        const discountTypeID = discountTypeList.map((res) => res.DiscountTypeID);
        let SelectedDiscountTypeName = [];
        discountTypeID.forEach(item => {
          SelectedDiscountTypeName.push(this.getDiscountTypeName(item, isM2M));
        });

        if (this.isValid) {
          this.checkThresholdFixPayValues(contractForm);
          if (this.isValid) {
            this.SetUnilateralOfferBidValidations(contractForm, isM2M);
            this.errorTitle = this.getValidatorErrorTitle(ContractDirection, isM2M);
            if (ContractDirection === 'Bid') {
              this.isValid = this.isFormValid(DiscFormGroup as FormArray, SelectedDiscountTypeName, []);
            } else {
              this.isValid = this.isFormValid(DiscFormGroup as FormArray, [], SelectedDiscountTypeName);
            }
            if (this.isValid) {
              if (!SelectedDiscountTypeName) {
                SelectedDiscountTypeName = this.getDiscountTypeName(DiscFormGroup.get('DiscountTypes').value, isM2M);
              }

              if (this.isValid) {
                this.checkGridRowCount(DiscFormGroup.get(SelectedDiscountTypeName[index]) as FormArray,
                  ContractDirection);
                // remove minimum payment commitment validation
                // if (SelectedDiscountTypeName.filter(x => x === 'Financial').length === 0) {
                //   this.checkGridRowCount(DiscFormGroup.get('MinimumPaymentCommitment') as FormArray,
                //     ContractDirection);
                // }
              }

              if (this.isValid) {
                const invalidminGridRows = this.isFormGridValid(DiscFormGroup.
                  get('MinimumPaymentCommitment' + m2mClass), ContractDirection, isRateRequired, isM2M);
                let invalidBidGridRows = [];
                if (!invalidminGridRows.length) {
                  invalidBidGridRows = this.isFormGridValid(DiscFormGroup.
                    get(SelectedDiscountTypeName[index]), ContractDirection, isRateRequired, isM2M);
                } else {
                  invalidBidGridRows = invalidminGridRows;
                }

                if (!invalidBidGridRows.length) {
                  this.isValid = true;
                  //#region  "TDR-490 Pricing Grid TAP code validation"
                  this.GridErrorDetail = [];
                  let bidTypeDuplicateArray = null;
                  // #endregion
                  if (isValidateDuplicate) {
                    bidTypeDuplicateArray = this.checkSameOptionValues(contractForm, ContractDirection, isM2M);
                  }
                  if ((!(bidTypeDuplicateArray && bidTypeDuplicateArray.length) || !isValidateDuplicate)) {

                    if (this.Allowsplit) {
                      this.ValidateSplitRows(contractForm, ContractDirection, isM2M);
                    }

                  } else {
                    //#region  "TDR-490 Pricing Grid TAP code validation"
                    this.errorMsgs = ``;
                    bidTypeDuplicateArray.forEach((el, ind) => {
                      this.GridErrorDetail.filter(x => x.PeriodID === el).forEach(element => {
                        this.errorMsgs = this.errorMsgs + `<br/>${element.Message}`;
                      });
                    });
                    //#endregion
                    this.clickTabs(ContractDirection, isM2M);
                    const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
                    this.showErrorPopup(_class);
                    const ID = invalidBidGridRows && invalidBidGridRows.length > 0 ? invalidBidGridRows[0] : bidTypeDuplicateArray[0];
                    const bidTabId = ContractDirection + String(ID) + m2mClass + '-link';
                    const bidTabElement: HTMLElement = document.getElementById(bidTabId) as HTMLElement;
                    if (bidTabElement) {
                      bidTabElement.click();
                    }
                  }
                } else {
                  // const clickTabElement: HTMLElement = document.getElementById(ContractDirection) as HTMLElement;
                  // if (clickTabElement) {
                  //   clickTabElement.click();
                  // }
                  this.clickTabs(ContractDirection, isM2M);
                  this.errorMsgs = `Period ${invalidBidGridRows[0]} : ${invalidBidGridRows[1]}`;
                  const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
                  this.showErrorPopup(_class);
                  const bidTabId = ContractDirection + String(invalidBidGridRows[0]) + m2mClass + '-link';
                  const bidTabElement: HTMLElement = document.getElementById(bidTabId) as HTMLElement;
                  if (bidTabElement) {
                    bidTabElement.click();
                  }
                  return false;
                }
              } else {
                const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
                this.showErrorPopup(_class); return false;
              }
            } else {
              if (isM2M && ContractDirection) {
                this.clickTabs(ContractDirection, isM2M);
                const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
                this.showErrorPopup(_class);
              } else {
                this.showErrorPopup();
              }
              return false;
            }

          }
        } else {
          if (ContractDirection) {
            this.clickTabs(ContractDirection, isM2M);
            const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
            this.showErrorPopup(_class);
          } else {
            this.showErrorPopup();
          }
          return false;
        }
      }

      // Suresh M2M need to move above
      if (this.isValid && isM2M) {
        const M2MFormGroup = contractForm.get(ContractDirection).get('M2M');
        this.isValid = this.validationM2M(M2MFormGroup, ContractDirection, isRateRequired, isValidateDuplicate);
        if (!this.isValid) {
          const clickTab = ContractDirection === 'Bid' ? 'Bid-MIoT' : 'Offer-MIoT';
          const clickTabElement: HTMLElement = document.getElementById(clickTab) as HTMLElement;
          if (clickTabElement) {
            clickTabElement.click();
          }
          this.clickTabs(ContractDirection, isM2M);
        }
      }
    } else {
      if (isRateRequired || (!isRateRequired && OfferBidResult.isComtWrong)) {
        this.errorTitle = this.getValidatorErrorTitle(ContractDirection, isM2M);
        this.errorMsgs = 'Discount Type is required!';
        this.clickTabs(ContractDirection, isM2M);
        this.showErrorPopup(ContractDirection + 'DiscountType');
        this.isValid = false;
        return false;
      } else {
        this.isValid = true;
        return true;
      }
    }
  }

  clickTabs(ContractDirection, isM2M) {
    const m2mClass = isM2M ? 'M2M' : '';
    const tabElementcol: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(ContractDirection + 'Click') as HTMLCollectionOf<HTMLElement>;
    if (tabElementcol && tabElementcol.length > 0) {
      tabElementcol[0].click();
    }
    const tabElementiot: HTMLElement = document.getElementById(ContractDirection) as HTMLElement;
    if (tabElementiot) {
      tabElementiot.click();
    }
    if (isM2M) {
      const tabElementcol1: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(ContractDirection + 'Click' + m2mClass) as HTMLCollectionOf<HTMLElement>;
      if (tabElementcol1 && tabElementcol1.length > 0) {
        tabElementcol1[0].click();
      }
    }
  }

  ValidateSplitRows(contractForm, ContractDirection, isM2M = false): Boolean {
    const m2mClass = isM2M ? 'M2M' : '';

    const minvalue = isM2M ? contractForm.get(ContractDirection).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray : contractForm.get(ContractDirection).get('MinimumPaymentCommitment') as FormArray;
    let periodID = 0;
    let RowID = 0;
    if (minvalue && minvalue.length > 0) {
      for (let i = 0; i < minvalue.length; i++) {
        periodID = i;
        const Minperiod = minvalue.controls[i] as FormArray;
        if (Minperiod && Minperiod.length > 0) {
          for (let j = 0; j < Minperiod.length; j++) {
            RowID = j;
            const row = Minperiod.controls[j] as FormGroup;
            this.isValid = this.checkSplitsMinCountMatch(row);
            if (!this.isValid) {
              const splitclass = ContractDirection + 'SplitCommitment_' + i + j + m2mClass;
              const buttonelement: HTMLElement = document.getElementById(splitclass);
              if (buttonelement) {
                this.clickTabs(ContractDirection, isM2M);
                buttonelement.click();
              }
              break;
            }
          }
        }
        if (!this.isValid) {
          break;
        }
      }
    }
    if (!this.isValid) {
      // this.errorMsgs = '';
      this.errorMsgs = this.errorMsgs + ` in Period ${periodID + 1}` + `,  Row No : ` + (RowID + 1);
      const _class = ContractDirection === 'Bid' ? 'bid-accordion' + m2mClass : 'offer-accordion' + m2mClass;
      this.showErrorPopup(_class);
      // const bidTabId = ContractDirection + String(periodID + 1) + '-link';
      const bidTabId = ContractDirection + String(periodID + 1) + m2mClass + '-link';
      const bidTabElement: HTMLElement = document.getElementById(bidTabId) as HTMLElement;
      if (bidTabElement) {
        bidTabElement.click();
      }
    }
    return this.isValid;
  }

  private compareDates(startDate, endDate) {
    if (startDate && endDate) {
      const mydate1 = this.convertdate(startDate);
      const mydate2 = this.convertdate(endDate);
      this.isValid = new Date(mydate2) > new Date(mydate1);
    }
  }
  convertdate(date: any) {
    const dateArray = date.split('/');
    return (dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  private showErrorPopup(className = 'ng-invalid') {
    if (this.errorMsgs) {
      const item = (this.ErrorKeyClass && this.ErrorKeyClass == 'AbusiveTrafficRate' || this.ErrorKeyClass == 'AppFixDelayPayRate' || this.ErrorKeyClass == 'APNList' || this.ErrorKeyClass == 'TAPCodeList' || this.ErrorKeyClass == 'IMSIFileRange') ? '#' + this.ErrorKeyClass : '.' + className;
      const firstElementWithError = document.querySelectorAll(item);
      this.utility.displaySwalPopup(this.errorTitle.length ? this.errorTitle : this.errorMsgs, '', 'warning',
        firstElementWithError, false, null, false, null, this.errorTitle.length ? this.errorMsgs : '').then((result: any) => {
        });
    }
  }

  // setAgreementTerminationValidation(contractForm) {
  //   // Agreement Notification Termination Period
  //   const autoRenewalValue = contractForm.get('IsAutoRenewal').value;
  //   if (!autoRenewalValue) {
  //     contractForm.get('TerminationID').clearValidators();
  //   } else {
  //     contractForm.get('TerminationID').setValidators([Validators.required]);
  //   }
  //   contractForm.get('TerminationID').updateValueAndValidity();
  // }

  checkTemplatevalue(contractForm) {
    const contractTemplatevalue = contractForm.get('TemplateID');
    if (contractTemplatevalue.value && contractTemplatevalue.value.length > 0
      && contractTemplatevalue.value[0].TemplateID !== 1) {
      contractForm.get('AbusiveTrafficRate').setValue('');
      contractForm.get('AppFixDelayPayRate').setValue('');
      contractForm.get('AbusiveTrafficRate').clearValidators();
      contractForm.get('AppFixDelayPayRate').clearValidators();
    } else {
      if (contractTemplatevalue.value && contractTemplatevalue.value.length > 0) {
        contractForm.get('AbusiveTrafficRate').setValidators([Validators.required]);
        contractForm.get('AppFixDelayPayRate').setValidators([Validators.required]);
      } else {
        contractForm.get('AbusiveTrafficRate').clearValidators();
        contractForm.get('AppFixDelayPayRate').clearValidators();
      }

    }
    contractForm.get('AbusiveTrafficRate').updateValueAndValidity();
    contractForm.get('AppFixDelayPayRate').updateValueAndValidity();
  }

  SetUnilateralOfferBidValidations(contractForm: FormGroup, isM2M) {
    if (!isM2M) {
      if (contractForm.get('TypeID').value === 1) {
        contractForm.get('Bid').get('DiscountTypes').setValidators([Validators.required]);
        contractForm.get('Bid').get('SettlementTypeID').setValidators([Validators.required]);
        contractForm.get('Offer').get('DiscountTypes').setValidators([Validators.required]);
        contractForm.get('Offer').get('SettlementTypeID').setValidators([Validators.required]);
      }
      if (contractForm.get('TypeID').value === 2) {
        if (contractForm.get('DirectionID').value === 1) {
          contractForm.get('Bid').get('DiscountTypes').clearValidators();
          contractForm.get('Bid').get('SettlementTypeID').clearValidators();
          contractForm.get('Offer').get('DiscountTypes').setValidators([Validators.required]);
          contractForm.get('Offer').get('SettlementTypeID').setValidators([Validators.required]);
        } else if (contractForm.get('DirectionID').value === 2) {
          contractForm.get('Offer').get('DiscountTypes').clearValidators();
          contractForm.get('Offer').get('SettlementTypeID').clearValidators();
          contractForm.get('Bid').get('DiscountTypes').setValidators([Validators.required]);
          contractForm.get('Bid').get('SettlementTypeID').setValidators([Validators.required]);
        }
      }
      contractForm.get('Bid').get('DiscountTypes').updateValueAndValidity();
      contractForm.get('Bid').get('SettlementTypeID').updateValueAndValidity();
      contractForm.get('Offer').get('DiscountTypes').updateValueAndValidity();
      contractForm.get('Offer').get('SettlementTypeID').updateValueAndValidity();
    } else {
      contractForm.get('Bid').get('DiscountTypes').clearValidators();
      contractForm.get('Bid').get('SettlementTypeID').clearValidators();
    }

  }


  isFormValidOnNew(contractForm, isTemplateRequired): boolean {

    let isError = false;
    if ((!contractForm.get('TradingEntityID').value) && (!contractForm.get('CounterParty').value)) {
      this.errorMsgs = 'Trading Entity & Counterparty is required!';
      isError = true;
    } else {
      if (!contractForm.get('TradingEntityID').value || contractForm.get('TradingEntityID').value === '') {
        isError = true;
        this.errorMsgs = 'Trading Entity is required!';
      } else {
        if (!contractForm.get('CounterParty').value || contractForm.get('CounterParty').value === '' ||
          contractForm.get('CounterParty').value.length === 0) {
          isError = true;
          this.errorMsgs = 'Counterparty is required!';
        } else if (isTemplateRequired && (contractForm.get('TemplateID').value.length === 0 ||
          !contractForm.get('TemplateID').value[0].TemplateID
          || contractForm.get('TemplateID').value[0].TemplateID.length === 0)) {
          isError = true;
          this.errorMsgs = 'Template is required!';
        } else {
          if (!contractForm.get('TradeDate').value) {
            isError = true;
            this.errorMsgs = 'TradeDate is required!';
          } else {
            if (!contractForm.get('StartDate').value) {
              isError = true;
              this.errorMsgs = 'StartDate is required!';
            } else {
              if (!contractForm.get('EndDate').value) {
                isError = true;
                this.errorMsgs = 'EndDate is required!';
              }
            }
          }
        }
      }
    }
    if (isError) {
      return false;
    } else {
      return true;
    }
  }

  /* START - Validate Form Values */
  public isFormValid(group: FormGroup | FormArray, bidSelectedDiscountTypeName?: any[], offerSelectedDiscountTypeName?: any[]): Boolean {
    for (const key of Object.keys(group.controls)) {
      if (key.toLowerCase() !== 'bid' && key.toLowerCase() !== 'offer' && key.toLowerCase() !== 'm2m'
        && key.toLowerCase() !== 'minimumpaymentcommitment' && key.toLowerCase() !== 'minimumpaymentcommitmentm2m') {
        if (bidSelectedDiscountTypeName.length === 0 ||
          (bidSelectedDiscountTypeName.length !== 0 &&
            bidSelectedDiscountTypeName.filter((x: any) => x.toLowerCase() === key.toLowerCase()).length === 0)) {
          if (offerSelectedDiscountTypeName.length === 0 ||
            (offerSelectedDiscountTypeName.length !== 0 &&
              offerSelectedDiscountTypeName.filter((x: any) => x.toLowerCase() === key.toLowerCase()).length === 0)) {
            const abstractControl = this.cloneAbstractControl(group.controls[key]);
            if (!abstractControl.valid) {
              this.ErrorKeyClass = key;
              const keyStr = key.charAt(0).toUpperCase() + key.slice(1);
              const value = keyStr.replace(/([A-Z])/g, ' $1').trim();
              group.controls[key].markAsTouched({ onlySelf: true });
              this.errorMsgs = !this.getValidatorErrorMessage(keyStr) ? (value + ' is required!') :
                (this.getValidatorErrorMessage(keyStr));
              this.isValid = false;
              break;
            } else { this.ErrorKeyClass = null; this.isValid = true; }
          }
        }
      }
    }
    return this.isValid;
  }

  isFormGridValid(gridControl: any, bidOrOffer: string, isRateRequired = true, isM2M = false) {
    const m2mClass = isM2M ? 'M2M' : '';
    const invalidTabs = [];
    gridControl.controls.forEach((ele: any, i) => {
      if (ele.value.length > 0) {
        const invalidKeyMsg: any[] = [];
        const invalidGridValue = this.checkGridNullValues(ele, invalidKeyMsg, isRateRequired);
        if (invalidGridValue.length) {
          invalidTabs.push(i + 1);
          invalidTabs.push(invalidGridValue[0]);
        }
      }
    });
    //const tabId = bidOrOffer + String(invalidTabs[0]) + '-link';
    const tabId = bidOrOffer + String(invalidTabs[0]) + m2mClass + '-link';
    const tabElement: HTMLElement = document.getElementById(tabId) as HTMLElement;
    if (tabElement) {
      this.clickTabs(bidOrOffer, isM2M);
      tabElement.click();
    }
    return invalidTabs;
  }

  public isGridValid(group: FormGroup | FormArray): Boolean {
    for (const key of Object.keys(group.controls)) {
      for (const subKey of Object.keys(group.controls[key].controls)) {
        for (const subKeyGrid of Object.keys(group.controls[key].controls[subKey].controls)) {
          const abstractControl = this.cloneAbstractControl(group.controls[key].controls[subKey].controls[subKeyGrid]);
          if (!abstractControl.valid) {
            const keyStr = subKeyGrid.charAt(0).toUpperCase() + subKeyGrid.slice(1);
            const value = keyStr.replace(/([A-Z])/g, ' $1').trim();
            group.controls[key].controls[subKey].controls[subKeyGrid].markAsTouched({ onlySelf: true });
            this.errorMsgs = !this.getValidatorErrorMessage(keyStr) ? (value + ' is required!') :
              (this.getValidatorErrorMessage(keyStr));
            this.isValid = false;
            break;
          } else { this.isValid = true; }
        }
        if (this.isValid) {
          break;
        }
      }
      if (this.isValid) {
        break;
      }
    }
    return this.isValid;
  }

  getValidatorErrorTitle(validatorName: string, isM2M) {
    const config = {
      'Offer': 'Offer' + (isM2M ? ' M-IoT' : ' Access'),
      'Bid': 'Bid' + (isM2M ? ' M-IoT' : ' Access'),
    };
    return config[validatorName] ? config[validatorName] : '';
  }
  // default form validation
  getValidatorErrorMessage(validatorName: string) {
    const config = {
      'TemplateID': 'Template',
      'AbusiveTrafficRate': 'Abusive Traffic Threshold',
      'AppFixDelayPayRate': 'Applicable Fixed Interest Rate for Delayed Payments',
      'CounterParty': 'Counterparty',
      'StartDate': 'StartDate',
      'EndDate': 'EndDate',
      'TradeDate': 'TradeDate',
      'DiscountPeriodID': 'Discount Period',
      'TerminationID': 'Agreement Termination Notification Period',
      'DiscountTypes': 'Discount Type',
      'SettlementTypeID': 'Settlement Type',
      'TaxTreatmentID': 'Treatment',
      'BaisCalculationID': 'Basis for Band Calculation',
      'CurrencyID': 'Currency',
      'Services': 'Service(s)',
      'ServiceID': 'Service',
      'RegionID': 'Region',
      'AffiliatesID': 'Affiliates',
      'AYCERate': 'AYCE Rate',
      'FairUseCAP': 'Fair Use Cap',
      'BalancedTrafficRate': 'Balanced Traffic Rate',
      'UnbalancedTrafficRate': 'Unbalanced Traffic Rate',
      'TrafficRate': 'Traffic Rate',
      'BandThreshold': 'Band Threshold',
      'PerUnitID': 'Per',
      'ChargingIntervalID': 'Charging Interval',
      'TerminatedIn': 'Terminated In',
      'TerminatedName': 'Terminated In',
      'BandThresholdTypeID': 'Band Threshold',
      'OperatorAffiliate': 'Operator Affiliate',
      'OriginatedIn': 'OriginatedIn',
      'FirstName': 'First Name',
      'LastName': 'Last Name',
      'EmailID': 'Email Address',
      'ContractDocument': 'Contract Document',
      'TerminatedID': 'Terminated In',
      'AppliesTo': 'Applies To',
      'RoamingOn': 'Roaming On',
      'Commitment': 'Commitment',
      'DiscountPercentage': 'Discount Percentage',
      'VolumePercentage': 'Volume Percentage',
      'Volume': 'Volume',
      'ThresholdCalculatedID': 'Threshold Calculated',
      'ThresholdCalculationTypeID': 'Threshold calculated per IMSI or aggregated',
      'IMSIApplicationFeeID': 'IMSI Acess fee applicable',
      'RatePerIMSI': 'Network Access Fee Rate',
      'TadigCode': 'TAP Code',
      'TAPCodeList': 'TAP Code',
      'APNList': 'APN List',
      'IMSIFileRange': 'IMSI Codes file',
      'APNCode': 'APN Code',
      'TADIGID': 'Tadig ID',
      'TapID': 'TAP Code'
    };

    return ((config[validatorName]) ? config[validatorName] : '* field(s)') + ' is required!';
  }

  resetErrorMsgs() {
    this.errorMsgs = '';
    this.errorTitle = '';
  }

  checkGridRowCount(gridArray, offerOrBid: string) {
    if (this.isValid) {
      let tabindex = 0;
      for (const ele of gridArray.controls) {
        tabindex++;
        if (!this.isValid) { break; }
        if (ele.controls && ele.controls.length === 0) {
          this.errorMsgs = 'Please add records for Period ' + tabindex + '!';
          this.isValid = false;
          const tabElement: HTMLElement = document.getElementById(offerOrBid + tabindex + '-link') as HTMLElement;
          if (tabElement) { tabElement.click(); }
        }
      }
    }
  }

  getDiscountTypeName(selectedDiscountTypeID, isM2M): any {
    let selectedDiscountTypeName = '';
    const isM2Mstr = isM2M ? 'M2M' : '';
    switch (selectedDiscountTypeID) {
      case 1:
        selectedDiscountTypeName = 'Financial' + isM2Mstr;
        break;
      case 3:
        selectedDiscountTypeName = 'BalancedUnbalanced' + isM2Mstr;
        break;
      case 4:
        selectedDiscountTypeName = 'BandedTiered' + isM2Mstr;
        break;
      case 5:
        selectedDiscountTypeName = 'FlatRate' + isM2Mstr;
        break;
      case 6:
        selectedDiscountTypeName = 'VolumeConditionalCommitment' + isM2Mstr;
        break;
      case 7:
        selectedDiscountTypeName = 'MarketShare' + isM2Mstr;
        break;
      case 8:
        selectedDiscountTypeName = 'DiscountInvoice' + isM2Mstr;
        break;
      case 9:
        selectedDiscountTypeName = 'FinancialWithFair' + isM2Mstr;
        break;
      case 10:
        selectedDiscountTypeName = 'FinancialDiscountFair' + isM2Mstr;
        break;
      case -1:
        selectedDiscountTypeName = 'AccessFee' + isM2Mstr;
        break;
      default:
        selectedDiscountTypeName = '';
        break;
    }
    return selectedDiscountTypeName;
  }

  checkGridNullValues(group: any, invalidKeyMsg: any[], isRateRequired: boolean): any[] {
    if (!invalidKeyMsg.length) {
      Object.keys(group.controls).forEach((key: string) => {
        if (!invalidKeyMsg.length) {
          const abstractControl = group.controls[key];
          if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
            this.checkGridNullValues(abstractControl, invalidKeyMsg, isRateRequired);
          } else {
            if (abstractControl.status.toLowerCase() === 'invalid') {
              if ((key !== 'TrafficRate' && key !== 'AYCERate' && key !== 'BalancedTrafficRate'
                && key !== 'UnbalancedTrafficRate' && key !== 'FairUseCAP' && key !== 'RatePerIMSI' && key !== 'BandThreshold' && key !== 'DiscountPercentage'
                && key !== 'VolumePercentage' && key !== 'Volume') || isRateRequired) {
                const keyStr = key.charAt(0).toUpperCase() + key.slice(1);
                abstractControl.markAsTouched({ onlySelf: true });
                this.isValid = false;
                const errMsg = this.getValidatorErrorMessage(keyStr);
                invalidKeyMsg.push(errMsg);
              }
            }
          }
        }
      });
    }
    return invalidKeyMsg;
  }

  checkThresholdFixPayValues(contractForm) {
    const abusiveTrafficThresholdValue: Number = contractForm.get('AbusiveTrafficRate').value;
    const applicableFixedInterestValue: Number = contractForm.get('AppFixDelayPayRate').value;
    if (abusiveTrafficThresholdValue) {
      if (abusiveTrafficThresholdValue > 100) {
        this.isValid = false;
        this.errorTitle = 'Abusive Traffic Threshold';
        this.errorMsgs = 'Please enter a value less than or equal to 100!';
        this.showErrorPopup('abusive-trafficRate');
      }
    }
    if (applicableFixedInterestValue) {
      if (applicableFixedInterestValue > 100) {
        this.isValid = false;
        this.errorTitle = 'Applicable Fixed Interest Rate for Delayed Payments';
        this.errorMsgs = 'Please enter a value less than or equal to 100!';
        this.showErrorPopup('app-fixDelayPayRate');
      }
    }
  }

  cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });

      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)));

      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) {
      newControl.disable({ emitEvent: false });
    }

    return newControl;
  }
  /* END - Validate Form Values */

  /* END - Form Submit */

  CreateDealDiscOption(newDealIOTForm, isM2M) {
    let bidTypeValue, offerTypeValue;
    if (isM2M) {
      if (newDealIOTForm.get('Bid').get('M2M')) {
        bidTypeValue = newDealIOTForm.get('Bid').get('M2M').get('DiscountTypes').value;
      }
      if (newDealIOTForm.get('Offer').get('M2M')) {
        offerTypeValue = newDealIOTForm.get('Offer').get('M2M').get('DiscountTypes').value;
      }
    } else {
      bidTypeValue = newDealIOTForm.get('Bid').get('DiscountTypes').value;
      offerTypeValue = newDealIOTForm.get('Offer').get('DiscountTypes').value;
    }

    if (bidTypeValue && bidTypeValue.length > 0) {
      this.discountTypeChanged(newDealIOTForm,
        'Bid', bidTypeValue, false, isM2M);
    }
    if (offerTypeValue && offerTypeValue.length > 0) {
      this.discountTypeChanged(newDealIOTForm,
        'Offer', offerTypeValue, false, isM2M);
    }
  }
  // Start New Code
  // when discount type changed
  discountTypeChanged(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number, discTyepeChanged: boolean, isM2M: boolean = false) {
    const fieldArray = 0;
    const rollOvers = newContractIOTForm.get('NoOfDiscountPeriods').value;
    let newTabsCount = 0;
    if (!discTyepeChanged) {
      const tabsCount = this.getExistingTabs(newContractIOTForm, discountType, isM2M);
      newTabsCount = rollOvers - tabsCount;
      if (newTabsCount <= 0) {
        const removeTabsCount = newTabsCount * (-1);
        for (let index = 1; index <= Number(removeTabsCount); index++) {
          if (tabsCount > 1) {
            const TabsControl = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('Tabs') : newContractIOTForm.get(discountType).get('Tabs');
            TabsControl.setValue(newContractIOTForm.get('NoOfDiscountPeriods').value);
            this.removeTabs(newContractIOTForm, discountType, tabsCount - index, isM2M);
          }
        }
        return;
      }
    } else {
      if (isM2M) {
        this.resetTabsM2M(newContractIOTForm, discountType);
      } else {
        this.resetTabs(newContractIOTForm, discountType);
      }
      newTabsCount = rollOvers;
    }

    if ((rollOvers === -1 || rollOvers === '-1') || (!Number(newTabsCount))) {
      this.addTabs(newContractIOTForm, discountType, 0, fieldArray, false, isM2M);
    } else if (Number(newTabsCount)) {
      for (let index = 1; index <= Number(newTabsCount); index++) {
        const TabsControl = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('Tabs') : newContractIOTForm.get(discountType).get('Tabs');
        TabsControl.setValue(newContractIOTForm.get('NoOfDiscountPeriods').value);
        this.addTabs(newContractIOTForm, discountType, index, fieldArray, false, isM2M);
      }
    }
  }

  // get tabs
  getExistingTabs(newContractIOTForm: FormGroup, discountType: string, isM2M) {
    const TabsControl = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('Tabs') : newContractIOTForm.get(discountType).get('Tabs');
    return TabsControl.value;
  }

  // remove tabs
  removeTabs(newContractIOTForm: FormGroup, discountType, tabIndex, isM2M) {
    const discountTypeList = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value
      : newContractIOTForm.get(discountType).get('DiscountTypes').value;
    if (discountTypeList) {
      for (let index = 0; index < discountTypeList.length; index++) {
        const discountTypeID = discountTypeList[index].DiscountTypeID;
        const offerType = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
          : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
        offerType.removeAt(tabIndex);

        if (isM2M) {
          const offerTypeAcess = this.getDiscountFieldsM2M(newContractIOTForm, discountType, -1);
          offerTypeAcess.removeAt(tabIndex);
        }

        const minCommitment = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray
          : newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
        minCommitment.removeAt(tabIndex);
      }
    }
  }

  // reset tabs

  resetTabs(newContractIOTForm: FormGroup, discountType) {

    const minimumPaymentCommitment = newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
    minimumPaymentCommitment.controls = [];
    minimumPaymentCommitment.patchValue([]);

    const ayceControls = newContractIOTForm.get(discountType).get('Financial') as FormArray;
    ayceControls.controls = [];
    ayceControls.patchValue([]);
    const balancedControls = newContractIOTForm.get(discountType).get('BalancedUnbalanced') as FormArray;
    balancedControls.controls = [];
    balancedControls.patchValue([]);
    const bandedControls = newContractIOTForm.get(discountType).get('BandedTiered') as FormArray;
    bandedControls.controls = [];
    bandedControls.patchValue([]);
    const flatrateControls = newContractIOTForm.get(discountType).get('FlatRate') as FormArray;
    flatrateControls.controls = [];
    flatrateControls.patchValue([]);
    const VolumeConditionalCommitmentControls = newContractIOTForm.get(discountType).get('VolumeConditionalCommitment') as FormArray;
    VolumeConditionalCommitmentControls.controls = [];
    VolumeConditionalCommitmentControls.patchValue([]);
    const MarketShareControls = newContractIOTForm.get(discountType).get('MarketShare') as FormArray;
    MarketShareControls.controls = [];
    MarketShareControls.patchValue([]);
    const DiscountInvoiceControls = newContractIOTForm.get(discountType).get('DiscountInvoice') as FormArray;
    DiscountInvoiceControls.controls = [];
    DiscountInvoiceControls.patchValue([]);
    const FinancialWithFairControls = newContractIOTForm.get(discountType).get('FinancialWithFair') as FormArray;
    FinancialWithFairControls.controls = [];
    FinancialWithFairControls.patchValue([]);
    const FinancialDiscountFairControls = newContractIOTForm.get(discountType).get('FinancialDiscountFair') as FormArray;
    FinancialDiscountFairControls.controls = [];
    FinancialDiscountFairControls.patchValue([]);
  }

  // add tabs
  addTabs(newContractIOTForm: FormGroup, discountType: string, index: number, fieldArrayLength: number, isNBIot: boolean, isM2M) {
    if (isNBIot) {
    } else {
      this.initTabs(newContractIOTForm, discountType, fieldArrayLength, index, isM2M);
    }
  }

  // initialise tabs
  initTabs(newContractIOTForm: FormGroup, discountType: string, fieldArrayLength: number, indexh: number, isM2M: boolean) {
    const discountTypeList = isM2M ? lodash.cloneDeep(newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value)
      : lodash.cloneDeep(newContractIOTForm.get(discountType).get('DiscountTypes').value);

    if (discountTypeList && discountTypeList.length !== 0 && discountTypeList.filter(x => x.DiscountTypeID === 1
      || x.DiscountTypeID === 6 || x.DiscountTypeID === 7 || x.DiscountTypeID === 9 || x.DiscountTypeID === 10).length === 0) {
      const tab: FormArray = this.getminimuFields(newContractIOTForm, discountType, 'MinimumPaymentCommitment', isM2M);
      const formFields: FormGroup[] = this.getminFormFields(fieldArrayLength);
      if (tab) {
        tab.push(new FormArray(
          formFields
        ));
      }
    }


    // 27-05-2019

    if (discountTypeList) {
      if (isM2M && discountTypeList.length > 0) {
        const tab: FormArray = this.getDiscountFieldsM2M(newContractIOTForm, discountType, -1);
        const formFields: FormGroup[] = this.getDiscountFormFields(newContractIOTForm, discountType, -1, fieldArrayLength, isM2M);
        if (tab) {
          tab.push(new FormArray(
            formFields
          ));
        }
      }
      for (let indexi = 0; indexi < discountTypeList.length; indexi++) {
        const discountTypeID = discountTypeList[indexi].DiscountTypeID;
        const tab: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
          : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
        const formFields: FormGroup[] = this.getDiscountFormFields(newContractIOTForm, discountType, discountTypeID, fieldArrayLength, isM2M);
        if (tab) {
          tab.push(new FormArray(
            formFields
          ));
        }
      }
    }

  }


  // Discount type grid
  discFields(discountType, copyField?: any[]) {
    let formFields: FormGroup;
    switch (discountType) {
      case 1:
        formFields = this.bindFinancial('');
        break;
      case 3:
        formFields = this.bindBalancedUnbalanced();
        break;
      case 4:
        formFields = this.bindBandedTiered(copyField);
        break;
      case 5:
        formFields = this.bindFlatRate();
        break;
      case 6:
        formFields = this.bindVolumeConditionalCommitment(null, copyField);
        break;
      case 7:
        formFields = this.bindMarketShareCommitment(null, copyField);
        break;
      case 8:
        formFields = this.bindDiscountInvoice();
        break;
      case 9:
        formFields = this.bindFinancialWithFair();
        break;
      case 10:
        formFields = this.bindFinancialDiscountFair(copyField);
        break;
    }
    return formFields;
  }



  // after clicking on + icon
  addServiceOfferAccess(index: number, newContractIOTForm: FormGroup, discountType: string, discountTypeID: number,
    values, isM2M) {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);

    const controls = this.getDiscountFormFields(newContractIOTForm, discountType, discountTypeID, 1, isM2M); // todo 27-05-2019

    controls.forEach((ele: FormGroup) => {
      if (values) {
        ele.patchValue(values);
      }
      if (offerFields.controls[index]) {
        const temp = offerFields.controls[index] as FormArray;
        ele.get('OrderIndex').patchValue(this.findmaxorderindex(temp.value) + 1);
        temp.push(ele);
      } else {
        offerFields.push(new FormArray([ele]));
      }

    });
  }

  findmaxorderindex(temp: any): number {
    const OrderIndexArr = temp.map((y) => y.OrderIndex);
    if (OrderIndexArr && OrderIndexArr.length > 0) {
      return OrderIndexArr.reduce((a, b) => Math.max(a, b));
    } else {
      return 0;
    }
  }

  getDiscountFormFields(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number, discountFormFieldsLength: number, isM2M) {
    const discFormArray = [];
    for (let index = 0; index < discountFormFieldsLength; index++) {
      const ele = isM2M ? this.discFieldsM2M(discountTypeID, []) : this.discFields(discountTypeID, []);
      discFormArray.push(ele);
    }
    return discFormArray;
  }

  // copy row
  copyOfferControl(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, discountTypeID: number, isM2M) {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    const copyField = lodash.cloneDeep(_temp.controls[i].value);
    let copyvalue = [];
    if (copyField.Bands) {
      copyvalue = copyField.Bands;
    }
    if (copyField.Splits) {
      copyvalue = copyField.Splits;
    }
    const formFields = isM2M ? this.discFieldsM2M(discountTypeID, copyvalue) as FormGroup
      : this.discFields(discountTypeID, copyvalue) as FormGroup;
    formFields.setValue(copyField);
    formFields.get('OrderIndex').patchValue(this.findmaxorderindex(_temp.value) + 1);
    formFields.get('CanDelete').patchValue(1);
    _temp.insert(i + 1, formFields);
  }

  // remove a row
  removeServiceOfferAccess(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, discountTypeID: number,
    ActionType = 0, isM2M) {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    if (_temp.controls[i].get('CanDelete').value === 1) {
      ActionType = -1;
    }
    switch (ActionType) {
      case -1:
        _temp.removeAt(i);
        break;
      default:
        _temp.controls[i].get('isRemove').patchValue(ActionType);
        _temp.controls[i].get('isRemove').updateValueAndValidity();
        break;
    }
  }

  // get all rows
  fieldRows(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number, j: number, isM2M) {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    if (_temp) {
      return _temp.controls;
    }
  }

  // GetRow
  getrow(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, discountTypeID: number, isM2M): any {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    const copyField = _temp.controls[i] as FormGroup;
    return copyField;
  }

  GetMinRow(newContractIOTForm: any, discountType: any, isM2M: any, i, j) {
    let minrow: any;
    const minPayment = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray
      : newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
    if (minPayment && minPayment.controls.length > 0) {
      const minimurows = minPayment.controls[j] as FormArray;
      if (minimurows && minimurows.controls.length > 0) {
        minrow = minimurows.controls[i] as FormGroup;
      }
    }

    return minrow;
  }
  // 27-05-2019
  getDiscountFields(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number) {
    const discountTypeRate = newContractIOTForm.get(discountType) as FormGroup;
    let offerFields: FormArray;
    switch (discountTypeID) {
      case 1:
        offerFields = discountTypeRate.get('Financial') as FormArray;
        break;
      case 3:
        offerFields = discountTypeRate.get('BalancedUnbalanced') as FormArray;
        break;
      case 4:
        offerFields = discountTypeRate.get('BandedTiered') as FormArray;
        break;
      case 5:
        offerFields = discountTypeRate.get('FlatRate') as FormArray;
        break;
      case 6:
        offerFields = discountTypeRate.get('VolumeConditionalCommitment') as FormArray;
        break;
      case 7:
        offerFields = discountTypeRate.get('MarketShare') as FormArray;
        break;
      case 8:
        offerFields = discountTypeRate.get('DiscountInvoice') as FormArray;
        break;
      case 9:
        offerFields = discountTypeRate.get('FinancialWithFair') as FormArray;
        break;
      case 10:
        offerFields = discountTypeRate.get('FinancialDiscountFair') as FormArray;
        break;
    }

    return offerFields;
  }

  getDiscountFieldsM2M(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number) {
    const discountTypeRate = newContractIOTForm.get(discountType).get('M2M') as FormGroup;
    let offerFields: FormArray;
    switch (discountTypeID) {
      case 1:
        offerFields = discountTypeRate.get('FinancialM2M') as FormArray;
        break;
      case 3:
        offerFields = discountTypeRate.get('BalancedUnbalancedM2M') as FormArray;
        break;
      case 4:
        offerFields = discountTypeRate.get('BandedTieredM2M') as FormArray;
        break;
      case 5:
        offerFields = discountTypeRate.get('FlatRateM2M') as FormArray;
        break;
      case 6:
        offerFields = discountTypeRate.get('VolumeConditionalCommitmentM2M') as FormArray;
        break;
      case 7:
        offerFields = discountTypeRate.get('MarketShareM2M') as FormArray;
        break;
      case 8:
        offerFields = discountTypeRate.get('DiscountInvoiceM2M') as FormArray;
        break;
      case 9:
        offerFields = discountTypeRate.get('FinancialWithFairM2M') as FormArray;
        break;
      case 10:
        offerFields = discountTypeRate.get('FinancialDiscountFairM2M') as FormArray;
        break;
      case -1:
        offerFields = discountTypeRate.get('AccessFeeM2M') as FormArray;
        break;
    }

    return offerFields;
  }
  // End New Code

  getDiscountFieldsArray(JsonData: any, discountType: number) {
    let offerFields: any;
    switch (discountType) {
      case 1:
        offerFields = JsonData.Financial;
        break;
      case 3:
        offerFields = JsonData.BalancedUnbalanced;
        break;
      case 4:
        offerFields = JsonData.BandedTiered;
        break;
      case 5:
        offerFields = JsonData.FlatRate;
        break;
      case 6:
        offerFields = JsonData.VolumeConditionalCommitment;
        break;
      case 7:
        offerFields = JsonData.MarketShare;
        break;
      case 8:
        offerFields = JsonData.DiscountInvoice;
        break;
      case 9:
        offerFields = JsonData.FinancialWithFair;
        break;
      case 10:
        offerFields = JsonData.FinancialDiscountFair;
        break;
    }

    return offerFields;
  }
  getFillGridDetails(ContractSide, ContractSideData, NoOfDiscountPeriods, newContractIOTForm: FormGroup, isTrade = false) {
    const offerFormGroup = newContractIOTForm.get(ContractSide) as FormGroup;
    if (ContractSideData.DiscountTypes && ContractSideData.DiscountTypes.filter(x => x.DiscountTypeID === 1
      || x.DiscountTypeID === 6 || x.DiscountTypeID === 7 || x.DiscountTypeID === 9 || x.DiscountTypeID === 10).length === 0) {
      if (ContractSideData.MinimumPaymentCommitment && ContractSideData.MinimumPaymentCommitment.length > 0) {
        ContractSideData.MinimumPaymentCommitment.forEach((data, index) => {
          data = this.contractService.isCopyDealTrade ? data.filter(x => x.isExclude != 1) : data;
          data.forEach(ele => {
            if (!isTrade) {
              ele.AppliesTo = ele.AppliesTo.map(function (x) { return x.TADIGID; });
              ele.RoamingOn = ele.RoamingOn.map(function (x) { return x.CountryID; });
              if (ele.Splits && ele.Splits.length > 0) {
                ele.Splits.forEach(elsplit => {
                  elsplit.SAppliesTo = elsplit.SAppliesTo.map(function (x) { return x.TADIGID; });
                  elsplit.SRoamingOn = elsplit.SRoamingOn.map(function (x) { return x.CountryID; });
                });
              }
            }
            const discField = this.bindMinimumPaymentCommitment(null, ele);
            discField.patchValue(ele);
            const setValue = this.getminimuFields(newContractIOTForm, ContractSide, 'MinimumPaymentCommitment', false);
            if (setValue.controls[index]) {
              const temp = setValue.controls[index] as FormArray;
              temp.push(discField);
            } else {
              setValue.push(new FormArray([discField]));
            }
          });
        });
      }

    }
    // Grid
    if (ContractSideData.DiscountTypes) {
      ContractSideData.DiscountTypes.forEach(item => {
        if (item.DiscountTypeID) {
          const Jsonresult = this.getDiscountFieldsArray(ContractSideData, item.DiscountTypeID);
          if (Jsonresult && Jsonresult.length > 0) {
            Jsonresult.forEach((data, index) => {
              data = this.contractService.isCopyDealTrade ? data.filter(x => x.isExclude != 1) : data;
              data.forEach(ele => {

                if (!isTrade) {
                  if (ele.Services && Array.isArray(ele.Services)) {
                    ele.Services = ele.Services.map(function (x) { return x.ServiceID; });
                  }
                  if (ele.OperatorAffiliate) {
                    ele.OperatorAffiliate = ele.OperatorAffiliate.map(function (x) { return x.TADIGID; });
                  }
                  if (ele.OriginatedIn) {
                    ele.OriginatedIn = ele.OriginatedIn.map(function (x) { return x.CountryID; });
                  }
                  if (ele.AppliesTo) {
                    ele.AppliesTo = ele.AppliesTo.map(function (x) { return x.TADIGID; });
                  }
                  if (ele.RoamingOn) {
                    ele.RoamingOn = ele.RoamingOn.map(function (x) { return x.CountryID; });
                  }
                }
                let copyfiled = [];
                if (ele.Bands) {
                  copyfiled = ele.Bands;
                }
                if (ele.Splits) {
                  if (!isTrade) {
                    ele.Splits.forEach(elsplit => {
                      elsplit.SAppliesTo = elsplit.SAppliesTo.map(function (x) { return x.TADIGID; });
                      elsplit.SRoamingOn = elsplit.SRoamingOn.map(function (x) { return x.CountryID; });
                    });
                  }
                  copyfiled = ele.Splits;
                }

                const discField = this.discFields(item.DiscountTypeID, copyfiled) as FormGroup;
                discField.patchValue(ele);
                const setValue = this.getDiscountFields(newContractIOTForm, ContractSide, item.DiscountTypeID);
                if (setValue.controls[index]) {
                  const temp = setValue.controls[index] as FormArray;
                  temp.push(discField);
                } else {
                  setValue.push(new FormArray([discField]));
                }
                if (ele.TerminatedName) {
                  const regnameinarr = ele.TerminatedName.split('~') as any[];
                  const regioname = regnameinarr.length > 0 ? regnameinarr[1] : ele.TerminatedName;
                  if (ele.TerminatedID === 0 && ele.RegionCountryID && ele.RegionCountryID.length) {
                    this.contractService.TempRegionCountryList.push({
                      RegionName: regioname,
                      CountryList: ele.RegionCountryID
                    });
                  }
                }
              });
            });
          }
        }
      });
    }

    if (ContractSideData.M2M) {
      if (ContractSideData.M2M.TAPCodeList) {
        const TAPCodeList = offerFormGroup.get('M2M').get('TAPCodeList') as FormControl;
        if (!isTrade) {
          TAPCodeList.patchValue(ContractSideData.M2M.TAPCodeList.map(function (x) { return x.TADIGID; }));
        } else {
          TAPCodeList.patchValue(ContractSideData.M2M.TAPCodeList);
        }
      }
      if (ContractSideData.M2M.APNList) {
        ContractSideData.M2M.APNList = this.contractService.isCopyDealTrade ? ContractSideData.M2M.APNList.filter(x => x.isExclude != 1) : ContractSideData.M2M.APNList;
        ContractSideData.M2M.APNList.forEach(ele => {
          const APNList = offerFormGroup.get('M2M').get('APNList') as FormArray;
          if (APNList) {
            const APNListControls = this.bindAPNList(ele);
            APNListControls.patchValue(ele);
            APNList.push(APNListControls);
          }

        });
      }

      if (ContractSideData.M2M.DiscountTypes && ContractSideData.M2M.DiscountTypes.filter(x => x.DiscountTypeID === 1
        || x.DiscountTypeID === 6 || x.DiscountTypeID === 7 || x.DiscountTypeID === 9 || x.DiscountTypeID === 10).length === 0) {
        if (ContractSideData.M2M.MinimumPaymentCommitmentM2M && ContractSideData.M2M.MinimumPaymentCommitmentM2M.length > 0) {
          ContractSideData.M2M.MinimumPaymentCommitmentM2M.forEach((data, index) => {
            data = this.contractService.isCopyDealTrade ? data.filter(x => x.isExclude != 1) : data;
            data.forEach(ele => {
              if (!isTrade) {
                ele.AppliesTo = ele.AppliesTo.map(function (x) { return x.TADIGID; });
                ele.RoamingOn = ele.RoamingOn.map(function (x) { return x.CountryID; });
                if (ele.Splits && ele.Splits.length > 0) {
                  ele.Splits.forEach(elsplit => {
                    elsplit.SAppliesTo = elsplit.SAppliesTo.map(function (x) { return x.TADIGID; });
                    elsplit.SRoamingOn = elsplit.SRoamingOn.map(function (x) { return x.CountryID; });
                  });
                }
              }
              const discField = this.bindMinimumPaymentCommitment(null, ele);
              discField.patchValue(ele);
              const setValue = this.getminimuFields(newContractIOTForm, ContractSide, 'MinimumPaymentCommitment', true);
              if (setValue.controls[index]) {
                const temp = setValue.controls[index] as FormArray;
                temp.push(discField);
              } else {
                setValue.push(new FormArray([discField]));
              }
            });
          });
        }

      }

      // Grid
      if (ContractSideData.M2M.DiscountTypes && ContractSideData.M2M.DiscountTypes.length > 0) {
        let M2MDiscountTypes = lodash.cloneDeep(ContractSideData.M2M.DiscountTypes);
        M2MDiscountTypes.push({ 'DiscountTypeID': -1 });
        M2MDiscountTypes.forEach(item => {
          if (item.DiscountTypeID) {
            const Jsonresult = this.getDiscountFieldsArrayM2M(ContractSideData.M2M, item.DiscountTypeID);
            if (Jsonresult && Jsonresult.length > 0) {
              Jsonresult.forEach((data, index) => {
                data = this.contractService.isCopyDealTrade ? data.filter(x => x.isExclude != 1) : data;
                data.forEach(ele => {

                  if (!isTrade) {
                    if (ele.Services && Array.isArray(ele.Services)) {
                      ele.Services = ele.Services.map(function (x) { return x.ServiceID; });
                    }
                    if (ele.OperatorAffiliate) {
                      ele.OperatorAffiliate = ele.OperatorAffiliate.map(function (x) { return x.TADIGID; });
                    }
                    if (ele.OriginatedIn) {
                      ele.OriginatedIn = ele.OriginatedIn.map(function (x) { return x.CountryID; });
                    }
                    if (ele.AppliesTo) {
                      ele.AppliesTo = ele.AppliesTo.map(function (x) { return x.TADIGID; });
                    }
                    if (ele.RoamingOn) {
                      ele.RoamingOn = ele.RoamingOn.map(function (x) { return x.CountryID; });
                    }
                  }
                  let copyfiled = [];
                  if (ele.Bands) {
                    copyfiled = ele.Bands;
                  }
                  if (ele.Splits) {
                    if (!isTrade) {
                      ele.Splits.forEach(elsplit => {
                        elsplit.SAppliesTo = elsplit.SAppliesTo.map(function (x) { return x.TADIGID; });
                        elsplit.SRoamingOn = elsplit.SRoamingOn.map(function (x) { return x.CountryID; });
                      });
                    }
                    copyfiled = ele.Splits;
                  }

                  const discField = this.discFieldsM2M(item.DiscountTypeID, copyfiled) as FormGroup;
                  discField.patchValue(ele);
                  const setValue = this.getDiscountFieldsM2M(newContractIOTForm, ContractSide, item.DiscountTypeID);
                  if (setValue.controls[index]) {
                    const temp = setValue.controls[index] as FormArray;
                    temp.push(discField);
                  } else {
                    setValue.push(new FormArray([discField]));
                  }
                  // if (ele.TerminatedName) {
                  //   const regnameinarr = ele.TerminatedName.split('~') as any[];
                  //   const regioname = regnameinarr.length > 0 ? regnameinarr[1] : ele.TerminatedName;
                  //   if (ele.TerminatedID === 0 && ele.RegionCountryID && ele.RegionCountryID.length) {
                  //     this.contractService.TempRegionCountryList.push({
                  //       RegionName: regioname,
                  //       CountryList: ele.RegionCountryID
                  //     });
                  //   }
                  // }
                });
              });
            }
          }
        });
      }

    }


  }
  getDiscountFieldsArrayM2M(JsonData: any, discountType: number) {
    let offerFields: any;
    switch (discountType) {
      case 1:
        offerFields = JsonData.FinancialM2M;
        break;
      case 3:
        offerFields = JsonData.BalancedUnbalancedM2M;
        break;
      case 4:
        offerFields = JsonData.BandedTieredM2M;
        break;
      case 5:
        offerFields = JsonData.FlatRateM2M;
        break;
      case 6:
        offerFields = JsonData.VolumeConditionalCommitmentM2M;
        break;
      case 7:
        offerFields = JsonData.MarketShareM2M;
        break;
      case 8:
        offerFields = JsonData.DiscountInvoiceM2M;
        break;
      case 9:
        offerFields = JsonData.FinancialWithFairM2M;
        break;
      case 10:
        offerFields = JsonData.FinancialDiscountFairM2M;
        break;
      case -1:
        offerFields = JsonData.AccessFeeM2M;
        break;
    }

    return offerFields;
  }

  // Add default list
  addDefaultList(index: number, newContractIOTForm: FormGroup, discountType: string,
    discountTypeID: number, values: any, isM2M) {
    const offerFields: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
      : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
    const _temp = offerFields.controls[index] as FormArray;
    if (!_temp.controls.length) {
      switch (discountTypeID) {
        case 1:
          values.forEach(ele => {
            _temp.push(this.bindFinancial(ele));
          });
          // _temp.push(this.bindFinancial(values));
          break;
        case 3:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindBalancedUnbalancedM2M(ele) : this.bindBalancedUnbalanced(ele));
          });
          break;
        case 4:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindBandedTieredM2M(null, null, null, ele) : this.bindBandedTiered(null, null, null, ele));
          });
          break;
        case 5:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindFlatRateM2M(ele) : this.bindFlatRate(ele));
          });
          break;
        case 6:
          values.forEach(ele => {
            _temp.push(this.bindVolumeConditionalCommitment(ele));
          });
          break;
        case 7:
          values.forEach(ele => {
            _temp.push(this.bindMarketShareCommitment(ele));
          });
          break;
        case 8:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindDiscountInvoiceM2M(ele) : this.bindDiscountInvoice(ele));
          });
          break;
        case 9:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindFinancialWithFairM2M(ele) : this.bindFinancialWithFair(ele));
          });
          break;
        case 10:
          values.forEach(ele => {
            _temp.push(isM2M ? this.bindFinancialDiscountFairM2M(null, null, null, ele) : this.bindFinancialDiscountFair(null, null, null, ele));
          });
          break;
      }


    }
  }

  // Add default M2M list

  // Add default M2M list
  addDefaultListM2M(index: number, newContractIOTForm: FormGroup, discountType: string,
    discountTypeID: number, values: any, isNBIot?: boolean) {
    const offerFields: FormArray = this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID);
    const _temp = offerFields.controls[index] as FormArray;
    if (!_temp.controls.length) {
      switch (discountTypeID) {
        case 1:
          values.forEach(ele => {
            _temp.push(this.bindFinancial(ele));
          });
          // _temp.push(this.bindFinancial(values));
          break;
        case 3:
          values.forEach(ele => {
            _temp.push(this.bindBalancedUnbalancedM2M(ele));
          });
          break;
        case 4:
          values.forEach(ele => {
            _temp.push(this.bindBandedTieredM2M(null, null, null, ele));
          });
          break;
        case 5:
          values.forEach(ele => {
            _temp.push(this.bindFlatRateM2M(ele));
          });
          break;
        case 6:
          values.forEach(ele => {
            _temp.push(this.bindVolumeConditionalCommitment(ele));
          });
          break;
        case 7:
          values.forEach(ele => {
            _temp.push(this.bindMarketShareCommitment(ele));
          });
          break;
        case 8:
          values.forEach(ele => {
            _temp.push(this.bindDiscountInvoiceM2M(ele));
          });
          break;
        case 9:
          values.forEach(ele => {
            _temp.push(this.bindFinancialWithFairM2M(ele));
          });
          break;
        case 10:
          values.forEach(ele => {
            _temp.push(this.bindFinancialDiscountFairM2M(null, null, null, ele));
          });
          break;
        case -1:
          values.forEach(ele => {
            _temp.push(this.bindAccessFeeM2M(ele));
          });
          break;
      }
    }
  }

  getSelectedTapCodeList(newContractIOTForm: FormGroup, _tadIGCodes, contractID): any[] {
    const TabCodeList = [];
    const selectedCounterPartyTAP = newContractIOTForm.get(_tadIGCodes) as FormArray;
    selectedCounterPartyTAP.value.forEach(ele => {
      if (ele.IsSelected) {
        const obj = { TADIGID: ele.TadigId, TadigCode: ele.TadigCode, RowNo: ele.RowNo, OperatorName: ele.OperatorName };
        TabCodeList.push(obj);
      } else {
      }
    });
    return TabCodeList;
  }

  getSelectedTapCountryList(newContractIOTForm: FormGroup, _tadIGCodes, contractID): any[] {
    const CountryList = [];
    const selectedCounterPartyTAP = newContractIOTForm.get(_tadIGCodes) as FormArray;
    selectedCounterPartyTAP.value.forEach(ele => {
      if (ele.IsSelected) {
        const Country = {
          CountryID: ele.CountryTAPCodeId, CountryName: ele.CountryName1, RowNo: ele.RowNo,
          OperatorName: ele.OperatorName
        };
        const countrydata = CountryList.filter((x: any) => x.CountryID === Country.CountryID);
        if (countrydata.length === 0 || CountryList.length === 0) {
          CountryList.push(Country);
        }
      } else {
      }
    });
    return CountryList.sort((a, b) => (a.CountryName > b.CountryName) ? 1 : -1);
  }
  fillCheckAllDefault(tabList, tabCodeList, tabCountryList) {
    tabList.tabCodeList = tabCodeList;
    tabList.tabCountryList = tabCountryList;
    tabList.selectTabCodeList = tabCodeList;
    tabList.selectTabCountryList = tabCountryList;

  }
  // TO DO remove tapList
  checkAllDefault(newContractIOTForm: FormGroup, discountType: string, discountTypeID: number,
    tabCount: number, tapList: any, isAddRow: boolean, isM2M) {
    let PerDefault = null;
    let IntervalDefault = null;
    if (!isM2M) {
      PerDefault = 10;
      IntervalDefault = 14;
    }
    const discountTypeName = this.getDiscountTypeName(discountTypeID, isM2M);
    const formArray = isM2M ? newContractIOTForm.get(discountType).get('M2M').get(discountTypeName) as FormArray
      : newContractIOTForm.get(discountType).get(discountTypeName) as FormArray;
    const formControls = formArray.controls[tabCount] as FormArray;
    let operAffArr: any;
    let oriInArr: any;
    if (discountType === 'Bid') {
      operAffArr = this.contractService.tabCodeListBid.map(function (elval) {
        return elval.TADIGID;
      });
      oriInArr = this.contractService.tabCountryListBid.map(function (elval) {
        return elval.CountryID;
      });
    }
    if (discountType === 'Offer') {
      operAffArr = this.contractService.tabCodeListOffer.map(function (elval) {
        return elval.TADIGID;
      });
      oriInArr = this.contractService.tabCountryListOffer.map(function (elval) {
        return elval.CountryID;
      });
    }
    if (isAddRow) {
      if (formControls.controls[formControls.controls.length - 1].get('OperatorAffiliate')) {
        formControls.controls[formControls.controls.length - 1].get('OperatorAffiliate').setValue(operAffArr);
      }
      if (formControls.controls[formControls.controls.length - 1].get('OriginatedIn')) {
        formControls.controls[formControls.controls.length - 1].get('OriginatedIn').setValue(oriInArr);
      }

      if (formControls.controls[formControls.controls.length - 1].get('AppliesTo')) {
        formControls.controls[formControls.controls.length - 1].get('AppliesTo').setValue(operAffArr);
      }
      if (formControls.controls[formControls.controls.length - 1].get('RoamingOn')) {
        formControls.controls[formControls.controls.length - 1].get('RoamingOn').setValue(oriInArr);
      }

      if (discountTypeID === 1) { //// AYC Default Data
        const ServiceDefault = isM2M ? [9, 10] : [8, 9, 10, 11];
        formControls.controls[formControls.controls.length - 1].get('Services').setValue(ServiceDefault); /// All Service Selected
      } else {
        if (formControls.controls[formControls.controls.length - 1].get('ServiceID')) {
          formControls.controls[formControls.controls.length - 1].get('ServiceID').setValue(isM2M ? null : 5); /// VOLTE
        }
        if (formControls.controls[formControls.controls.length - 1].get('PerUnitID')) {
          formControls.controls[formControls.controls.length - 1].get('PerUnitID').setValue(PerDefault); /// min
        }
        if (formControls.controls[formControls.controls.length - 1].get('ChargingIntervalID')) {
          formControls.controls[formControls.controls.length - 1].get('ChargingIntervalID').setValue(IntervalDefault); // 1s
        }
      }
      if (formControls.controls[formControls.controls.length - 1].get('CurrencyID')) {
        formControls.controls[formControls.controls.length - 1].get('CurrencyID').setValue(
          newContractIOTForm.get(discountType + 'DefaultCurrency').value
        ); // Currency Dynamic
      }
      formControls.controls[formControls.controls.length - 1].get('CanDelete').setValue(1); // Can Delete
    } else {
      formControls.controls.forEach(el => {
        if (el.get('OperatorAffiliate')) {
          el.get('OperatorAffiliate').patchValue(operAffArr);
        }
        if (el.get('OriginatedIn')) {
          el.get('OriginatedIn').patchValue(oriInArr);
        }
        if (el.get('AppliesTo')) {
          el.get('AppliesTo').patchValue(operAffArr);
        }
        if (el.get('RoamingOn')) {
          el.get('RoamingOn').patchValue(oriInArr);
        }
        if (el.get('CurrencyID')) {
          el.get('CurrencyID').setValue(newContractIOTForm.get(discountType + 'DefaultCurrency').value);
        }
        if (el.get('ChargingIntervalID') && discountTypeID === -1) {
          el.get('ChargingIntervalID').setValue(15);
        }
        el.get('CanDelete').patchValue(1);

      });
    }
  }

  checkAllReset(newContractIOTForm: FormGroup, discountType: string, isM2M) {
    const _tempObject = isM2M ? newContractIOTForm.get(discountType).get('M2M').value
      : newContractIOTForm.get(discountType).value;
    let _discountTypeID: any[] = lodash.cloneDeep(_tempObject.DiscountTypes);
    if (isM2M) {
      _discountTypeID.push({ 'DiscountTypeID': -1 });
    }
    this.FilltabCountryAndtadIGCodesList(newContractIOTForm, discountType);
    this.FilltabAndtadIGCodesList(newContractIOTForm, discountType);
    if (_discountTypeID != null && _discountTypeID.length > 0) {
      const tapList = [...newContractIOTForm.get('TradingEntityTADIGCodes').value];
      const tapList1 = [...newContractIOTForm.get('CounterPartyTADIGCodes').value];
      // Discount type grid
      _discountTypeID.forEach(ele => {
        const discountTypeName = this.getDiscountTypeName(ele.DiscountTypeID, isM2M);
        let formArray;
        if (isM2M) {
          formArray = newContractIOTForm.get(discountType).get('M2M').get(discountTypeName) as FormArray
        } else {
          formArray = newContractIOTForm.get(discountType).get(discountTypeName) as FormArray;
        }
        if (formArray.controls && formArray.controls.length) {
          for (let index = 0; index < newContractIOTForm.get('NoOfDiscountPeriods').value; index++) {
            const formControls = formArray.controls[index] as FormArray;
            const operAffArr = discountType === 'Bid' ? tapList.filter(x => x.IsSelected === true).map(x => x.TadigId) :
              tapList1.filter(x => x.IsSelected === true).map(x => x.TadigId);
            let oriInArr = discountType === 'Bid' ? tapList1.filter(x => x.IsSelected === true).map(x => x.CountryTAPCodeId) :
              tapList.filter(x => x.IsSelected === true).map(x => x.CountryTAPCodeId);

            let flags = [], output = [];
            flags = [], output = [];
            for (let i = 0; i < oriInArr.length; i++) {
              if (flags[oriInArr[i]]) {
                continue;
              }
              flags[oriInArr[i]] = true;
              output.push(oriInArr[i]);
            }
            oriInArr = output;

            formControls.controls.forEach(el => {
              if (el.get('OperatorAffiliate')) {
                el.get('OperatorAffiliate').patchValue(operAffArr);
              }
              if (el.get('OriginatedIn')) {
                el.get('OriginatedIn').patchValue(oriInArr);
              }
              if (el.get('AppliesTo')) {
                el.get('AppliesTo').patchValue(operAffArr);
              }
              if (el.get('RoamingOn')) {
                el.get('RoamingOn').patchValue(oriInArr);
              }
            });
          }
        }
      });
    }

    // M2M
    if (isM2M) {
      const _bidmiotFormGroup = newContractIOTForm.get(discountType).get('M2M') as FormGroup;
      this.resetM2MTAPCodeAPNList(_bidmiotFormGroup);

      _bidmiotFormGroup.get('IsTAP').setValue(false);
      _bidmiotFormGroup.get('IsAPN').setValue(false);
    }
    const IsIncludeM2M = newContractIOTForm.get(discountType).get('IsIncludeM2M').value as boolean;
    if (!isM2M && IsIncludeM2M) {
      this.checkAllReset(newContractIOTForm, discountType, true);
    }
  }

  FilltabCountryAndtadIGCodesList(newContractIOTForm: FormGroup, discountType: string) {
    // BID
    if (discountType === 'Bid') {
      this.contractService.tabCodeListBid = this.contractService.tabCountryListBid = [];
      this.contractService.tabCodeListBid = this.getSelectedTapCodeList(newContractIOTForm,
        'TradingEntityTADIGCodes', '');
      this.contractService.tabCountryListBid = this.getSelectedTapCountryList(newContractIOTForm,
        'CounterPartyTADIGCodes', '');
    }
    // OFFER
    if (discountType === 'Offer') {
      this.contractService.tabCodeListOffer = this.contractService.tabCountryListOffer = [];
      this.contractService.tabCodeListOffer = this.getSelectedTapCodeList(newContractIOTForm,
        'CounterPartyTADIGCodes', '');
      this.contractService.tabCountryListOffer = this.getSelectedTapCountryList(newContractIOTForm,
        'TradingEntityTADIGCodes', '');
    }
  }
  getModelcontent(value, name?) {
    if (lodash.isArray(value)) {
      value = lodash.join(value.map(function (t) { return t[name]; }), ' | ');
    }
    return 'Previous Value : ' + value;
  }

  resetTADIGCodes(newContractIOTForm: FormGroup) {
    const CounterPartyTADIGCodes = newContractIOTForm.get('CounterPartyTADIGCodes') as FormArray;
    CounterPartyTADIGCodes.controls = [];
    CounterPartyTADIGCodes.setValue([]);
    const TradingEntityTADIGCodes = newContractIOTForm.get('TradingEntityTADIGCodes') as FormArray;
    TradingEntityTADIGCodes.controls = [];
    TradingEntityTADIGCodes.setValue([]);
    this.checkAllReset(newContractIOTForm, 'Bid', false);
    this.checkAllReset(newContractIOTForm, 'Offer', false);
    this.mincheckAllReset(newContractIOTForm, 'Bid', false);
    this.mincheckAllReset(newContractIOTForm, 'Offer', false);
  }

  public closeTADIGCodesModel(formName, modalName) {
    const controlGroupTradingEntity = formName.get('TradingEntityTADIGCodes') as FormArray;
    if (controlGroupTradingEntity && this.tempObjectTradingEntity) {
      controlGroupTradingEntity.controls.forEach((ele, index) => {
        ele.setValue(this.tempObjectTradingEntity[index]);
      });
    }
    const controlGroupCounterParty = formName.get('CounterPartyTADIGCodes') as FormArray;
    if (controlGroupCounterParty && this.tempObjectCounterParty) {
      controlGroupCounterParty.controls.forEach((ele, index) => {
        ele.setValue(this.tempObjectCounterParty[index]);
      });
    }
    modalName.hide();
  }

  public closeDiscountPeriodModel(formName, modalName) {
    formName.get('isLongStub').setValue(this.tempObjectIsLongStub ? this.tempObjectIsLongStub : 0);
    modalName.hide();
  }

  //#region  "Minimum payment Commitment Operation"
  removeminimum(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, ActionType, isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, 'MinimumPaymentCommitment', isM2M);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    if (_temp.controls[i].get('CanDelete').value === 1) {
      ActionType = -1;
    }
    switch (ActionType) {
      case -1:
        _temp.removeAt(i);
        break;
      default:
        _temp.controls[i].get('isRemove').patchValue(ActionType);
        _temp.controls[i].get('isRemove').updateValueAndValidity();
        break;
    }
  }


  minimumfieldRows(newContractIOTForm: FormGroup, discountType: string, j: number, isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, 'MinimumPaymentCommitment', isM2M);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    if (_temp) {
      return _temp.controls;
    }
  }

  minimumfieldRow(newContractIOTForm: FormGroup, discountType: string, j: number, i: number, gridName: string, isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, gridName, isM2M);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    if (_temp) {
      const row = _temp.controls[i] as FormGroup;
      if (row) {
        return row;
      }

    }
  }



  getminimuFields(newContractIOTForm: FormGroup, discountType: string, gridName: string, isM2M) {
    let offerFields: FormArray;
    const discountTypeRate = newContractIOTForm.get(discountType) as FormGroup;
    if (isM2M) {
      offerFields = discountTypeRate.get('M2M').get(gridName + 'M2M') as FormArray;
    } else {
      offerFields = discountTypeRate.get(gridName) as FormArray;
    }
    return offerFields;
  }


  copyminControl(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, gridName: string, isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, gridName, isM2M);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    const copyField = _temp.controls[i].value;
    const formFields = this.bindMinimumPaymentCommitment(null, copyField);
    formFields.patchValue(copyField);
    formFields.get('OrderIndex').patchValue(this.findmaxorderindex(_temp.value) + 1);
    formFields.get('CanDelete').patchValue(1);
    _temp.insert(i + 1, formFields);
  }


  getminFormFields(discountFormFieldsLength: number) {
    const discFormArray = [];
    for (let index = 0; index < discountFormFieldsLength; index++) {
      let formFields: FormGroup;
      formFields = this.bindMinimumPaymentCommitment();
      discFormArray.push(formFields);
    }
    return discFormArray;
  }

  addminimum(index: number, newContractIOTForm: FormGroup, discountType: string, isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, 'MinimumPaymentCommitment', isM2M);
    const controls = this.getminFormFields(1);
    controls.forEach((ele: FormGroup) => {
      // if (values) {
      //   ele.patchValue(values);
      // }
      if (offerFields.controls[index]) {
        const temp = offerFields.controls[index] as FormArray;
        ele.get('OrderIndex').patchValue(this.findmaxorderindex(temp.value) + 1);
        temp.push(ele);
      } else {
        offerFields.push(new FormArray([ele]));
      }
    });
  }


  mincheckAllDefault(newContractIOTForm: FormGroup, discountType: string,
    tabCount: number, isAddRow: boolean, isM2M) {
    let formArray;
    if (isM2M) {
      formArray = newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray;
    } else {
      formArray = newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
    }

    const formControls = formArray.controls[tabCount] as FormArray;

    let tabAppliesTo: any;
    let tabRoamingOn: any;
    if (discountType === 'Bid') {
      tabAppliesTo = this.contractService.tabAppliesToListbid.map(function (elval) {
        return elval.TADIGID;
      });
      tabRoamingOn = this.contractService.tabRoamingOnListbid.map(function (elval) {
        return elval.CountryID;
      });
    }

    if (discountType === 'Offer') {
      tabAppliesTo = this.contractService.tabAppliesToListoffer.map(function (elval) {
        return elval.TADIGID;
      });
      tabRoamingOn = this.contractService.tabRoamingOnListoffer.map(function (elval) {
        return elval.CountryID;
      });
    }
    if (isAddRow) {
      formControls.controls[formControls.controls.length - 1].get('AppliesTo').setValue(tabAppliesTo);
      formControls.controls[formControls.controls.length - 1].get('RoamingOn').setValue(tabRoamingOn);
      if (formControls.controls[formControls.controls.length - 1].get('CurrencyID')) {
        formControls.controls[formControls.controls.length - 1].get('CurrencyID').setValue(
          newContractIOTForm.get(discountType + 'DefaultCurrency').value
        ); // Currency Dynamic
      }
      formControls.controls[formControls.controls.length - 1].get('CanDelete').setValue(1); // Can Delete
    } else {

      formControls.controls.forEach(el => {
        el.get('AppliesTo').patchValue(tabAppliesTo);
        el.get('RoamingOn').patchValue(tabRoamingOn);
        if (el.get('CurrencyID')) {
          el.get('CurrencyID').setValue(newContractIOTForm.get(discountType + 'DefaultCurrency').value);
        }
        el.get('CanDelete').patchValue(1);
      });
    }
  }

  mincheckAllReset(newContractIOTForm: FormGroup, discountType: string, isM2M) {
    const _tempObject = isM2M ? newContractIOTForm.get(discountType).get('M2M').value
      : newContractIOTForm.get(discountType).value;
    const _discountTypeID: any[] = _tempObject.DiscountTypes;
    this.FilltabAndtadIGCodesList(newContractIOTForm, discountType);
    if (_discountTypeID != null && _discountTypeID.length > 0) {
      const tapList = [...newContractIOTForm.get('TradingEntityTADIGCodes').value];
      const tapList1 = [...newContractIOTForm.get('CounterPartyTADIGCodes').value];
      let formArray;
      if (isM2M) {
        formArray = newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray;
      } else {
        formArray = newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
      }
      //
      if (formArray && formArray.length > 0) {
        for (let index = 0; index < newContractIOTForm.get('NoOfDiscountPeriods').value; index++) {
          const formControls = formArray.controls[index] as FormArray;
          const operAffArr = discountType === 'Bid' ? tapList.filter(x => x.IsSelected === true).map(x => x.TadigId) :
            tapList1.filter(x => x.IsSelected === true).map(x => x.TadigId);

          let oriInArr = discountType === 'Bid' ? tapList1.filter(x => x.IsSelected === true).map(x => x.CountryTAPCodeId) :
            tapList.filter(x => x.IsSelected === true).map(x => x.CountryTAPCodeId);

          let flags = [], output = [];
          flags = [], output = [];
          for (let i = 0; i < oriInArr.length; i++) {
            if (flags[oriInArr[i]]) {
              continue;
            }
            flags[oriInArr[i]] = true;
            output.push(oriInArr[i]);
          }
          oriInArr = output;
          formControls.controls.forEach(el => {
            el.get('AppliesTo').patchValue(operAffArr);
            el.get('RoamingOn').patchValue(oriInArr);
          });
        }
      }

    }

    // M2M
    if (isM2M) {
      const _bidmiotFormGroup = newContractIOTForm.get(discountType).get('M2M') as FormGroup;
      this.resetM2MTAPCodeAPNList(_bidmiotFormGroup);


      // _bidmiotFormGroup.get('IsIMSI').setValue(false);
      _bidmiotFormGroup.get('IsTAP').setValue(false);
      _bidmiotFormGroup.get('IsAPN').setValue(false);
    }
    const IsIncludeM2M = newContractIOTForm.get(discountType).get('IsIncludeM2M').value as boolean;
    if (!isM2M && IsIncludeM2M) {
      this.mincheckAllReset(newContractIOTForm, discountType, true);
    }
  }

  FilltabAndtadIGCodesList(newContractIOTForm: FormGroup, discountType: string) {
    // BID
    if (discountType === 'Bid') {
      this.contractService.tabAppliesToListbid = this.contractService.tabRoamingOnListbid = [];
      this.contractService.tabAppliesToListbid = this.getSelectedTapCodeList(newContractIOTForm,
        'TradingEntityTADIGCodes', '');
      this.contractService.tabRoamingOnListbid = this.getSelectedTapCountryList(newContractIOTForm,
        'CounterPartyTADIGCodes', '');
    }
    // OFFER
    if (discountType === 'Offer') {
      this.contractService.tabAppliesToListoffer = this.contractService.tabRoamingOnListoffer = [];
      this.contractService.tabAppliesToListoffer = this.getSelectedTapCodeList(newContractIOTForm,
        'CounterPartyTADIGCodes', '');
      this.contractService.tabRoamingOnListoffer = this.getSelectedTapCountryList(newContractIOTForm,
        'TradingEntityTADIGCodes', '');
    }
  }

  sortFormminFields(j: number, newContractIOTForm: FormGroup, discountType: string, arrayIndexes: AbstractControl[], isM2M) {
    const offerFields: FormArray = this.getminimuFields(newContractIOTForm, discountType, 'MinimumPaymentCommitment', isM2M);
    const _temp: FormArray = offerFields.controls[j] as FormArray;
    arrayIndexes.forEach((ele: FormGroup, i) => {
      const fields = _temp.controls[i] as FormGroup;
      fields.setValue(ele.value);
    });
  }

  setMinimumPaymentCmtToSingle(offerBidMinimumFields: FormArray) {
    for (let i = 0; i < offerBidMinimumFields.length; i++) {
      const _temp = offerBidMinimumFields.controls[i] as FormArray;
      const _templen = _temp.length;
      for (let j = _templen; j > 0; j--) {
        if (j > 1) {
          _temp.removeAt((j - 1));
        }
      }
    }
  }

  //#endregion


  //#region  split minimumpayment commitment

  convertMaskToNumber(number) {
    if (number) {
      if (number.length > 3) {
        return parseInt(number.replace(/,/g, ''), 10);
      } else {
        return Number(number);
      }
    } else {
      return number;
    }
  }

  checkSplitsMinCountMatch(minimumrow): boolean {
    const splitArrayValue = minimumrow.value;
    this.errorMsgs = '';
    if (splitArrayValue && splitArrayValue.Splits) {
      const RowCommitment = this.convertMaskToNumber(splitArrayValue.Commitment);
      const countSplitCommitment = this.SplitcommitmentCount(minimumrow);
      if (RowCommitment === '' && splitArrayValue.Splits.length != 0 && countSplitCommitment >= 0) {
        this.errorMsgs = this.errorMsgs + `<br/>` + `Internal commitment is not allowed when the external is blank.`;
        return false;
      }
      const Codintion = (RowCommitment >= countSplitCommitment);
      if (!Codintion) {
        this.errorMsgs = this.errorMsgs + `<br/>` + `Internal Commitment can not be greater than External Commitment `;
        return false;
      }
    }
    return true;
  }

  SplitcommitmentCount(minimumrow) {
    const splitArrayValue = minimumrow.value;
    let countSplitCommitment = 0;
    splitArrayValue.Splits.forEach(split => {
      countSplitCommitment = countSplitCommitment + this.convertMaskToNumber(split.SCommitment);
    });
    return countSplitCommitment;
  }

  removeminimumSplit(j: number, i: number, k: number, newContractIOTForm: FormGroup, discountType: string, gridName: string, isM2M) {
    const splitfiedls: FormArray = this.getminimuSplitFields(j, i, newContractIOTForm, discountType, gridName, isM2M);
    splitfiedls.removeAt(k);
  }

  getminSplitFormFields(newContractIOTForm: FormGroup, discountType: string, discountFormFieldsLength: number,
    isNBIot?: boolean) {
    const discFormArray = [];
    for (let index = 0; index < discountFormFieldsLength; index++) {
      let formFields: FormGroup;
      formFields = this.bindMinimumPaymentCommitmentSplit();
      discFormArray.push(formFields);
    }
    return discFormArray;
  }


  getminimuSplitFields(j: number, i: number, newContractIOTForm: FormGroup, discountType: string, gridName: string, isM2M) {
    let splitFields: FormArray;
    const MinRow = this.minimumfieldRow(newContractIOTForm, discountType, j, i, gridName, isM2M) as FormGroup;
    splitFields = MinRow.get('Splits') as FormArray;
    return splitFields;
  }

  getminimuSplitFieldsRow(j: number, i: number, k: number, newContractIOTForm: FormGroup, discountType: string, isM2M) {
    let splitFields: FormArray;
    const MinRow = this.minimumfieldRow(newContractIOTForm, discountType, j, i, 'MinimumPaymentCommitment', isM2M) as FormGroup;
    splitFields = MinRow.get('Splits') as FormArray;
    return splitFields.controls[k] as FormGroup;
  }

  addminSplit(newContractIOTForm, discountType, minimumrow, values?: any) {
    const splitContols = minimumrow.get('Splits') as FormArray;
    const controls = this.getminSplitFormFields(newContractIOTForm, discountType, 1, false);
    let CurrencyID = 0;
    if (minimumrow.get('CurrencyID')) {
      CurrencyID = minimumrow.get('CurrencyID').value;
    }

    controls.forEach((ele: FormGroup) => {
      if (values) {
        ele.patchValue(values);
      }
      ele.get('SCurrencyID').patchValue(CurrencyID);
      splitContols.push(ele);
    });
  }
  copyminSplitControl(j: number, i: number, k: number, newContractIOTForm: FormGroup, discountType: string, gridName: string, isM2M) {
    const offerFields: FormArray = this.getminimuSplitFields(j, i, newContractIOTForm, discountType, gridName, isM2M);
    const copyField = offerFields.controls[k].value;
    const formFields = this.bindMinimumPaymentCommitmentSplit(null, copyField);
    formFields.patchValue(copyField);
    offerFields.insert(k + 1, formFields);
  }

  //#endregion


  //#region  "TDR-490 Pricing Grid TAP code validation"
  checkOriginatedOperatorAffiliate(item, i, j) {
    if (this.compaireColumn(item[i].ServiceID, item[j].ServiceID) &&
      this.compaireColumn(item[i].OriginatedIn, item[j].OriginatedIn) &&
      this.compaireColumn(item[i].OperatorAffiliate, item[j].OperatorAffiliate)
    ) {
      return true;
    } else {
      return false;
    }
  }
  checkCustomeRegionCountryList(item, i, j) {
    if (this.compaireColumn(item[i].RegionCountryID.map(x => x.CountryID), item[j].RegionCountryID.map(x => x.CountryID)) &&
      this.getRateperDiscType(item[i]) !== this.getRateperDiscType(item[j])) {
      return true;
    } else {
      return false;
    }
  }
  getRateperDiscType(itemofij) {
    switch (itemofij.Name) {
      case 'FlatRate':
        return itemofij.TrafficRate * 1.00000;
        break;
      case 'BalancedUnbalanced':
        return itemofij.BalancedTrafficRate * 1.00000;
        break;
      case 'BandedTiered':
        return itemofij.Bands[0].TrafficRate * 1.00000;
        break;
      case 'DiscountInvoice':
        return itemofij.DiscountPercentage * 1.00000;
        break;
      case 'MarketShare':
        return itemofij.BalancedTrafficRate * 1.00000;
        break;
    }
  }
  checkAppliesToRoamingOn(item, i, j) {
    if (this.compaireColumn(item[i].AppliesTo, item[j].AppliesTo) &&
      this.compaireColumn(item[i].RoamingOn, item[j].RoamingOn)
    ) {
      return true;
    } else {
      return false;
    }

  }

  checkBandDuplicate(DiscTypeindex, index, rowno) {
    const Banditem = DiscTypeindex[rowno].Bands;
    for (let i = 0; i < Banditem.length; i++) {
      for (let j = i; j < Banditem.length; j++) {
        if (i !== j) {
          if ((Banditem[i].TrafficRate * 1.00000) === (Banditem[j].TrafficRate * 1.00000)) {
            const error = new GridErrorDetail();
            const Gridi = lodash.findIndex(DiscTypeindex.filter(x => x.Name === DiscTypeindex[rowno].Name), DiscTypeindex[rowno]);
            error.PeriodID = index + 1;
            error.Message = `Duplicate Bands ` + `in Period ${index + 1}` +
              `<br/>  BandedTiered - Row No : ` + (Gridi + 1) +
              `, Band No : ` + (j + 1);
            this.GridErrorDetail.push(error);
            return true;
          }
        }
      }
    }
    return false;
  }

  checkBandDuplicateM2M(DiscTypeindex, rowno) {
    const Banditem = DiscTypeindex[rowno].Bands;
    for (let i = 0; i < Banditem.length; i++) {
      for (let j = i; j < Banditem.length; j++) {
        if (i !== j) {
          if ((Banditem[i].TrafficRate * 1.00000) === (Banditem[j].TrafficRate * 1.00000)) {
            const error = new GridErrorDetail();
            const Gridi = lodash.findIndex(DiscTypeindex.filter(x => x.Name === DiscTypeindex[rowno].Name), DiscTypeindex[rowno]);
            error.Message = `Duplicate Bands ` + `in M2M` +
              `<br/>  BandedTiered - Row No : ` + (Gridi + 1) +
              `, Band No : ` + (j + 1);
            this.GridErrorDetail.push(error);
            return true;
          }
        }
      }
    }
    return false;
  }

  getErrorRowMessage(discType: any[], i, j, index, ValidationFrom = 'Duplicate record'): GridErrorDetail {
    const error = new GridErrorDetail();
    error.PeriodID = index + 1;
    let Gridi = lodash.findIndex(discType.filter(x => x.Name === discType[i].Name), discType[i]);
    let Gridj = lodash.findIndex(discType.filter(x => x.Name === discType[j].Name), discType[j]);
    error.Message = ValidationFrom + ` in Period ${index + 1}` +
      `<br/> ${discType[i].Name} - Row No : ` +
      `${(Gridi + 1)
      } ` +
      `& ${discType[j].Name} - Row No : ` +
      `${(Gridj + 1)
      } `;
    if (discType[i].Name === discType[j].Name) {
      Gridi = discType.filter(x => x.Name === discType[i].Name).indexOf(discType[i]);
      Gridj = discType.filter(x => x.Name === discType[i].Name).indexOf(discType[j]);
      error.Message = ValidationFrom + ` in Period ${index + 1}` +
        `<br/>${discType[j].Name} - Row No : ` + `${(Gridi + 1)} ` + ` & ` + `${(Gridj + 1)} `;
    }
    return error;
  }
  getMinErrorRowMessage(discType: any[], i, j, index, CommitmentName): GridErrorDetail {
    const error = new GridErrorDetail();
    const Gridi = discType.indexOf(discType[i]);
    const Gridj = discType.indexOf(discType[j]);
    error.PeriodID = index + 1;
    error.Message = `Duplicate record ` +
      `in Period ${index + 1}` +
      `<br/> ` + CommitmentName + ` - Row No : ` +
      `${(Gridi + 1)} ` + ` & ` + `${(Gridj + 1)} `;
    return error;
  }
  compaireColumn(a, b) {
    for (let x = 0; x < b.length; x++) {
      for (let y = 0; y < a.length; y++) {
        if (b[x] === a[y]) {
          return true;
        }
      }
    }
    return false;
  }

  setDefautExcusionRegionToType1(discountType, newContractIOTForm) {
    const discountTypeList = newContractIOTForm.get(discountType).get('DiscountTypes').value;
    if (discountTypeList) {
      for (let index = 0; index < discountTypeList.length; index++) {
        const discountTypeID = discountTypeList[index].DiscountTypeID;
        const discountTypeData: FormArray = this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
        for (let j = 0; j < discountTypeData.length; j++) {
          const discountTypePeriodDatalen = discountTypeData.controls[j].value.length;
          for (let i = 0; i < discountTypePeriodDatalen; i++) {
            const servicerow = this.getrow(j, i, newContractIOTForm, discountType, discountTypeID, false);
            if (servicerow.controls['TerminatedTypeID'] && servicerow.controls['TerminatedID'] && servicerow.controls['TerminatedName'] &&
              servicerow.controls['TerminatedTypeID'].value === 2 &&
              servicerow.controls['TerminatedID'].value > 0 && servicerow.controls['TerminatedName'].value !== '') {
              servicerow.controls['TerminatedTypeID'].setValue(1);
              servicerow.controls['TerminatedID'].setValue(-1);
              servicerow.controls['TerminatedName'].setValue('All');

              servicerow.controls['TerminatedTypeID'].updateValueAndValidity();
              servicerow.controls['TerminatedID'].updateValueAndValidity();
              servicerow.controls['TerminatedName'].updateValueAndValidity();
            }
          }
        }
      }
    }
  }
  //#endregion
  clickFirstTabs() {
    const ele: HTMLElement = document.getElementById('Bid1-link') as HTMLElement;
    if (ele) { ele.click(); }

    const ele1: HTMLElement = document.getElementById('Offer1-link') as HTMLElement;
    if (ele1) { ele1.click(); }

    const eleBidm2m: HTMLElement = document.getElementById('Bid1M2M-link') as HTMLElement;
    if (eleBidm2m) { eleBidm2m.click(); }

    const eleOfferm2m: HTMLElement = document.getElementById('Offer1M2M-link') as HTMLElement;
    if (eleOfferm2m) { eleOfferm2m.click(); }
  }

  getDiscountTypeAYCE(newContractIOTForm, discountType, isM2M = false) {
    const _discountType: any[] = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value
      : newContractIOTForm.get(discountType).get('DiscountTypes').value;
    if (_discountType && _discountType.length > 0) {
      return _discountType.filter(x => x.DiscountTypeID === 1 || x.DiscountTypeID === 6 || x.DiscountTypeID === 7 || x.DiscountTypeID === 9 || x.DiscountTypeID === 10).length > 0 ? false : true;
    } else {
      return false;
    }
  }
  changePricingCurrency(newContractIOTForm, discountType, CurrencyID, isM2M = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const discountTypeListtemp = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('DiscountTypes').value :   newContractIOTForm.get(discountType).get('DiscountTypes').value;
      let discountTypeList = lodash.cloneDeep(discountTypeListtemp);
      let isAllowMin = false;
      let minPayment: any;
      let minrow: any;
      let minimurowslength: any = 0;
      let minimurows: any;
      if (discountTypeList) {
        if (isM2M) {
          discountTypeList.push({ 'DiscountTypeID': -1, 'DiscountTypeName': 'AccessFeeM2M' });
        }
        if (this.getDiscountTypeAYCE(newContractIOTForm, discountType, isM2M)) {
          minPayment = isM2M ? newContractIOTForm.get(discountType).get('M2M').get('MinimumPaymentCommitmentM2M') as FormArray
            : newContractIOTForm.get(discountType).get('MinimumPaymentCommitment') as FormArray;
          isAllowMin = true;
        }
        for (let index = 0; index < discountTypeList.length; index++) {
          const discountTypeID = discountTypeList[index].DiscountTypeID;
          const discountTypeField: FormArray = isM2M ? this.getDiscountFieldsM2M(newContractIOTForm, discountType, discountTypeID)
            : this.getDiscountFields(newContractIOTForm, discountType, discountTypeID);
          for (let j = 0; j < discountTypeField.length; j++) { //period
            const discountTypePeriodDatalen = discountTypeField.controls[j].value.length;
            for (let i = 0; i < discountTypePeriodDatalen; i++) {//rows
              const row = this.getrow(j, i, newContractIOTForm, discountType, discountTypeID, isM2M);
              if (row && row.value.hasOwnProperty('CurrencyID') && row.get('CurrencyID').value) {
                row.get('CurrencyID').patchValue(CurrencyID);
              }
            }
          }
        }
        if (isAllowMin) {
          const minimuperiodlength = minPayment.controls.length;
          for (let j = 0; j < minimuperiodlength; j++) { //period
            minimurows = minPayment.controls[j] as FormArray;
            minimurowslength = minimurows.length;
            for (let i = 0; i < minimurowslength; i++) {//rows
              minrow = minimurows.controls[i] as FormGroup;
              if (minrow && minrow.value.hasOwnProperty('CurrencyID') && minrow.get('CurrencyID').value) {
                minrow.get('CurrencyID').patchValue(CurrencyID);
              }
            }
          }
        }
      }
      return resolve(true);
    });
  }
}
//#region  "TDR-490 Pricing Grid TAP code validation" // #endregion
class GridErrorDetail {
  PeriodID: number;
  Message: string;
}
