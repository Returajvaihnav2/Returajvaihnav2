import { Injectable } from '@angular/core';
import * as XMLWriter from 'xml-writer';
import * as FileSaver from 'file-saver';
import { formatCurrency, formatNumber } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class XmlContractService {
  xw = new XMLWriter;
  constructor() { }
  public generateXml(paramData: any) {
    // Start XML Node
    this.xw = new XMLWriter;
    this.xw.startDocument();
    this.xw.startElement('Root');
    this.xw.text('*DealFast Pricing  Excel Sheet');
    const TypeID = paramData.TypeID;
    const DirectionID = paramData.DirectionID;
    this.xw.startElement('CID');
    this.xw.text(this.checkExistValue(paramData, 'ReferenceNo'));
    this.xw.endElement(); // Contract ID

    this.xw.startElement('DT');
    this.xw.text(this.checkExistValue(paramData, 'ContractDealType'));
    this.xw.endElement(); // Deal Type

    this.xw.startElement('Di');
    this.xw.text(paramData.TypeName);
    this.xw.endElement(); // Direction

    this.xw.startElement('PA');
    this.xw.text(paramData.TradingEntityName);
    this.xw.endElement(); // Party A
    this.xw.startElement('PATCID');
    this.xw.text(paramData.TradingEntityTCID);
    this.xw.endElement(); // Party A TCID
    this.xw.startElement('PATC');
    this.xw.text(this.checkExistValue(paramData, 'TradingEntityTADIGCodes', 'Array', 'TadigCode').toString());
    this.xw.endElement(); // Party A Tape Code

    this.xw.startElement('PB');
    this.xw.text(paramData.CounterPartyName);
    this.xw.endElement();  // Party B
    this.xw.startElement('PBTCID');
    this.xw.text(paramData.CounterPartyTCID);
    this.xw.endElement(); // Party B TCID
    this.xw.startElement('PBTC');
    this.xw.text(this.checkExistValue(paramData, 'CounterPartyTADIGCodes', 'Array', 'TadigCode').toString());
    this.xw.endElement(); // Party B Tape Code

    this.xw.startElement('TD');
    this.xw.text(this.checkExistValue(paramData, 'TradeDate'));
    this.xw.endElement(); // Trade Date
    this.xw.startElement('SD');
    this.xw.text(paramData.StartDate);
    this.xw.endElement(); // Start Date
    this.xw.startElement('AR');
    this.xw.text(paramData.IsAutoRenewal ? 'True' : 'False');
    this.xw.endElement(); // Auto Renewal
    this.xw.startElement('EdOFDP');
    this.xw.text(this.checkExistValue(paramData, 'EndDate'));
    this.xw.endElement(); // End date of First of Discount Period
    this.xw.startElement('NODP');
    this.xw.text(this.checkExistValue(paramData, 'NoOfDiscountPeriods'));
    this.xw.endElement(); // Number of Discount Period
    this.xw.startElement('LODP');
    this.xw.text(this.checkExistValue(paramData, 'DiscountPeriodName'));
    this.xw.endElement(); // length of Discount Period
    this.xw.startElement('ANP');
    this.xw.text(this.checkExistValue(paramData, 'TerminationName'));
    this.xw.endElement(); // Agreement Notification Period

    this.xw.startElement('DP');
    this.xw.text('Discount Periods -' + (paramData.isLongStub ? 'Long stub' : 'Short stub'));
    paramData.DiscountPeriods.forEach((el) => {
      this.xw.startElement('DPD');
      this.xw.writeElement('DPSN', el.DiscountPeriod);
      this.xw.writeElement('DPSD', el.DiscountPeriodStartDate);
      this.xw.writeElement('DPED', el.DiscountPeriodEndDate);
      this.xw.endElement(); // DPD
    });
    this.xw.endElement(); // DP

    if (paramData.Offer) {
      this.setSettlement(paramData.Offer, 'HPMN', 'A');
    }
    if (paramData.Bid) {
      this.setSettlement(paramData.Bid, 'VPMN', 'B');
    }

    if (((TypeID === 1) || (TypeID === 2 && DirectionID === 1)) && paramData.Offer) {
      this.setDiscountTypeDetails(paramData.Offer, 'HPMNPG');
    }

    if (((TypeID === 1) || (TypeID === 2 && DirectionID === 2))) {
      this.setDiscountTypeDetails(paramData.Bid, 'VPMNPG');
    }

    this.xw.endElement(); // Contract
    const blob = new Blob([this.xw], { type: 'application/xml;charset=UTF-8' });
    FileSaver.saveAs(blob, paramData.ReferenceNo + '.xml');
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

  setDiscountTypeDetails(Data, tageName) {
    this.xw.startElement(tageName);
    if (Data.MinimumPaymentCommitment && Data.MinimumPaymentCommitment.length > 0) {
      this.setMinimumPayment(Data.MinimumPaymentCommitment);
    }
    if (Data.FlatRate && Data.FlatRate.length > 0) {
      this.setFlateRate(Data.FlatRate);
    }
    if (Data.Financial && Data.Financial.length > 0) {
      this.setAYCE(Data.MinimumPaymentCommitment);
    }
    if (Data.BalancedUnbalanced && Data.BalancedUnbalanced.length > 0) {
      this.setBalanceUnbalance(Data.BalancedUnbalanced);
    }
    if (Data.BandedTiered && Data.BandedTiered.length > 0) {
      this.setBandedTiered(Data.BandedTiered);
    }
    this.xw.endElement();
  }

  setMinimumPayment(Data) {
    this.xw.startElement('MPC');
    Data.forEach((el, index) => {
      this.xw.startElement('P' + (index + 1));
      el.forEach((element, Rindex) => {
        this.xw.startElement('R' + (Rindex + 1));
        this.xw.writeElement('AT', element.AppliesTo.map(x => x.TadigCode).toString());
        this.xw.writeElement('RO', element.RoamingOn.map(x => x.CountryName).toString());
        this.xw.writeElement('ISO', element.ISO ? element.ISO : '');
        this.xw.writeElement('CM', element.Commitment ? element.Commitment : '');
        this.xw.endElement();
      });
      this.xw.endElement();
    });
    this.xw.endElement(); // MPC- Minimum Payment Commitment
  }

  setAYCE(Data) {
    this.xw.startElement('AYCE');
    Data.forEach((el, index) => {
      this.xw.startElement('P' + (index + 1));
      el.forEach((element, Rindex) => {
        this.xw.startElement('R' + (Rindex + 1));
        this.xw.writeElement('SN', element.Services.map(x => x.ServiceName).toString());
        this.xw.writeElement('OF', element.OperatorAffiliate.map(x => x.TadigCode).toString());
        this.xw.writeElement('OI', element.OriginatedIn.map(x => x.CountryName).toString());
        this.xw.writeElement('ISO', element.ISO ? element.ISO : '');
        this.xw.writeElement('RT', this.convertDecimalFormat(element.AYCERate));
        this.xw.endElement();
      });
      this.xw.endElement();
    });
    this.xw.endElement();
  }

  setFlateRate(Data) {
    this.xw.startElement('FR');
    Data.forEach((el, index) => {
      this.xw.startElement('P' + (index + 1));
      el.forEach((element, Rindex) => {
        this.xw.startElement('R' + (Rindex + 1));
        this.xw.writeElement('SN', element.ServiceName ? element.ServiceName : '');
        this.xw.writeElement('OF', element.OperatorAffiliate.map(x => x.TadigCode).toString());
        this.xw.writeElement('OI', element.OriginatedIn.map(x => x.CountryName).toString());
        this.xw.writeElement('TN', element.TerminatedName ? element.TerminatedName : '');
        this.xw.writeElement('ISO', element.ISO ? element.ISO : '');
        this.xw.writeElement('RT', this.convertDecimalFormat(element.TrafficRate));
        this.xw.writeElement('PU', element.PerUnitName ? element.PerUnitName : '');
        this.xw.writeElement('CI', element.ChargingIntervalName ? element.ChargingIntervalName : '');
        this.xw.endElement();
      });
      this.xw.endElement();
    });
    this.xw.endElement(); // FR- FlatRate
  }

  setBalanceUnbalance(Data) {
    this.xw.startElement('BU');
    Data.forEach((el, index) => {
      this.xw.startElement('P' + (index + 1));
      el.forEach((element, Rindex) => {
        this.xw.startElement('R' + (Rindex + 1));
        this.xw.writeElement('SN', element.ServiceName ? element.ServiceName : '');
        this.xw.writeElement('OF', element.OperatorAffiliate.map(x => x.TadigCode).toString());
        this.xw.writeElement('OI', element.OriginatedIn.map(x => x.CountryName).toString());
        this.xw.writeElement('TN', element.TerminatedName ? element.TerminatedName : '');
        this.xw.writeElement('ISO', element.ISO ? element.ISO : '');
        this.xw.writeElement('BRT', this.convertDecimalFormat(element.BalancedTrafficRate));
        this.xw.writeElement('URT', this.convertDecimalFormat(element.UnbalancedTrafficRate));
        this.xw.writeElement('PU', element.PerUnitName ? element.PerUnitName : '');
        this.xw.writeElement('CI', element.ChargingIntervalName ? element.ChargingIntervalName : '');
        this.xw.endElement();
      });
      this.xw.endElement();
    });
    this.xw.endElement();
  }

  setBandedTiered(Data) {
    this.xw.startElement('BT');
    Data.forEach((el, index) => {
      this.xw.startElement('P' + (index + 1));
      el.forEach((element, Rindex) => {
        this.xw.startElement('R' + (Rindex + 1));
        this.xw.writeElement('SN', element.ServiceName ? element.ServiceName : '');
        this.xw.writeElement('OF', element.OperatorAffiliate.map(x => x.TadigCode).toString());
        this.xw.writeElement('OI', element.OriginatedIn.map(x => x.CountryName).toString());
        this.xw.writeElement('TN', element.TerminatedName ? element.TerminatedName : '');
        this.xw.writeElement('ISO', element.ISO ? element.ISO : '');
        this.xw.startElement('B');
        element.Bands.forEach((elb, Bindex) => {
          this.xw.startElement('B' + (Bindex + 1));
          this.xw.writeElement('BThTN', elb.BandThresholdTypeName ? elb.BandThresholdTypeName : '');
          this.xw.writeElement('TR', this.convertDecimalFormat(elb.TrafficRate));
          this.xw.writeElement('BTh', this.convertDecimalFormat(elb.BandThreshold));
          this.xw.writeElement('BTF', elb.IsBandBackToFirst ? 'True' : 'false');
          this.xw.endElement();
        });
        this.xw.endElement();
        this.xw.writeElement('PU', element.PerUnitName ? element.PerUnitName : '');
        this.xw.writeElement('CI', element.ChargingIntervalName ? element.ChargingIntervalName : '');
        this.xw.endElement();
      });
      this.xw.endElement();
    });
    this.xw.endElement();
  }
}
