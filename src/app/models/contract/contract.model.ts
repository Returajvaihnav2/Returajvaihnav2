export class Contractmodel {
  TradeID: string;
  isSender: number;
  ContractID: string;
  UserId: string;
  ReferenceNo: string;
  TradingEntityID: string;
  TradingEntityName: string;
  TradingEntityTCID: string;
  TradingEntityParentCode: string;
  TradingEntityCurrencyID: string;
  CounterParty: string;
  CounterPartyParentCode: string;
  CounterPartyCurrencyID: string;
  CounterPartyName: string;
  CounterPartyTCID: string;
  CounterPartyisTritex: string;
  CounterPartyCPType: string;
  TypeID: number;
  TypeName: string;
  ContractDealType: string;
  DirectionID: number;
  TemplateID: any;
  TemplateName: string;
  TradeDate: Date;
  StartDate: Date;
  EndDate: Date;
  IsAutoRenewal: Boolean;
  NoOfDiscountPeriods: number;
  OfflineFileName: string;
  OfflineFilePath: string;
  DiscountPeriods: any = [];
  ContractStatusEnumID: number;
  ExistingContractStatusEnumID: number;
  TradingEntityTADIGCodes: any = [];
  CounterPartyTADIGCodes: any = [];
  Offer: any = {
    M2M: {
      IMSIFileRange: '',
    },
    isBid: false,
    DiscountTypes: [],

    SettlementTypeID: 0,
    SettlementTypeName: '',
    IsIncludeM2M: false,
    SigningProcess: 0,
    SigningProcessValue: 0,
    TaxTreatmentID: 0,
    TaxTreatmentValue: 0,
    Exclusions: [],
    ExclusionsCountryRegion: [],
    MinimumPaymentCommitment: [],
    BalancedUnbalanced: [],
    BandedTiered: [],
    Financial: [],
    FlatRate: [],
    Taps: 1,
  };
  Bid: any = {
    isBid: true,
    DiscountTypes: [],
    SettlementTypeID: 0,
    SettlementTypeName: '',
    IsIncludeM2M: false,
    SigningProcess: 0,
    SigningProcessValue: 0,
    TaxTreatmentID: 0,
    TaxTreatmentValue: 0,
    Exclusions: [],
    ExclusionsCountryRegion: [],
    MinimumPaymentCommitment: [],
    BalancedUnbalanced: [],
    BandedTiered: [],
    Financial: [],
    FlatRate: [],
    Taps: 1,
    M2M: {
      IMSIFileRange: '',
    }
  };
  isLongStub: number;
  CounterPartyContact: any = [];
  OtherRegions: any = [];
  DealTypeEnumID: number;
  //#region "copy Deal"
  isFillKill: number;
  CounterPartyValidDate: any;
  RespondComments: string;
  RejectReason: string;
  Comments: string;
  isCPCreate: number;
  DiscountPeriodName: string;
  TradingEntityStatus: number;
  isCompleted: number;
  DocumentID: string;
  TradeApproval: any = [];
  isControlled;
  //#endregion
}
export class TradeModel {
  isSender: number;
  CounterPartyValidDate: Date;
  TradingEntityValidDate: Date;
  ContractID: string;
  UserId: string;
  ReferenceNo: string;
  TradingEntityID: string;
  TradingEntityName: string;
  TradingEntityTCID: string;
  TradingEntityParentCode: string;
  TradingEntityCurrencyID: string;
  CounterParty: string;
  CounterPartyParentCode: string;
  CounterPartyCurrencyID: string;
  CounterPartyName: string;
  TypeID: number;
  DirectionID: number;
  UnilateralDirectionName: string;
  TemplateID: any;
  TemplateName: string;
  TradeDate: Date;
  StartDate: Date;
  EndDate: Date;
  IsAutoRenewal: Boolean;
  NoOfDiscountPeriods: number;
  DiscountPeriods: any = [];
  ContractStatusEnumID: number;
  TradingEntityTADIGCodes: any = [];
  CounterPartyTADIGCodes: any = [];
  Offer: any = {
    M2M: {
      IMSIFileRange: '',
    },
    isBid: false,
    DiscountTypes: [],

    SettlementTypeID: 0,
    SettlementTypeName: '',
    IsIncludeM2M: false,
    SigningProcess: 0,
    SigningProcessValue: 0,
    TaxTreatmentID: 0,
    TaxTreatmentValue: 0,
    Exclusions: [],
    ExclusionsCountryRegion: [],
    MinimumPaymentCommitment: [],
    BalancedUnbalanced: [],
    BandedTiered: [],
    Financial: [],
    FlatRate: [],
    Taps: 1,
  };
  Bid: any = {
    isBid: true,
    DiscountTypes: [],
    SettlementTypeID: 0,
    SettlementTypeName: '',
    IsIncludeM2M: false,
    SigningProcess: 0,
    SigningProcessValue: 0,
    TaxTreatmentID: 0,
    TaxTreatmentValue: 0,
    Exclusions: [],
    ExclusionsCountryRegion: [],
    MinimumPaymentCommitment: [],
    BalancedUnbalanced: [],
    BandedTiered: [],
    Financial: [],
    FlatRate: [],
    Taps: 1,
    M2M: {
      IMSIFileRange: '',
    }
  };
  isLongStub: number;
  isFillKill: number;
  OtherRegions: any = [];
  DealTypeEnumID: number;
  TradingEntityStatus: number;
  TradeOfflineContract: string;
  TradeApproval: any = [];
  TapInstructionID: number;
}


export interface ExclusionCountry {
  key: string;
  value: number;
}

export interface BidExclusionCountry {
  key: string;
  value: number;
}

export interface BidExclusionRegion {
  key: string;
  value: number;
}

export interface TadigCodeList {
  IsSelected: boolean;
  TadigCode: string;
  TadigId: string;
  CodeType: string;
  CountryName: string;
  CountryName1: string;
  RegionName: string;
  OperatorName: string;
}

export interface CounterPartyList {
  IsSelected: boolean;
  TadigCode: string;
  TadigId: string;
  CodeType: string;
  CountryName: string;
  CountryName1: string;
  RegionName: string;
  OperatorName: string;
}

export interface TADIGCodes {
  TradingEntityTADIGCodes: TadigCodeList[];
  CounterPartyTADIGCodes: TadigCodeList[];
}

export interface Exclusion {
  EnumID: number;
}

export interface BidExclusion {
  EnumID: number;
}

export interface Bandbyservice {
  Band: number;
}

export interface Bandedtiered {
  ServiceID: number;
  RegionID: number;
  CurrencyID: number;
  TerminatedInID: number;
  bandbyservice: Bandbyservice[];
  PerUnitID: number;
  ChargingIntervalID: number;
  IsM2M: boolean;
}

export interface TAPDiscountTypeBid {
  PeriodId: number;
  balancedunbalanced?: any;
  flatrate?: any;
  alleat?: any;
  bandedtiered: Bandedtiered[];
}

export interface Balancedunbalanced {
  ServiceID: number;
  RegionID: number;
  CurrencyID: number;
  TerminatedInID: number;
  BalancedTrafficRate: number;
  UnbalancedTrafficRate: number;
  PerUnitID: number;
  ChargingIntervalID: number;
  IsM2M: boolean;
}

export interface TAPDiscountTypeOffer {
  PeriodId: number;
  balancedunbalanced: Balancedunbalanced[];
  flatrate?: any;
  alleat?: any;
  bandedtiered?: any;
}


export class ContactPersonModel {
  EmailID: string;
  EmailList: any[] = [];
  FullNameList: string;
  IsActive: boolean;
  IsTritexOperator: boolean;
  OperatorID: string;
  OperatorName: string;
  UserID: string;
}

export class TadigCode {
  CodeType: string;
  CodeTypeId: number;
  CountryID: number;
  CountryName: string;
  CountryName1: string;
  CountryTAPCodeId: number;
  CreatedBy: string;
  CreatedDate: Date;
  Id: number;
  IsActive: boolean;
  NetworkId: boolean;
  OperatorId: string;
  OperatorName: string;
  OperatorNetworkId: number;
  OperatorNetworkName: string;
  RegionId: number;
  RegionName: string;
  TadigCode: string;
  TadigId: string;
}

export class DiscountType {
  index: number;
  DiscountPeriodID: number;
  MinimumPaymentCommitment: MinimumPaymentCommitment[] = [];
  DiscountTypeByService: DiscountTypeByService[] = [];
  FlatRate: FlatRate[] = [];
  BalancedUnbalanced: BalancedUnbalanced[] = [];
  BandedTiered: BandedTiered[] = [];
  DiscountTypeFinancial: DiscountTypeFinancial[];
}

export class MinimumPaymentCommitment {
  Commitment: string;
  Currency: string;
  isBid: boolean;
  Id: number;
  IsActive: boolean;
}

export class DiscountTypeByService {
  Id: number;
  Service: string;
  Affiliates: string;
  Currency: string;
  AYCERate: number;
  IsActive: boolean;
  isBid: boolean;
}
export class FlatRate {
  Id: number;
  Service: string;
  Region: string;
  TerminatedIn: string;
  Currency: string;
  TrafficRate: number;
  per: string;
  ChargingInterval: string;
  ParentId: number;
  IsActive: boolean;
  isBid: boolean;
}

export class BalancedUnbalanced {
  Id: number;
  Service: string;
  Region: string;
  TerminatedIn: string;
  Currency: string;
  BalancedTrafficRate: number;
  UnbalancedTrafficRate: number;
  per: string;
  ChargingInterval: string;
  ParentId: number;
  IsActive: boolean;
  isBid: boolean;
}

export class BandedTiered {
  Id: number;
  Service: string;
  Region: string;
  TerminatedIn: string;
  Currency: string;
  // BandThresholdType: string;
  band: number;
  bandThreshold: number;
  backToFirst: boolean;
  per: string;
  ChargingInterval: string;
  ParentId: number;
  IsActive: boolean;
  isBid: boolean;
}

export class DiscountTypeFinancial {
  AYCERate: number;
  Affiliates: number;
  Currency: number;
  Id: number;
  IsActive: boolean;
  Service: number;
  isBid: boolean;
}


export class DisctypeM2M {
  index: Number;
  APNList: any[];
  APN: Boolean;
  APNcodes: string[];
  AccessFeeM2M: DisctypeM2MAccessFee[];
  BandedTieredM2M: any[];
  FinancialM2M: any[];
  FlatRateM2M: any[];
  BidDiscountTypeM2M: number;
  BidDoesM2MTrafficApplyToOverallCommitments: boolean;
  ContractDirection: Number;
  ContractDirectionCurrunt: Number;
  DiscountTypes: any[];
  IMSI: Boolean;
  IMSIRange: String;
  OfferDiscountTypeM2M: number;
  OfferDoesM2MTrafficApplyToOverallCommitments: boolean;
  TAP: Boolean;
  TAPcodes: string[];
  counterDiscountTypeID: Number;
}

// APN
export class DisctypeM2MSetupRateAPN {
  TAPCode: String;
  APNCode: String;
  isBid: boolean;
}

// M2M AccessFee
export class DisctypeM2MAccessFee {
  ID: Number;
  Currency: Number;
  RatePerIMSI: Number;
  ChargingInterval: Number;
  TransactionType: Number;
  IsActive: Boolean;
  isBid: boolean;
}

// Financial
export class DiscTypeM2MFinancial {
  ID: Number;
  Service: any[];
  Affiliates: Number;
  Currency: Number;
  AYCERate: Number;
  IsActive: Boolean;
  isBid: boolean;
}

// Flat Rate
export class DiscTypeM2MFlatRate {
  ID: Number;
  Service: Number;
  Region: Number;
  Currency: Number;
  TrafficRate: Number;
  Per: Number;
  ChargingInterval: Number;
  ParentId: Number;
  IsActive: Boolean;
  isBid: boolean;
}

// Banded Tiered
export class DiscTypeM2MBandedTiered {
  ID: Number;
  Service: Number;
  Region: Number;
  Currency: Number;
  // BandThresholdType: Number;
  band: number;
  bandThreshold: number;
  backToFirst: boolean;
  Per: Number;
  ChargingInterval: Number;
  ThresholdCalculated: Number;
  ThresholdCalculationType: Number;
  IMSIApplicationFee: String;
  ParentId: Number;
  IsActive: Boolean;
  isBid: boolean;
}

// M2M setup rate
export class DisctypeM2MSetupRate {
  ID: Number;
  DiscountTypeM2M: Number;
  DoesM2MTrafficApplyToOverallCommitments: Boolean;
  AccessFeeM2M: DisctypeM2MAccessFee;
  FinancialM2M: DiscTypeM2MFinancial[];
  FlatRateM2M: DiscTypeM2MFlatRate[];
  BandedTieredM2M: DiscTypeM2MBandedTiered[];
}
