import { Injectable } from '@angular/core';
import * as XMLWriter from 'xml-writer';
import * as FileSaver from 'file-saver';
import { formatCurrency, formatNumber } from '@angular/common';
import * as lodash from 'lodash';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DealFastXMLService {
  xw = new XMLWriter;
  CountryRegions = [];
  IsTrade: boolean;
  IsGenerate: boolean;
  CounterPartyAgentName = '';
  AgentName = '';
  TradingEntityTADIGCodes: any = [];
  CounterPartyTADIGCodes: any = [];
  constructor() { }
  public generateXml(paramData: any, IsTrade = false, IsGenerate = true) {
    this.IsTrade = IsTrade;
    this.IsGenerate = IsGenerate;
    const TypeID = paramData.TypeID;
    const DirectionID = paramData.DirectionID;
    this.TradingEntityTADIGCodes = paramData.TradingEntityTADIGCodes;
    this.CounterPartyTADIGCodes = paramData.CounterPartyTADIGCodes;
    if (paramData.TradingEntityAgentName) {
      this.AgentName = paramData.TradingEntityAgentName;
    } else {
      this.AgentName = this.checkExistValue(paramData, 'TradingEntityName');
    }

    const CounterPartyAgentName = IsTrade ? paramData.CounterParty[0].CounterPartyAgentName : paramData.CounterPartyAgentName;
    if (CounterPartyAgentName) {
      this.CounterPartyAgentName = CounterPartyAgentName;
    } else {
      this.CounterPartyAgentName = (IsTrade ? paramData.CounterParty[0].OperatorName : paramData.CounterPartyName);
    }
    // Start XML Node
    this.xw = new XMLWriter;
    this.xw.startDocument();
    this.xw.startElement('DiscountNetposition');
    //#region  "DiscountScenario"
    this.xw.startElement('DiscountScenario');

    this.xw.startElement('ScenarioName');
    this.xw.text(this.checkExistValue(paramData, 'ReferenceNo'));
    this.xw.endElement(); // Contract ID

    this.xw.startElement('DealType');
    this.xw.text(this.checkExistValue(paramData, IsTrade ? 'TradeDealType' : 'ContractDealType'));
    this.xw.endElement(); // Deal Type

    this.xw.startElement('Direction');
    this.xw.text(paramData.TypeName);
    this.xw.endElement(); // Direction

    if (TypeID === 2) {
      this.xw.startElement('UnilateralDirectionName');
      this.xw.text((paramData.DirectionID === 1 ? this.CounterPartyAgentName : this.AgentName) + ' ' + paramData.UnilateralDirectionName);
      this.xw.endElement(); // Direction Name
    }

    this.xw.startElement('TradeDate');
    // this.xw.text(this.IsTrade ? this.getDate(new Date()) : this.getDateFormat(paramData.TradeDate));
    //this.xw.text(this.IsTrade ? new Date() : paramData.TradeDate);
    this.xw.text(this.IsTrade ? new Date().toLocaleDateString() : paramData.TradeDate ? paramData.TradeDate : new Date().toLocaleDateString());
    this.xw.endElement(); // Start Date

    this.xw.startElement('StartDate');
    // this.xw.text(this.getDateFormat(paramData.StartDate));
    this.xw.text(paramData.StartDate);
    this.xw.endElement(); // Start Date


    this.xw.startElement('EndDate');
    //this.xw.text(this.getDateFormat(paramData.EndDate));
    this.xw.text(paramData.EndDate);
    this.xw.endElement(); // End Date

    this.xw.startElement('NoOfDiscountPeriods');
    this.xw.text(this.checkExistValue(paramData, 'NoOfDiscountPeriods'));
    this.xw.endElement(); // No Of Discount Periods

    this.xw.startElement('AutoRenew');
    this.xw.text(paramData.IsAutoRenewal ? 'Yes' : 'No');
    this.xw.endElement(); // Autorenew

    this.xw.startElement('RolloverPeriod');
    this.xw.text(this.checkExistValue(paramData, 'DiscountPeriodName'));
    this.xw.endElement(); // Roll over Period

    this.xw.startElement('TemplateName');
    this.xw.text(this.getTemplate(paramData.TemplateName, paramData, this.IsTrade));
    this.xw.endElement(); // Template Name
    if (!this.IsTrade) {
      this.xw.startElement('AgreementType');
      this.xw.text("Final");
      this.xw.endElement(); // Template Name
    }
    this.xw.endElement(); // DiscountScenario
    //#endregion DiscountScenario

    if (!this.IsTrade) {
      this.xw.startElement('CreateAgreement');

      this.xw.startElement('AgreementReferenceTemplateID');
      this.xw.text('3');
      this.xw.endElement(); // AgreementReferenceTemplateID

      this.xw.startElement('AgreementReferenceCustom');
      this.xw.text('');
      this.xw.endElement(); // AgreementReferenceCustom

      this.xw.startElement('FirstName');
      this.xw.text('Tritex');
      this.xw.endElement(); // FirstName

      this.xw.startElement('MiddleName');
      this.xw.text('');
      this.xw.endElement(); // MiddleName

      this.xw.startElement('LastName');
      this.xw.text('Ltd');
      this.xw.endElement(); // LastName

      this.xw.startElement('Email');
      this.xw.text('tritex.ltd@tritex.com');
      this.xw.endElement(); // Email

      this.xw.startElement('OperatorTAPCode');
      this.xw.text(true ? paramData.TradingEntityTADIGCodes[0].TadigCode : paramData.CounterPartyTADIGCodes[0].TadigCode);
      this.xw.endElement(); // OperatorTAPCode

      this.xw.endElement(); // CreateAgreement
    }
    //#region Home party 
    this.xw.startElement('HomeParty');
    if (paramData.TradingEntityCPType === 'G') {
      const HomeOperators = this.getUniqueOperator(paramData.TradingEntityTADIGCodes.filter(x => x.IsSelected === true), 'OperatorId');
      this.xw.startElement('Group');
      this.xw.writeAttribute('name', paramData.TradingEntityName);
      HomeOperators.forEach(TEetc => {
        const HomeOperator = paramData.TradingEntityTADIGCodes.find(x => x.OperatorId === TEetc && x.IsSelected === true);
        this.xw.startElement('Operator');
        this.xw.writeAttribute('name', HomeOperator.OperatorName);
        const HomeTadingCodes = paramData.TradingEntityTADIGCodes.filter(x => x.OperatorId === TEetc && x.IsSelected === true);
        HomeTadingCodes.forEach(HTC => {
          this.xw.startElement('PMNAnalysed');
          this.xw.writeAttribute('name', HTC.TadigCode);
          this.xw.startElement('TAPCode');
          this.xw.text(HTC.TadigCode);
          this.xw.endElement();
          this.xw.startElement('Country');
          this.xw.text(HTC.CountryName);
          this.xw.endElement();
          this.xw.startElement('ISO');
          this.xw.text(HTC.CountryISO ? HTC.CountryISO : ' ');
          this.xw.endElement();
          this.xw.endElement();
        });
        this.xw.endElement();
      });
      this.xw.endElement();
      // Group
    } else if (paramData.TradingEntityCPType === 'O') {
      // operator
      const HomeOperator = paramData.TradingEntityTADIGCodes.find(x => x.OperatorId === paramData.TradingEntityID && x.IsSelected === true);
      this.xw.startElement('Operator');
      this.xw.writeAttribute('name', HomeOperator.OperatorName);
      const HomeTadingCodes = paramData.TradingEntityTADIGCodes.filter(x => x.OperatorId === paramData.TradingEntityID && x.IsSelected === true);
      HomeTadingCodes.forEach(HTC => {
        this.xw.startElement('PMNAnalysed');
        this.xw.writeAttribute('name', HTC.TadigCode);
        this.xw.startElement('TAPCode');
        this.xw.text(HTC.TadigCode);
        this.xw.endElement();
        this.xw.startElement('Country');
        this.xw.text(HTC.CountryName);
        this.xw.endElement();
        this.xw.startElement('ISO');
        this.xw.text(HTC.CountryISO ? HTC.CountryISO : ' ');
        this.xw.endElement();
        this.xw.endElement();
      });
      this.xw.endElement();
    }
    this.xw.endElement();
    //#endregion Home party

    //#region  Visitor party 
    const CounterPartyCPType = IsTrade ? paramData.CounterParty[0].CPType : paramData.CounterPartyCPType;
    const CounterpartyOperatorId = IsTrade ? paramData.CounterParty[0].OperatorIds : paramData.CounterParty;
    this.xw.startElement('RoamingPartner');
    if (CounterPartyCPType === 'G') {
      const VisitorOperators = this.getUniqueOperator(paramData.CounterPartyTADIGCodes.filter(x => x.IsSelected === true), 'OperatorId');
      this.xw.startElement('Group');
      this.xw.writeAttribute('name', paramData.CounterPartyName);
      VisitorOperators.forEach(TEetc => {
        const HomeOperator = paramData.CounterPartyTADIGCodes.find(x => x.OperatorId === TEetc);
        this.xw.startElement('Operator');
        this.xw.writeAttribute('name', HomeOperator.OperatorName);
        const VisitorTadingCodes = paramData.CounterPartyTADIGCodes.filter(x => x.OperatorId === TEetc);
        VisitorTadingCodes.forEach(VTC => {
          this.xw.startElement('PMNAnalysed');
          this.xw.writeAttribute('name', VTC.TadigCode);
          this.xw.startElement('TAPCode');
          this.xw.text(VTC.TadigCode);
          this.xw.endElement();
          this.xw.startElement('Country');
          this.xw.text(VTC.CountryName);
          this.xw.endElement();
          this.xw.startElement('ISO');
          this.xw.text(VTC.CountryISO ? VTC.CountryISO : ' ');
          this.xw.endElement();
          this.xw.endElement();
        });
        this.xw.endElement();
      });
      this.xw.endElement();
      // Group
    } else if (CounterPartyCPType === 'O') {
      // operator
      const HomeOperator = paramData.CounterPartyTADIGCodes.find(x => x.OperatorId === CounterpartyOperatorId && x.IsSelected === true);
      this.xw.startElement('Operator');
      this.xw.writeAttribute('name', HomeOperator.OperatorName);
      const VisitorTadingCodes = paramData.CounterPartyTADIGCodes.filter(x => x.OperatorId === CounterpartyOperatorId && x.IsSelected === true);
      VisitorTadingCodes.forEach(VTC => {
        this.xw.startElement('PMNAnalysed');
        this.xw.writeAttribute('name', VTC.TadigCode);
        this.xw.startElement('TAPCode');
        this.xw.text(VTC.TadigCode);
        this.xw.endElement();
        this.xw.startElement('Country');
        this.xw.text(VTC.CountryName);
        this.xw.endElement();
        this.xw.startElement('ISO');
        this.xw.text(VTC.CountryISO ? VTC.CountryISO : ' ');
        this.xw.endElement();
        this.xw.endElement();
      });
      this.xw.endElement();
    }
    this.xw.endElement();
    //#endregion RoamingPartner party
    //offer tradeing entity
    if (((TypeID === 1) || (TypeID === 2 && DirectionID === 1)) && paramData.Offer) {
      this.setDiscountTypeDetails(paramData.Offer, 'Inbound', paramData, true);
    }
    //bid counter party //outbound
    if (((TypeID === 1) || (TypeID === 2 && DirectionID === 2))) {
      this.setDiscountTypeDetails(paramData.Bid, 'Outbound', paramData, false);
    }

    this.xw.endElement(); // Contract
    if (IsGenerate) {
      const blob = new Blob([this.xw], { type: 'application/xml;charset=UTF-8' });
      FileSaver.saveAs(blob, paramData.ReferenceNo + '.xml');
      return '';
    } else {
      return this.xw.output;
    }
  }


  checkExistValue(item, key, type?, searchkey?) {
    if (type === 'Array') {
      return (item && item[key]) ? item[key].map(x => x[searchkey]) : 'N/A';
    } else {
      return (item && item[key]) ? item[key] : 'N/A';
    }
  }
  convertDecimalFormat(rate) {
    return formatCurrency(rate, 'en', '', 'USD', '1.2-6');
  }
  convertCurruncyFormat(rate) {
    return formatNumber(rate, 'en');
  }

  setSettlement(type, tageName, party) {
    this.xw.startElement(tageName);
    this.xw.text('Party ' + party + ' ' + tageName);
    this.xw.writeElement('SE', this.checkExistValue(type, 'SettlementTypeName'));
    this.xw.writeElement('TT', this.checkExistValue(type, 'TaxTreatmentValue'));
    this.xw.writeElement('ES', (type && type.Exclusions && type.Exclusions.length > 0) ?
      this.checkExistValue(type, 'Exclusions', 'Array', 'ExclusionName').toString() : 'N/A');
    this.xw.writeElement('EC', (type && type.ExclusionsCountryRegion) ?
      this.checkExistValue(type.ExclusionsCountryRegion, 'Countries', 'Array', 'CountryName').toString()
      : 'N/A');
    this.xw.endElement();
  }

  setDiscountTypeDetails(Data, tageName, paramData, isTradingEntity) {
    this.xw.startElement(tageName);
    this.bindBidOfferData(Data, paramData, tageName, isTradingEntity);
    this.xw.endElement();
  }
  bindBidOfferData(Data, paramData, tageName, isTradingEntity) {
    this.CountryRegions = [];
    // #region "Exclusion Services"

    if (Data.Exclusions) {
      Data.Exclusions.forEach(exs => {
        this.xw.startElement('VoiceMOExclusionServices');
        this.xw.text(exs.ExclusionName);
        this.xw.endElement();
      });
    }

    // #endregion "Exclusion Services"

    // #region "Excluded Countries"

    if (Data.ExclusionsCountryRegion) {
      if (Data.ExclusionsCountryRegion.Countries) {
        Data.ExclusionsCountryRegion.Countries.forEach(exc => {
          this.xw.startElement('VoiceMOExcludedCountries');
          this.xw.startElement('Country');
          this.xw.text(exc.CountryName);
          this.xw.endElement();
          this.xw.startElement('ISO');
          this.xw.text(exc.CountryISO ? exc.CountryISO : ' ');
          this.xw.endElement();
          this.xw.endElement();
        });
      }
    }

    // #endregion

    // #region "Discount Model"
    this.xw.startElement('DiscountModel');
    if (Data.DiscountTypes) {
      Data.DiscountTypes.forEach(Dt => {
        this.xw.startElement('Type');
        this.xw.text(Dt.DiscountTypeName);
        this.xw.endElement();
      });
    }
    this.xw.endElement();
    // #endregion

    // #region "Tax Treatmen"
    if (Data.TaxTreatmentValue) {
      this.xw.startElement('TaxTreatment');
      this.xw.text(Data.TaxTreatmentValue);
      this.xw.endElement();
    }

    // #endregion

    // #region "Discount Periods"
    if (paramData.DiscountPeriods) {

      paramData.DiscountPeriods.forEach((Dp, i) => {
        this.xw.startElement('Period');
        this.xw.writeAttribute('name', Dp.DiscountPeriod);
        this.xw.writeAttribute('StartDate', Dp.DiscountPeriodStartDate);
        this.xw.writeAttribute('EndDate', Dp.DiscountPeriodEndDate);

        this.generateminimum(Data, i, isTradingEntity, false);
        if (Data.Financial && Data.Financial.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 1).DiscountTypeName);
          this.setAYCE(Data.Financial[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }
        if (Data.FlatRate && Data.FlatRate.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 5).DiscountTypeName);
          this.setFlateRate(Data.FlatRate[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }
        if (Data.BalancedUnbalanced && Data.BalancedUnbalanced.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 3).DiscountTypeName);
          this.setBalanceUnbalance(Data.BalancedUnbalanced[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }
        if (Data.BandedTiered && Data.BandedTiered.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 4).DiscountTypeName);
          this.setBandedTiered(Data.BandedTiered[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }
        if (Data.VolumeConditionalCommitment && Data.VolumeConditionalCommitment.length > 0) {
          Data.DiscountTypes.find(x => x.DiscountTypeID == 246);
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 6).DiscountTypeName);
          this.setVolumeConditionalCommitment(Data.VolumeConditionalCommitment[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }

        if (Data.FinancialWithFair && Data.FinancialWithFair.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 9).DiscountTypeName);
          this.setFinancialWithFair(Data.FinancialWithFair[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }

        if (Data.FinancialDiscountFair && Data.FinancialDiscountFair.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 10).DiscountTypeName);
          this.setFinancialDiscountFair(Data.FinancialDiscountFair[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }
        if (Data.MarketShare && Data.MarketShare.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 7).DiscountTypeName);
          this.setMarketShare(Data.MarketShare[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }

        if (Data.DiscountInvoice && Data.DiscountInvoice.length > 0) {
          this.xw.startElement('DiscountModel');
          this.xw.writeAttribute('Type', Data.DiscountTypes.find(x => x.DiscountTypeID == 8).DiscountTypeName);
          this.setDiscountInvoice(Data.DiscountInvoice[i].filter(x => x.isExclude === 0), isTradingEntity);
          this.xw.endElement();
        }

        // if (Data.M2M && Data.IsIncludeM2M) {


        //   this.xw.startElement('M2MDiscountModel');
        //   if (Data.M2M.IsTAP && Data.M2M.TAPCodeList && this.IsTrade) {
        //     this.xw.startElement('TAPCodes');
        //     this.getTap(Data, tageName === 'Inbound')
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M.IsAPN && Data.M2M.TAPCodeList && this.IsTrade) {
        //     this.xw.startElement('TAPCodes');
        //     this.getApn(Data);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.AccessFeeM2M && Data.M2M.AccessFeeM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', 'AccessFee');
        //     this.setAccessFee(Data.M2M.AccessFeeM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }

        //   this.generateminimum(Data, i, true);

        //   if (Data.M2M && Data.M2M.FinancialM2M && Data.M2M.FinancialM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 1).DiscountTypeName);
        //     this.setAYCE(Data.M2M.FinancialM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.FlatRateM2M && Data.M2M.FlatRateM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 5).DiscountTypeName);
        //     this.setFlateRate(Data.M2M.FlatRateM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.BalancedUnbalancedM2M && Data.M2M.BalancedUnbalancedM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 3).DiscountTypeName);
        //     this.setBalanceUnbalance(Data.M2M.BalancedUnbalancedM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.BandedTieredM2M && Data.M2M.BandedTieredM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 4).DiscountTypeName);
        //     this.setBandedTiered(Data.M2M.BandedTieredM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.VolumeConditionalCommitmentM2M && Data.M2M.VolumeConditionalCommitmentM2M.length > 0) {
        //     Data.DiscountTypes.find(x => x.DiscountTypeID == 246);
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 6).DiscountTypeName);
        //     this.setVolumeConditionalCommitment(Data.M2M.VolumeConditionalCommitmentM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.MarketShareM2M && Data.M2M.MarketShareM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 7).DiscountTypeName);
        //     this.setMarketShare(Data.M2M.MarketShareM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.DiscountInvoiceM2M && Data.M2M.DiscountInvoiceM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 8).DiscountTypeName);
        //     this.setDiscountInvoice(Data.M2M.DiscountInvoiceM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.FinancialWithFairM2M && Data.M2M.FinancialWithFairM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 9).DiscountTypeName);
        //     this.setFinancialWithFair(Data.M2M.FinancialWithFairM2M[i].filter(x => x.isExclude === 0), true);
        //     this.xw.endElement();
        //   }
        //   if (Data.M2M && Data.M2M.FinancialDiscountFairM2M && Data.M2M.FinancialDiscountFairM2M.length > 0) {
        //     this.xw.startElement('DiscountModel');
        //     this.xw.writeAttribute('Type', Data.M2M.DiscountTypes.find(x => x.DiscountTypeID == 10).DiscountTypeName);
        //     this.setFinancialDiscountFair(Data.M2M.FinancialDiscountFairM2M[i].filter(x => x.isExclude === 0));
        //     this.xw.endElement();
        //   }

        // }

        this.xw.endElement();
      });

    }

    // #region "m2m grids"



    // #endregion

    // #region "Custom regions"
    this.xw.startElement('CustomRegions');
    if (this.CountryRegions && this.CountryRegions.length > 0) {
      this.setCountryRegion();

    }
    this.xw.endElement();
    // #endregion

  }
  getApn(Data) {

    Data.M2M.APNList.forEach((element, index) => {
      this.xw.startElement('content');
      this.xw.writeElement('TADIGCode', element.TADIGCode);
      this.xw.writeElement('APNCode', element.APNCode);
      this.xw.endElement();
    });
  }
  getTap(Data, IsOffer) {
    Data.M2M.TAPCodeList.forEach((element, index) => {
      const AmandTapList = IsOffer ? Data.TradingEntityTADIGCodes : Data.CounterPartyTADIGCodes;
      const item = AmandTapList.filter(x => x.TadigId === element);
      this.xw.startElement('content');
      this.xw.writeElement('TADIGCode', element.TADIGCode);
      item[0].TadigCode
      this.xw.endElement();
    });
  }

  generateminimum(Data, i, isTradingEntity, IsM2M = false) {
    if (!IsM2M) {
      if ((Data.MinimumPaymentCommitment && Data.MinimumPaymentCommitment.length > 0) && !(Data.Financial && Data.Financial.length > 0)) {
        this.xw.startElement('MinimumPaymentCommitment');
        this.setMinimumPayment(Data.MinimumPaymentCommitment[i].filter(x => x.isExclude === 0), isTradingEntity);
        this.xw.endElement();
      }
    } else {

      if ((Data.M2M && Data.M2M.MinimumPaymentCommitmentM2M && Data.M2M.MinimumPaymentCommitmentM2M.length > 0) && !(Data.M2M.Financial && Data.M2M.Financial.length > 0)) {
        this.xw.startElement('MinimumPaymentCommitment');
        this.setMinimumPayment(Data.M2M.MinimumPaymentCommitmentM2M[i].filter(x => x.isExclude === 0), isTradingEntity);
        this.xw.endElement();
      }
    }
  }
  setMinimumPayment(Data, isTradingEntity) {
    Data.forEach((element) => {
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.AppliesToCode.toString() : element.AppliesTo.map(x => x.TadigCode).toString());
      // this.xw.writeElement('RoamingOn', this.IsTrade ? element.RoamingOnCode.toString() : element.RoamingOn.map(x => x.CountryName).toString());

      const AppliesTo = this.IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode);
      AppliesTo.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const RoamingOn = this.IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName)
      const RoamingOn = this.IsTrade ? this.GetCountryTradingCode(element.RoamingOn, isTradingEntity) : this.GetCountryTradingCode(element.RoamingOn.map(x => x.CountryID), isTradingEntity);
      RoamingOn.forEach(el => {
        this.xw.startElement('RoamingOn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.CountryISO : element.RoamingOn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('Amount', element.Commitment ? element.Commitment : ' ');
      this.xw.endElement();
    });
  }

  setMarketShare(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.AppliesToCode.toString() : element.AppliesTo.map(x => x.TadigCode).toString());
      // this.xw.writeElement('RoamingOn', this.IsTrade ? element.RoamingOnCode.toString() : element.RoamingOn.map(x => x.CountryName).toString());
      const AppliesTo = this.IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode);
      AppliesTo.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const RoamingOn = this.IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName)
      const RoamingOn = this.IsTrade ? this.GetCountryTradingCode(element.RoamingOn, isTradingEntity) : this.GetCountryTradingCode(element.RoamingOn.map(x => x.CountryID), isTradingEntity);
      RoamingOn.forEach(el => {
        this.xw.startElement('RoamingOn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.CountryISO : element.RoamingOn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }
      this.xw.writeElement('Amount', element.VolumePercentage ? element.VolumePercentage + '%' : ' ');
      this.xw.endElement();
    });
  }

  setVolumeConditionalCommitment(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.AppliesToCode.toString() : element.AppliesTo.map(x => x.TadigCode).toString());
      // this.xw.writeElement('RoamingOn', this.IsTrade ? element.RoamingOnCode.toString() : element.RoamingOn.map(x => x.CountryName).toString());

      const AppliesTo = this.IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode);
      AppliesTo.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const RoamingOn = this.IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName)
      const RoamingOn = this.IsTrade ? this.GetCountryTradingCode(element.RoamingOn, isTradingEntity) : this.GetCountryTradingCode(element.RoamingOn.map(x => x.CountryID), isTradingEntity);
      RoamingOn.forEach(el => {
        this.xw.startElement('RoamingOn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.CountryISO : element.RoamingOn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('Amount', element.Volume ? element.Volume : ' ');
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      this.xw.endElement();
      this.xw.endElement();

    });
  }

  setAccessFee(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      const Services = this.IsTrade ? element.ServiceName : element.ServiceName;
      this.xw.startElement('content');
      this.xw.writeElement('Services', Services.toString());
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());

      const AppliesTo = this.IsTrade ? element.AppliesToCode : element.AppliesTo.map(x => x.TadigCode);
      AppliesTo.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const RoamingOn = this.IsTrade ? element.RoamingOnCode : element.RoamingOn.map(x => x.CountryName)
      const RoamingOn = this.IsTrade ? this.GetCountryTradingCode(element.RoamingOn, isTradingEntity) : this.GetCountryTradingCode(element.RoamingOn.map(x => x.CountryID), isTradingEntity);
      RoamingOn.forEach(el => {
        this.xw.startElement('RoamingOn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.RoamingOnISO : element.RoamingOn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('TrafficRate', this.convertDecimalFormat(element.RatePerIMSI));
      this.xw.writeElement('ChargeInterval', element.ChargeIntervalNAME ? element.ChargeIntervalNAME : '');
      this.xw.endElement();
    });
  }

  setAYCE(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      const Services = this.IsTrade ? element.ServicesName : element.Services.map(x => x.ServiceName);
      this.xw.startElement('content');
      this.xw.writeElement('Services', Services.toString());
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());
      const AppliesTo = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      AppliesTo.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const RoamingOn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const RoamingOn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      RoamingOn.forEach(el => {
        this.xw.startElement('RoamingOn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('TrafficRate', this.convertDecimalFormat(element.AYCERate));
      this.xw.endElement();
    });

  }

  setFlateRate(Data, isTradingEntity, IsM2M = false,) {
    Data.forEach((element) => {
      this.mapRegionCountry(element);
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());

      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      if (!IsM2M) {
        this.xw.writeElement('TerminatedIn', element.TerminatedName ? element.TerminatedName : ' ');
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('TrafficRate', this.convertDecimalFormat(element.TrafficRate));
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      this.xw.endElement();
      this.xw.endElement();
    });
  }

  setBalanceUnbalance(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.mapRegionCountry(element);
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());
      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      if (!IsM2M) {
        this.xw.writeElement('TerminatedIn', element.TerminatedName ? element.TerminatedName : ' ');
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.startElement('TrafficRate');
      this.xw.writeElement('Balanced', this.convertDecimalFormat(element.BalancedTrafficRate));
      this.xw.writeElement('Unbalanced', this.convertDecimalFormat(element.UnbalancedTrafficRate));
      this.xw.endElement();
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      if (IsM2M) {
        this.xw.writeElement('ThresholdCalculatedName', element.ThresholdCalculatedName ? element.ThresholdCalculatedName : ' ');
        this.xw.writeElement('ThresholdCalculationTypeName', element.ThresholdCalculationTypeName ? element.ThresholdCalculationTypeName : ' ');
        this.xw.writeElement('IMSIApplicationFeeName', element.IMSIApplicationFeeName ? element.IMSIApplicationFeeName : ' ');
      }
      this.xw.endElement();
      this.xw.endElement();
    });
  }

  setBandedTiered(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.mapRegionCountry(element);
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());
      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      if (!IsM2M) {
        this.xw.writeElement('TerminatedIn', element.TerminatedName ? element.TerminatedName : ' ');
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.startElement('Band');
      element.Bands.forEach((elb) => {
        this.xw.startElement('BandDetails');
        this.xw.writeElement('ThresholdType', elb.BandThresholdTypeName ? elb.BandThresholdTypeName : ' ');
        this.xw.writeElement('TrafficRate', this.convertDecimalFormat(elb.TrafficRate));
        this.xw.writeElement('LowerThresholdInc', this.convertDecimalFormat(elb.BandThreshold));
        this.xw.writeElement('HigherThresholdExc', this.convertDecimalFormat(elb.BandThreshold));
        this.xw.writeElement('BackToFirst', elb.IsBandBackToFirst ? 'True' : 'false');
        this.xw.endElement();
      });
      this.xw.endElement();
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      this.xw.endElement();
      this.xw.endElement();
    });

  }

  setDiscountInvoice(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.mapRegionCountry(element);
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());
      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      if (!IsM2M) {
        this.xw.writeElement('TerminatedIn', element.TerminatedName ? element.TerminatedName : ' ');
      }
      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('TrafficRate', this.convertDecimalFormat(element.DiscountPercentage));
      this.xw.endElement();
      this.xw.endElement();
    });
  }

  setFinancialWithFair(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());
      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.writeElement('TrafficRate', this.convertDecimalFormat(element.AYCERate));
      this.xw.writeElement('FairUseCAP', this.convertDecimalFormat(element.FairUseCAP));
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      this.xw.endElement();
      this.xw.endElement();
    });
  }

  setFinancialDiscountFair(Data, isTradingEntity, IsM2M = false) {
    Data.forEach((element) => {
      this.mapRegionCountry(element);
      this.xw.startElement(element.ServiceName.replace(/ +/g, ''));
      this.xw.startElement('content');
      // this.xw.writeElement('PMNAnalysed', this.IsTrade ? element.OperatorAffiliateName.toString() : element.OperatorAffiliate.map(x => x.TadigCode).toString());
      // this.xw.writeElement('OriginatedIn', this.IsTrade ? element.OriginatedInName.toString() : element.OriginatedIn.map(x => x.CountryName).toString());

      const OperatorAffiliate = this.IsTrade ? element.OperatorAffiliateName : element.OperatorAffiliate.map(x => x.TadigCode);
      OperatorAffiliate.forEach(el => {
        this.xw.startElement('HomePMN');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      //const OriginatedIn = this.IsTrade ? element.OriginatedInName : element.OriginatedIn.map(x => x.CountryName);
      const OriginatedIn = this.IsTrade ? this.GetCountryTradingCode(element.OriginatedIn, isTradingEntity) : this.GetCountryTradingCode(element.OriginatedIn.map(x => x.CountryID), isTradingEntity);
      OriginatedIn.forEach(el => {
        this.xw.startElement('OriginatedIn');
        this.xw.text(el ? el.toString() : ' ');
        this.xw.endElement();
      });

      const CountryISOList = this.IsTrade ? element.OriginatedInISO : element.OriginatedIn.map(x => x.CountryISO);
      if (CountryISOList) {
        CountryISOList.forEach(el => {
          this.xw.startElement('ISO');
          this.xw.text(el ? el.toString() : ' ');
          this.xw.endElement();
        });
      }

      this.xw.writeElement('Currency', element.ISO ? element.ISO : ' ');
      this.xw.startElement('Band');
      element.Bands.forEach((elb) => {
        this.xw.startElement('BandDetails');
        this.xw.writeElement('ThresholdType', elb.BandThresholdTypeName ? elb.BandThresholdTypeName : ' ');
        this.xw.writeElement('TrafficRate', this.convertDecimalFormat(elb.TrafficRate));
        this.xw.writeElement('LowerThresholdInc', this.convertDecimalFormat(elb.BandThreshold));
        this.xw.writeElement('HigherThresholdExc', this.convertDecimalFormat(elb.BandThreshold));
        this.xw.writeElement('BackToFirst', elb.IsBandBackToFirst ? 'True' : 'false');
        this.xw.endElement();
      });
      this.xw.endElement();
      this.xw.writeElement('Per', element.PerUnitName ? element.PerUnitName : ' ');
      this.xw.writeElement('ChargingInterval', element.ChargingIntervalName ? element.ChargingIntervalName : ' ');
      this.xw.endElement();
      this.xw.endElement();
    });
  }

  setCountryRegion() {
    const result = [];
    const map = new Map();
    for (const item of this.CountryRegions) {
      if (!map.has(item.Region)) {
        map.set(item.Region, true);    // set any value to Map
        result.push({
          Region: item.Region,
          Countries: item.Countries,
          CountryISO: item.CountryISO
        });
      }
    }
    result.forEach(x => {
      this.xw.startElement('Regions');
      this.xw.writeAttribute('name', x.Region);
      const countries = x.Countries.split(',');
      const countryISOs = x.CountryISO.split(',');
      countries.forEach((country, i) => {
        this.xw.startElement('Country');
        this.xw.text(countries[i]);
        this.xw.endElement();
        this.xw.startElement('ISO');
        this.xw.text(countryISOs[i]);
        this.xw.endElement();
      });

      this.xw.endElement();
    });
  }

  mapRegionCountry(el: any) {
    if (el.RegionCountryID && el.RegionCountryID.length > 0 && el.TerminatedTypeID !== 1) {
      this.CountryRegions.push({ 'Region': el.TerminatedName, 'Countries': el.RegionCountryID.map(n => n.CountryName).toString(), 'CountryISO': el.RegionCountryID.map(n => n.CountryISO).toString(), });
    }

  }

  getUniqueOperator(data, key): any {
    var flags = [], output = [], l = data.length, i;
    for (i = 0; i < l; i++) {
      if (flags[data[i][key]]) continue;
      flags[data[i][key]] = true;
      output.push(data[i][key]);
    }
    return output;
  }
  getDate(date) {
    return date ? moment(date).locale('en').utc().format('DD MMMM YYYY') : 'N/A';
  }
  getDateFormat(date) {
    return date ? moment(date, 'DD/MM/YYYY').locale('en').format('DD MMMM YYYY') : 'N/A';
  }
  getTemplate(TemplateName: any, data, IsTrade) {
    const Template = TemplateName.split('-');
    if (Template[0].trim() === 'My Template') {
      return data.TradingEntityName + ' ' + 'Template';
    } else if (Template[0].trim() === 'Counterparty Template') {
      return IsTrade ? (data.CounterParty[0].OperatorName + ' ' + 'Template') : (data.CounterPartyName + ' ' + 'Template');
    } else {
      return Template[0].trim();
    }
  }
  GetCountryTradingCode(AppliesTo, isTradingEntity) {
    const RootAmendTapCodeArray = isTradingEntity ? this.TradingEntityTADIGCodes : this.CounterPartyTADIGCodes;
    if (RootAmendTapCodeArray && RootAmendTapCodeArray.length > 0) {
      return RootAmendTapCodeArray.filter(x => AppliesTo.includes(x.CountryID) && x.IsSelected == true).map(t => t.TadigCode);
    }

  }
}
