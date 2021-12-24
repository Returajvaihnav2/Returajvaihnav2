import { Injectable } from '@angular/core';
import * as XMLWriter from 'xml-writer';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { BrowserStorageService } from '../../utility/browser-storage.service';
import { TapInstructionService } from '../tap-instruction/tap-instruction.service';
@Injectable({
  providedIn: 'root'
})
export class XmlService {
  xw = new XMLWriter;
  IsSend: boolean;
  isAutoRenewalRoot: any;
  constructor(private browserStorageService: BrowserStorageService, public tapInstructionService: TapInstructionService) { }

  public generateXml(paramData: any, _ReferenceNo, IsSend = false, isAutoRenewalRoot): any {
    return new Promise((resolve, reject) => {
      this.isAutoRenewalRoot = isAutoRenewalRoot;
      // Start XML Node
      this.IsSend = IsSend;
      this.xw = new XMLWriter;
      this.xw.startDocument();
      this.xw.startElement('root');
      this.xw.text('*TAP Instruction sheet created and approved on the Tritex IOT Management platform');
      const TypeID = paramData.newTAPInstructionForm.TypeID;
      const DirectionID = paramData.newTAPInstructionForm.DirectionID;
      this.xw.writeElement('Autorenewal', this.isAutoRenewalRoot ? 'Yes' : 'No')
      if ((TypeID === 1) || (TypeID === 2 && DirectionID === 1)) {
        if (paramData.newTAPInstructionForm.HomeEntity) {
          this.xw.startElement('homesection').writeAttribute('CHRG', paramData.newTAPInstructionForm.TradingEntityTCID
            + ' Charges ' + paramData.newTAPInstructionForm.CounterPartyTCID);
          //  this.generateNode(paramData, true); // For Home

          switch (paramData.newTAPInstructionForm.HomeDataClearingHosuseID) {
            case 4: //Comfone
              this.comfoneGenerateNode(paramData, true); // For Home
              break;
            default:
              this.generateNode(paramData, true); // For Home
              //this.comfoneGenerateNode(paramData, true);
              break
          }
          this.xw.endElement(); // chargesection
        }
      }
      if ((TypeID === 1) || (TypeID === 2 && DirectionID === 2)) {
        if (paramData.newTAPInstructionForm.HomeEntity) {
          this.xw.startElement('visitorsection').writeAttribute('CHRG',
            paramData.newTAPInstructionForm.CounterPartyTCID + ' Charges ' + paramData.newTAPInstructionForm.TradingEntityTCID);
          // this.generateNode(paramData, false); // For Visitor
          switch (paramData.newTAPInstructionForm.VisitorDataClearingHosuseID) {
            case 4: //Comfone
              this.comfoneGenerateNode(paramData, false); // For Visitor
              break;
            default:
              this.generateNode(paramData, false); // For Visitor
              //this.comfoneGenerateNode(paramData, false);
              break;
          }
          this.xw.endElement(); // chargesection
        }
      }
      // //#region  "Created by and CreateDate"
      const email = paramData.newTAPInstructionForm.CreatedEmail ?
        paramData.newTAPInstructionForm.CreatedEmail : this.browserStorageService.getLocalStorageItem('emailId');
      const date = paramData.newTAPInstructionForm.CreatedDate ? paramData.newTAPInstructionForm.CreatedDate :
        moment().toString();
      this.xw.writeElement('UM', email);
      this.xw.writeElement('CD', date);
      this.xw.endElement();
      // //#endregion
      if (this.IsSend) {
        return resolve(this.xw.output);
      } else {
        const blob = new Blob([this.xw], { type: 'application/xml;charset=UTF-8' });
        FileSaver.saveAs(blob, _ReferenceNo ? _ReferenceNo : 'temporary' + '.xml');
        return resolve(blob);
      }
    });

  }


  generateNode(paramData, isHome) {
    const tapValue = paramData.newTAPInstructionForm;
    const taxTreatmentList = paramData.taxTreatmentList;
    const chargingIntervalEnumList = paramData.chargingIntervalEnumList;
    const perEnumList = paramData.perEnumList;
    const serviceList = paramData.serviceList;
    const tapServiceList = paramData.tapServiceList;

    const _entity = isHome ? tapValue.HomeEntity : tapValue.VisitorEntity;


    _entity.forEach(element => {

      this.xw.startElement('opsection');
      const ISO = element.OperatorCurrencyISO;
      if (isHome) {
        this.xw.writeAttribute('HOMEOP', element.OperatorName);
        this.xw.writeAttribute('HOMETCID', element.OperatorCode);
        this.xw.writeAttribute('VISITOR', tapValue.CounterParty);
      } else {
        this.xw.writeAttribute('HOMEOP', element.OperatorName);
        this.xw.writeAttribute('HOMETCID', element.OperatorCode);
        this.xw.writeAttribute('VISITOR', tapValue.TradingEntity);
      }
      this.xw.writeAttribute('EFDT', element.TradeStartDate);
      this.xw.writeAttribute('TRDT', element.TradeEndDate);

      element.EntityDetails[0].TapService.forEach((eleTapService, periodIndex) => {
        // const tempEleTabDetails = eleTapService.TapService[periodIndex];
        let IsEndDateAllow = true;
        if (element.EntityDetails[0].TapService.length - 1 === periodIndex && this.isAutoRenewalRoot) {
          IsEndDateAllow = false;
        }


        this.xw.startElement('PD');
        this.xw.writeAttribute('P', 'Period' + Number(periodIndex + 1));
        this.xw.writeAttribute('SDT', eleTapService.StartDate);
        this.xw.writeAttribute('EDT', (IsEndDateAllow) ? eleTapService.EndDate as string : 'N/A');
        this.xw.writeAttribute('ISO', (ISO) ? ISO as string : 'N/A');
        element.EntityDetails.forEach((eleEntity, entityIndex) => {
          // const eleTabDetails = eleEntity.TapService[periodIndex].TapServicePeriodWise;
          const row = eleEntity.TapService[periodIndex];
          if (!((row.isExclude && row.isExclude === 1) || (row.isRemove && row.isRemove === 1))) {
            this.xw.startElement('RW');
            this.xw.writeAttribute('HOME', eleEntity.PartyATAPCode);
            this.xw.writeAttribute('VISITOR', eleEntity.PartyBTAPCode);
            this.xw.writeAttribute('E', (element.Exclusions) ? element.Exclusions : 'N/A');
            this.xw.writeAttribute('T', taxTreatmentList.filter(x => x.EnumID === eleEntity.TaxTreatmentEnumID)
              .map(x => x.DisplayName).toString());
            row.TapServicePeriodWise.forEach((eleTab) => {
              this.xw.startElement('RD');
              // this.xw.writeAttribute('MS', tapServiceList.filter(x => x.EnumID === eleTab.TapServiceEnumID)
              //   .map(x => x.SubType).toString());
              this.xw.writeAttribute('MS', eleTab.TapServiceName);
              this.xw.writeAttribute('SS', serviceList.filter(x => x.EnumID === eleTab.ServiceEnumID).map(x => x.DisplayName).toString());

              this.xw.writeElement('R', (eleTab.O_Rate > -1) ? eleTab.Rate as string : (eleTab.O_Rate === -2) ? '' : (eleTab.TapServiceEnumID === 8) ? 'N/A' : 'AA14');
              if (eleTab.TapServiceEnumID === 7 || eleTab.TapServiceEnumID === 8) {
                this.xw.writeElement('P', perEnumList.filter(x => x.EnumID === eleTab.PerEnumID).map(x => x.DisplayName).toString());
              }
              this.xw.writeElement('I', chargingIntervalEnumList.filter(x => x.EnumID === eleTab.IntervalEnumID)
                .map(x => x.DisplayName).toString());
              //#region "RegionCountery"
              // __________________ Node Based output of RegionCountry___________________________
              if (eleTab.TAPRegionCountry && eleTab.TAPRegionCountry.length > 0) {
                this.xw.startElement('RC'); // RC-RegionCountry Starting
                eleTab.TAPRegionCountry.forEach(e => {
                  this.xw.startElement('C'); // Countery Starting
                  this.xw.writeElement('CN', e.CountryName); // Countery Name
                  this.xw.writeElement('ISO', e.CountryISO); // Countery ISO
                  this.xw.endElement(); // C-Countery Closing
                });
                this.xw.endElement(); // RC-RegionCountry Closing
              }
              // //#region "country Region for Home and row"
              if (tapValue.HomeLocalCountry) {
                const HomeCountry = tapValue.HomeLocalCountry.filter(x => x.PartyATapCode === eleEntity.PartyATAPCode);
                const LocalCountry = tapValue.HomeLocalCountry.filter(x => x.PartyATapCode === eleEntity.PartyBTAPCode);
                if (eleTab.ServiceEnumID === 1 && eleTab.TapServiceEnumID === 1 && eleTab.TerminatedTypeID === 1) {
                  // MOC LOCAL
                  if (LocalCountry && LocalCountry.length > 0) {
                    this.xw.startElement('RC'); // RC-RegionCountry Starting
                    LocalCountry.forEach(e => {
                      this.xw.startElement('C'); // Countery Starting
                      this.xw.writeElement('CN', e.PartyACountryName); // Countery Name
                      this.xw.writeElement('ISO', e.PartyAISO); // Countery ISO
                      this.xw.endElement(); // C-Countery Closing
                    });
                    this.xw.endElement(); // RC-RegionCountry Closing
                  }
                }

                if (eleTab.ServiceEnumID === 1 && eleTab.TapServiceEnumID === 2 && eleTab.TerminatedTypeID === 1) {
                  // MOC Home
                  if (HomeCountry && HomeCountry.length > 0) {
                    this.xw.startElement('RC'); // RC-RegionCountry Starting
                    HomeCountry.forEach(e => {
                      this.xw.startElement('C'); // Countery Starting
                      this.xw.writeElement('CN', e.PartyACountryName); // Countery Name
                      this.xw.writeElement('ISO', e.PartyAISO); // Countery ISO
                      this.xw.endElement(); // C-Countery Closing
                    });
                    this.xw.endElement(); // RC-RegionCountry Closing
                  }
                }
              }
              ////#endregion
              // ___________________________________________________________________________________

              // __________________ Attribute Based output of RegionCountry___________________________

              // if (eleTab.TAPRegionCountry && eleTab.TAPRegionCountry.length > 0) {
              //   this.xw.startElement('RC');
              //   eleTab.TAPRegionCountry.forEach(e => {
              //     this.xw.startElement('C');
              //     this.xw.writeAttribute('CN', e.CountryName);
              //     this.xw.writeAttribute('ISO', e.CountryISO);
              //     this.xw.endElement(); // C
              //   });
              //   this.xw.endElement(); // RC
              // }
              // ___________________________________________________________________________________
              //#region

              this.xw.endElement(); // RD
            });
            this.xw.endElement(); // RW
          }
        });
        this.xw.endElement(); // PD
      });
      this.xw.endElement();
    });
  }


  comfoneGenerateNode(paramData, isHome) {
    const tapValue = paramData.newTAPInstructionForm;
    const taxTreatmentList = paramData.taxTreatmentList;
    const chargingIntervalEnumList = paramData.chargingIntervalEnumList;
    const perEnumList = paramData.perEnumList;
    const serviceList = paramData.serviceList;
    const tapServiceList = paramData.tapServiceList;

    const _entity = isHome ? tapValue.HomeEntity : tapValue.VisitorEntity;


    _entity.forEach(element => {

      this.xw.startElement('opsection');
      const ISO = element.OperatorCurrencyISO;
      if (isHome) {
        this.xw.writeAttribute('HOMEOP', element.OperatorName);
        this.xw.writeAttribute('HOMETCID', element.OperatorCode);
        this.xw.writeAttribute('VISITOR', tapValue.CounterParty);
      } else {
        this.xw.writeAttribute('HOMEOP', element.OperatorName);
        this.xw.writeAttribute('HOMETCID', element.OperatorCode);
        this.xw.writeAttribute('VISITOR', tapValue.TradingEntity);
      }
      this.xw.writeAttribute('EFDT', element.TradeStartDate);
      this.xw.writeAttribute('TRDT', element.TradeEndDate);


      const exclusionsArray = [];
      let exclusions = 0
      if (element.Exclusions) {
        exclusionsArray.push(element.Exclusions.split(','));
        exclusions = element.Exclusions.split(',').length;
      }


      element.EntityDetails[0].TapService.forEach((eleTapService, periodIndex) => {
        // const tempEleTabDetails = eleTapService.TapService[periodIndex];
        let IsEndDateAllow = true;
        if (element.EntityDetails[0].TapService.length - 1 === periodIndex && this.isAutoRenewalRoot) {
          IsEndDateAllow = false;
        }


        this.xw.startElement('PD');
        this.xw.writeAttribute('P', 'Period' + Number(periodIndex + 1));
        this.xw.writeAttribute('SDT', eleTapService.StartDate);
        this.xw.writeAttribute('EDT', (IsEndDateAllow) ? eleTapService.EndDate as string : 'N/A');
        this.xw.writeAttribute('ISO', (ISO) ? ISO as string : 'N/A');
        element.EntityDetails.forEach((eleEntity, entityIndex) => {
          // const eleTabDetails = eleEntity.TapService[periodIndex].TapServicePeriodWise;
          const row = eleEntity.TapService[periodIndex];
          if (!((row.isExclude && row.isExclude === 1) || (row.isRemove && row.isRemove === 1))) {
            this.xw.startElement('RW');
            this.xw.writeAttribute('HOME', eleEntity.PartyATAPCode);
            this.xw.writeAttribute('VISITOR', eleEntity.PartyBTAPCode);
            this.xw.writeAttribute('E', (element.Exclusions) ? element.Exclusions : 'N/A');
            this.xw.writeAttribute('T', taxTreatmentList.filter(x => x.EnumID === eleEntity.TaxTreatmentEnumID)
              .map(x => x.DisplayName).toString());

            const AllService = row.TapServicePeriodWise.filter(x => x.TapServiceName !== "MOC ALL" && x.TapServiceName !== "SMS-MT" && x.TapServiceName !== "VoLTE");
            AllService.forEach((eleTab, i) => {
              this.xw.startElement('RD');
              // this.xw.writeAttribute('MS', tapServiceList.filter(x => x.EnumID === eleTab.TapServiceEnumID)
              //   .map(x => x.SubType).toString());

              if (eleTab.TapServiceEnumID === 1 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "Local Call"
              } else if (eleTab.TapServiceEnumID === 2 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "Call Back Home"
              } else if (eleTab.TapServiceEnumID === 3 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "ROW1"
              } else if (eleTab.TapServiceEnumID === 4 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "MTC CALL"
              } else if (eleTab.TapServiceEnumID === 5 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "MO-SMS"
              } else if (eleTab.TapServiceEnumID === 7 && eleTab.TerminatedTypeID === 1) {
                eleTab.TapServiceName = "GPRS"
              } else {
                eleTab.TapServiceName = eleTab.TapServiceName
              }

              this.xw.writeAttribute('MS', eleTab.TapServiceName);

              this.xw.writeAttribute('SS', serviceList.filter(x => x.EnumID === eleTab.ServiceEnumID).map(x => x.DisplayName === "Voice MO" ? "MOC CALL" : x.DisplayName).toString());

              this.xw.writeElement('R', (eleTab.O_Rate > -1) ? eleTab.Rate as string : (eleTab.O_Rate === -2) ? '' : (eleTab.TapServiceEnumID === 8) ? 'N/A' : 'AA14');
              if (eleTab.TapServiceEnumID === 7 || eleTab.TapServiceEnumID === 8) {
                this.xw.writeElement('P', perEnumList.filter(x => x.EnumID === eleTab.PerEnumID).map(x => x.DisplayName).toString());
              }
              this.xw.writeElement('I', chargingIntervalEnumList.filter(x => x.EnumID === eleTab.IntervalEnumID)
                .map(x => x.DisplayName).toString());

              //#region "RegionCountery"
              // __________________ Node Based output of RegionCountry___________________________
              if (eleTab.TAPRegionCountry && eleTab.TAPRegionCountry.length > 0) {
                this.xw.startElement('RC'); // RC-RegionCountry Starting
                eleTab.TAPRegionCountry.forEach(e => {
                  this.xw.startElement('C'); // Countery Starting
                  this.xw.writeElement('CN', e.CountryName); // Countery Name
                  this.xw.writeElement('ISO', e.CountryISO); // Countery ISO
                  this.xw.endElement(); // C-Countery Closing
                });
                this.xw.endElement(); // RC-RegionCountry Closing
              }
              // //#region "country Region for Home and row"
              if (tapValue.HomeLocalCountry) {
                const HomeCountry = tapValue.HomeLocalCountry.filter(x => x.PartyATapCode === eleEntity.PartyATAPCode);
                const LocalCountry = tapValue.HomeLocalCountry.filter(x => x.PartyATapCode === eleEntity.PartyBTAPCode);
                if (eleTab.ServiceEnumID === 1 && eleTab.TapServiceEnumID === 1 && eleTab.TerminatedTypeID === 1) {
                  // MOC LOCAL
                  if (LocalCountry && LocalCountry.length > 0) {
                    this.xw.startElement('RC'); // RC-RegionCountry Starting
                    LocalCountry.forEach(e => {
                      this.xw.startElement('C'); // Countery Starting
                      this.xw.writeElement('CN', e.PartyACountryName); // Countery Name
                      this.xw.writeElement('ISO', e.PartyAISO); // Countery ISO
                      this.xw.endElement(); // C-Countery Closing
                    });
                    this.xw.endElement(); // RC-RegionCountry Closing
                  }
                }

                if (eleTab.ServiceEnumID === 1 && eleTab.TapServiceEnumID === 2 && eleTab.TerminatedTypeID === 1) {
                  // MOC Home
                  if (HomeCountry && HomeCountry.length > 0) {
                    this.xw.startElement('RC'); // RC-RegionCountry Starting
                    HomeCountry.forEach(e => {
                      this.xw.startElement('C'); // Countery Starting
                      this.xw.writeElement('CN', e.PartyACountryName); // Countery Name
                      this.xw.writeElement('ISO', e.PartyAISO); // Countery ISO
                      this.xw.endElement(); // C-Countery Closing
                    });
                    this.xw.endElement(); // RC-RegionCountry Closing
                  }
                }
              }

              ////#endregion
              // ___________________________________________________________________________________

              // __________________ Attribute Based output of RegionCountry___________________________

              // if (eleTab.TAPRegionCountry && eleTab.TAPRegionCountry.length > 0) {
              //   this.xw.startElement('RC');
              //   eleTab.TAPRegionCountry.forEach(e => {
              //     this.xw.startElement('C');
              //     this.xw.writeAttribute('CN', e.CountryName);
              //     this.xw.writeAttribute('ISO', e.CountryISO);
              //     this.xw.endElement(); // C
              //   });
              //   this.xw.endElement(); // RC
              // }
              // ___________________________________________________________________________________
              //#region

              this.xw.endElement(); // RD
              if (eleTab.TapServiceEnumID === 3 && eleTab.TerminatedTypeID === 1) {
                this.xw.startElement('RD');
                this.xw.writeAttribute('MS', "ROW2");
                this.xw.writeAttribute('SS', "MOC CALL");
                this.xw.writeElement('R', "AA14");
                this.xw.writeElement('I', "AA14");
                this.xw.endElement(); // RC-RegionCountry Closing

                this.xw.startElement('RD');
                this.xw.writeAttribute('MS', "ROW3");
                this.xw.writeAttribute('SS', "MOC CALL");
                this.xw.writeElement('R', "AA14");
                this.xw.writeElement('I', "AA14");
                this.xw.endElement();

                if (exclusionsArray != undefined && exclusionsArray.length > 0) {
                  exclusionsArray[0].forEach((item, i) => {
                    this.xw.startElement('RD');
                    this.xw.writeAttribute('MS', item);
                    this.xw.writeAttribute('SS', "MOC CALL");
                    this.xw.writeElement('R', "AA14");
                    this.xw.writeElement('I', "AA14");
                    this.xw.endElement();
                  })
                }
              }
              if ((AllService.length - 1) == i) {
                this.xw.startElement('RD');
                this.xw.writeAttribute('MS', "Tax applicable");
                this.xw.writeAttribute('SS', "Tax applicable");
                this.xw.writeElement('Y', "AA14");
                this.xw.writeElement('TV', "AA14");
                this.xw.endElement();

                this.xw.startElement('RD');
                this.xw.writeAttribute('MS', "Tax included in the rate");
                this.xw.writeAttribute('SS', "Tax included in the rate");
                this.xw.writeElement('Y', taxTreatmentList.filter(x => x.EnumID === eleEntity.TaxTreatmentEnumID).map(x => x.DisplayName).toString().toLowerCase() !== 'exclusive' ? 'Yes' : 'No');
                this.xw.endElement();

                this.xw.startElement('RD');
                this.xw.writeAttribute('MS', "Bearer Service included in Special IOT");
                this.xw.writeAttribute('SS', "Bearer Service included in Special IOT");
                this.xw.writeElement('Y', "AA14");
                this.xw.endElement();
              }
            });
            this.xw.endElement(); // RW
          }
        });
        this.xw.endElement(); // PD
      });
      this.xw.endElement();
    });
  }
}
