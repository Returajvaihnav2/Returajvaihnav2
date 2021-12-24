import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelJS from 'exceljs/dist/exceljs';
import * as FileSaver from 'file-saver';
import * as lodash from 'lodash';
import { BrowserStorageService } from '../../utility/browser-storage.service.js';
import { TapInstructionService } from '../tap-instruction/tap-instruction.service.js';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare const ExcelJS: any;
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  workbook: ExcelJS.Workbook;
  worksheet: any;
  row = 10;
  row1 = this.row + 1;
  isAutoRenewalRoot: any;
  lastCuruntIndex: number = 0;
  CuruntIndex: number = 0;
  constructor(private browserStorageService: BrowserStorageService, public tapInstructionService: TapInstructionService) {
  }

  public generateExcel(paramData: any, _ReferenceNo, IsSend = false, isAutoRenewalRoot): any {
    return new Promise((resolve, reject) => {
      this.isAutoRenewalRoot = isAutoRenewalRoot;
      // Create workbook and worksheet
      this.workbook = new Excel.Workbook();

      // Set Workbook Properties
      this.workbook.creator = 'Tritex Solutions';
      this.workbook.lastModifiedBy = 'Tritex Solutions';
      this.workbook.created = new Date();
      this.workbook.modified = new Date();
      this.workbook.lastPrinted = new Date();

      const TypeID = paramData.newTAPInstructionForm.TypeID;
      const DirectionID = paramData.newTAPInstructionForm.DirectionID;

      if ((TypeID === 1) || (TypeID === 2 && DirectionID === 1)) {
        //  this.generateSyniverse(paramData, true); // For Home
        switch (paramData.newTAPInstructionForm.HomeDataClearingHosuseID) {
          case 4: //Comfone
            this.generateComfoneRows(paramData, true); // For Home
            break;
          case 10: //Syniverse
            this.generateSyniverse(paramData, true); // For Home
            break;
          default:
            this.generateRows(paramData, true); // For Home
            break
        }
      }
      if ((TypeID === 1) || (TypeID === 2 && DirectionID === 2)) {
        // this.generateSyniverse(paramData, false);
        switch (paramData.newTAPInstructionForm.HomeDataClearingHosuseID) {
          case 4: //Comfone
            this.generateComfoneRows(paramData, false); // For Visitor
            break;
          case 10: //Syniverse
            this.generateSyniverse(paramData, false); // For Visitor
            break;
          default:
            this.generateRows(paramData, false); // For Visitor
            break;
        }
      }
      if (IsSend) {
        return this.workbook.xlsx.writeBuffer({
          base64: true
        }).then((data) => {
          const itemdata = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const reader = new FileReader();
          reader.readAsDataURL(itemdata);
          reader.onloadend = function () {
            return resolve(reader.result.toString().replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', ''));
          }
        });

      } else {
        this.workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: EXCEL_TYPE });
          FileSaver.saveAs(blob, (_ReferenceNo ? _ReferenceNo : 'temporary') + EXCEL_EXTENSION);
          return resolve(data);
        });
      }
    });
  }
  generateComfoneRows(paramData, isHome) {
    const tapValue = paramData.newTAPInstructionForm;
    const taxTreatmentList = paramData.taxTreatmentList;
    const chargingIntervalEnumList = paramData.chargingIntervalEnumList;
    const perEnumList = paramData.perEnumList;
    const _entity = isHome ? tapValue.HomeEntity : tapValue.VisitorEntity;
    _entity.forEach(element => {
      const tapName = (isHome ? 'TAP-OUT' : 'TAP-IN') + '(' + element.OperatorCode + ')';
      const homeFlag = isHome ? true : false;
      this.worksheet = this.workbook.addWorksheet(tapName,
        { views: [{ showGridLines: false }] });
      // Logo

      const ISO = element.OperatorCurrencyISO;

      // Blank Row
      this.worksheet.addRow([]); // Row No-9 for new Row
      this.row = 2;
      this.row1 = this.row + 1;
      element.EntityDetails[0].TapService.forEach((eleTab, periodIndex) => {
        // const titleRow = this.worksheet.addRow(['Period ' + (periodIndex + 1) as string]);
        // titleRow.font = { family: 4, size: 16, underline: 'double', bold: true };
        this.row++;
        this.row1 = this.row + 1;
        ////// start header /////
        const exclusionsArray = [];
        let exclusions = 0
        if (element.Exclusions) {
          exclusionsArray.push(element.Exclusions.split(','));
          exclusions = element.Exclusions.split(',').length;
        }
        const destination = 3;
        const row1row2 = 2;
        const AllService = eleTab.TapServicePeriodWise.filter(x => x.TapServiceName !== "MOC ALL" && x.TapServiceName !== "SMS-MT" && x.TapServiceName !== "VoLTE");
        const VoiceMoData = AllService.filter(x => x.ServiceEnumID === 1);
        const customeregionLength = VoiceMoData.filter(x => x.ServiceEnumID === 1 && x.TerminatedTypeID === 2).length;
        let VoiceLength = 0;
        if (exclusions && exclusions !== 0) {
          const VoicMoLength = VoiceMoData.length;
          VoiceLength = ((VoicMoLength + row1row2 + exclusions) * 2) + destination + customeregionLength;
        } else {
          // const VoiceMoData = AllService.filter(x => x.ServiceEnumID === 8);
          const VoicMoLength = VoiceMoData.length;
          VoiceLength = ((VoicMoLength + row1row2) * 2) + destination + customeregionLength;
        }

        const SmsLength = (1) * 2;
        const MoSMSLength = (1 * 1);
        const VolteLength = (1 * 2);
        // const startIndex = (1 * 3);
        const startIndex = (1 * 4);
        const TextTreatmentLength = 2;
        const TaxApplicable = (1 * 2);
        const TaxincludedRate = (1 * 1);
        const IncludedRatelength = (1 * 1);
        const SpecialIOT = (1 * 1)
        let ownpmn = 0
        const ownpmnIndex = homeFlag ? 0 : 1;
        const TotalLength = ownpmnIndex + startIndex + VoiceLength + SmsLength + MoSMSLength + VolteLength + TextTreatmentLength + TaxApplicable + TaxincludedRate + SpecialIOT;
        const clmIndex = lodash.range(1, (TotalLength));
        //
        // Add a Worksheet

        // Blank Row
        this.worksheet.addRow([]); // Row No-9 for new Row
        this.row++;
        this.row1 = this.row + 1;
        let Cell = [];
        if (!homeFlag) {
          Cell = this.getCellNo(Cell, clmIndex.length);

          this.worksheet.mergeCells(Cell[ownpmn] + this.row + ':' + Cell[ownpmn] + (this.row + 1));
          this.worksheet.getCell(Cell[ownpmn] + this.row).value = 'Own PMN';
          ownpmn = 1;
        } else {
          Cell = this.getCellNo(Cell, clmIndex.length - 1);
        }
        this.worksheet.mergeCells(Cell[ownpmn] + this.row + ':' + Cell[ownpmn] + (this.row + 1));
        this.worksheet.getCell(Cell[ownpmn] + this.row).value = 'PMN code';
        this.worksheet.mergeCells(Cell[ownpmn + 1] + this.row + ':' + Cell[ownpmn + 1] + (this.row + 1));
        this.worksheet.getCell(Cell[ownpmn + 1] + this.row).value = 'StartDate';
        this.worksheet.mergeCells(Cell[ownpmn + 2] + this.row + ':' + Cell[ownpmn + 2] + (this.row + 1));
        this.worksheet.getCell(Cell[ownpmn + 2] + this.row).value = 'EndDate';
        this.worksheet.mergeCells(Cell[ownpmn + 3] + this.row + ':' + Cell[ownpmn + 3] + (this.row + 1));
        this.worksheet.getCell(Cell[ownpmn + 3] + this.row).value = 'Currency';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn] + this.row + ':' + Cell[startIndex + ownpmn + VoiceLength - 1] + this.row);
        this.worksheet.getCell(Cell[startIndex + ownpmn] + this.row).value = 'MOC Call';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength] + this.row + ':' + Cell[startIndex + ownpmn + VoiceLength + SmsLength - 1] + this.row1);
        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + 1] + this.row).value = 'MTC Call';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength + SmsLength] + this.row + ':' + Cell[startIndex + ownpmn +
          VoiceLength + SmsLength + MoSMSLength - 1] + this.row1);

        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + SmsLength] + this.row).value = 'MO-SMS';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength] + this.row + ':' +
          Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + VolteLength - 1] + this.row1);

        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength] + this.row).value = 'GPRS';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable] + this.row + ':' +
          Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + VolteLength + TaxApplicable - 1] + this.row1);
        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable] + this.row).value = 'Tax applicable';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength] + this.row + ':' +
          Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + VolteLength + TaxApplicable + TaxincludedRate - 1] + this.row1);
        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength] + this.row).value = 'Tax included in the rate';

        this.worksheet.mergeCells(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength + SpecialIOT] + this.row + ':' +
          Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + VolteLength + TaxApplicable + TaxincludedRate + SpecialIOT - 1] + this.row1);
        this.worksheet.getCell(Cell[startIndex + ownpmn + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength + SpecialIOT] + this.row).value = 'Bearer Service included in Special IOT';

        // bold  header of first row
        this.worksheet.getRow(this.row).font = { bold: true };
        const header1Border = [Cell[0] + this.row, Cell[1] + this.row, Cell[2] + this.row, Cell[3] + this.row, Cell[startIndex] + this.row, Cell[startIndex + VoiceLength] + this.row,
        Cell[startIndex + VoiceLength + SmsLength] + this.row, (Cell[startIndex + VoiceLength + SmsLength + MoSMSLength]) + this.row,
        Cell[startIndex + VoiceLength + SmsLength + MoSMSLength + TaxApplicable] + this.row, Cell[startIndex + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength] + this.row,
        Cell[startIndex + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength + SpecialIOT] + this.row];
        if (!homeFlag) {
          header1Border.push(Cell[startIndex + VoiceLength + SmsLength + MoSMSLength + TaxApplicable + TaxincludedRate + IncludedRatelength + SpecialIOT + 1] + this.row)
        }
        header1Border.forEach(eleheader2 => {
          this.worksheet.getCell(eleheader2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        const header2Border = [];
        const header3 = [];
        if (!homeFlag) {
          header3.push('');
          header3.push('');
          header3.push('');
          header3.push('');
          header3.push('');
        } else {
          header3.push('');
          header3.push('');
          header3.push('');
          header3.push('');
        }

        let newIndex = 0
        const cellvalue = [];
        VoiceMoData.forEach((item, i) => {
          let incremental;
          let ServiceName;
          let destinationinclode = 0;

          if (item.ServiceEnumID === 1 && item.TerminatedTypeID === 2) {
            destinationinclode = 1;
            incremental = 1;
            ServiceName = item.TapServiceName;
            header3.push('Destination');
            header3.push('Rate/Minute');
            header3.push('Charging interval');
            header2Border.push(Cell[0] + this.row1);
            header2Border.push(Cell[1] + this.row1);
            this.lastCuruntIndex = startIndex + (i * 3);
            cellvalue.push(Cell[ownpmn + this.lastCuruntIndex] + this.row1 + ':'
              + Cell[ownpmn + this.lastCuruntIndex + incremental + destinationinclode] + this.row1);
            this.worksheet.mergeCells(Cell[ownpmn + this.lastCuruntIndex] + this.row1 + ':'
              + Cell[ownpmn + this.lastCuruntIndex + incremental + destinationinclode] + this.row1);
            this.worksheet.getCell(Cell[ownpmn + this.lastCuruntIndex] + this.row1).value = ServiceName;
            header2Border.push(Cell[this.lastCuruntIndex] + this.row1);
          } else {
            const iIndex = 2;
            if (item.TapServiceEnumID === 1 && item.TerminatedTypeID === 1) {
              item.TapServiceName = "Local Call"
            } else if (item.TapServiceEnumID === 2 && item.TerminatedTypeID === 1) {
              item.TapServiceName = "Call Back Home"
            } else if (item.TapServiceEnumID === 3 && item.TerminatedTypeID === 1) {
              item.TapServiceName = "ROW"
            } else {
              item.TapServiceName = item.TapServiceName
            }
            let VolteiIndex = 0;
            let destinationinclode = 0;
            if (item.ServiceEnumID === 4 || item.ServiceEnumID === 11 || item.ServiceEnumID === 5 || item.ServiceEnumID === 10) {
              if (item.ServiceEnumID === 11 || item.ServiceEnumID === 5) {
                VolteiIndex = 1;
              }
              incremental = 2;
              ServiceName = '';
              header3.push('Rate/Minute');
              header3.push('per:');
              header3.push('Charging interval');
            } else if (item.TapServiceEnumID === 3 && item.TerminatedTypeID === 1) {
              destinationinclode = 1;
              incremental = 1;
              ServiceName = item.TapServiceName;
              header3.push('Destination');
              header3.push('Rate/Minute');
              header3.push('Charging interval');
            }
            else {
              incremental = 1;
              ServiceName = item.TapServiceName;
              header3.push('Rate/Minute');
              header3.push('Charging interval');
            }
            header2Border.push(Cell[0] + this.row1);
            header2Border.push(Cell[1] + this.row1);
            header2Border.push(Cell[2] + this.row1);
            header2Border.push(Cell[3] + this.row1);

            if (this.lastCuruntIndex > 0) {
              this.CuruntIndex = startIndex + (i * iIndex) + VolteiIndex + VoiceMoData.filter(x => x.ServiceEnumID === 1 && x.TerminatedTypeID === 2).length;
            } else {
              this.CuruntIndex = startIndex + (i * iIndex) + VolteiIndex;
            }
            cellvalue.push(Cell[ownpmn + this.CuruntIndex] + this.row1 + ':'
              + Cell[ownpmn + this.CuruntIndex + incremental + destinationinclode] + this.row1);
            this.worksheet.mergeCells(Cell[ownpmn + this.CuruntIndex] + this.row1 + ':'
              + Cell[ownpmn + this.CuruntIndex + incremental + destinationinclode] + this.row1);
            this.worksheet.getCell(Cell[ownpmn + this.CuruntIndex] + this.row1).value = ServiceName;
            header2Border.push(Cell[this.CuruntIndex] + this.row1);

            if (item.TapServiceEnumID === 3 && item.TerminatedTypeID === 1) {
              newIndex = 2
              this.worksheet.mergeCells(Cell[ownpmn + this.CuruntIndex + newIndex + destinationinclode] + this.row1 + ':'
                + Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + 1] + this.row1);
              this.worksheet.getCell(Cell[ownpmn + this.CuruntIndex + newIndex + destinationinclode] + this.row1).value = "ROW2";
              header2Border.push(Cell[this.CuruntIndex + newIndex] + this.row1);
              header3.push('Destination');
              header3.push('Rate/Minute');
              header3.push('Charging interval');
              newIndex = 2 + 2
              this.worksheet.mergeCells(Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode] + this.row1 + ':'
                + Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + 2] + this.row1);
              this.worksheet.getCell(Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode] + this.row1).value = "ROW3";
              header2Border.push(Cell[this.CuruntIndex + newIndex] + this.row1);
              header3.push('Destination');
              header3.push('Rate/Minute');
              header3.push('Charging interval');
            }
            if (exclusionsArray.length && ((VoiceMoData.length - 1) == i)) {
              exclusionsArray[0].forEach((item, i) => {
                const irow = (i === 0 ? 2 : (i * 2) + 2);
                this.worksheet.mergeCells(Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + irow + 1] + this.row1 + ':'
                  + Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + 2 + irow] + this.row1);
                this.worksheet.getCell(Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + irow + 1] + this.row1).value = item;
                // this.worksheet.getCell(Cell[header3Index] + this.row1).value = item;
                header2Border.push(Cell[ownpmn + this.CuruntIndex + newIndex + incremental + destinationinclode + irow + 1] + this.row1);
                header3.push('Rate/Minute');
                header3.push('Charging interval');
              })
            }
          }
        });
        header3.push('Rate/Minute');
        header3.push('Charging interval');
        header3.push('Rate/Event');
        header3.push('Rate / MB');
        header3.push('charging interval');
        header3.push('Yes /No');
        header3.push('Tax Value');
        header3.push('Yes /No');
        header3.push('Yes /No');
        // bold  header ofsecond row
        this.worksheet.getRow(this.row1).font = { bold: true };
        // this.worksheet.getRow(this.row1).getCell(2).font = { bold: false };
        header2Border.forEach(eleheader2 => {
          this.worksheet.getCell(eleheader2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        const header3Row = this.worksheet.addRow(header3);
        header3Row.font = { bold: true };
        this.row++;
        this.row1 = this.row + 1;

        clmIndex.forEach((eleClmIndex, i) => {
          if ((clmIndex.length - 1) > i) {
            header3Row.getCell(eleClmIndex).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'double' },
              right: { style: 'thin' }
            };
          }
        });

        let Regioncountry = [];
        element.EntityDetails.forEach((eleEntity, entityIndex) => {
          const row = eleEntity.TapService[periodIndex];
          if (!((row.isExclude && row.isExclude === 1) || (row.isRemove && row.isRemove === 1))) {
            const eleTabDetails = row.TapServicePeriodWise.filter(x => x.TapServiceName !== "MOC ALL" && x.TapServiceName !== "SMS-MT" && x.TapServiceName !== "VoLTE");
            Regioncountry = eleTabDetails.filter(x => x.TerminatedTypeID === 2 && (x.TAPRegionCountry && x.TAPRegionCountry.length > 0)).map(t => {
              return {
                'TapServiceName': t.TapServiceName, 'Country': t.TAPRegionCountry.map((n) => {
                  return n.CountryName + '(' + n.CountryISO + ')';
                })
              };
            });
            const _temp = this.getDataComfone(exclusionsArray, eleEntity, eleTabDetails, periodIndex, chargingIntervalEnumList, perEnumList,
              taxTreatmentList, ISO, eleTab, homeFlag);
            const rowEntity = this.worksheet.addRow(_temp);
            this.row++;
            this.row1 = this.row + 1;

            clmIndex.forEach((eleClmIndex, i) => {
              if ((clmIndex.length - 1) > i) {

                rowEntity.getCell(eleClmIndex).border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
                rowEntity.getCell(eleClmIndex).alignment = {
                  horizontal: 'left'
                };
              }
            });
          }
        });
        // this.bindCountryRegions(Regioncountry, Cell, clmIndex);
        this.row++;
        this.row1 = this.row + 1;
        this.worksheet.addRow([]);
        this.row++;
        this.row1 = this.row + 1;

      });

    });
  }





  generateSyniverse(paramData, isHome) {
    const initialrow = this.row;
    const tapValue = paramData.newTAPInstructionForm;
    const taxTreatmentList = paramData.taxTreatmentList;
    const chargingIntervalEnumList = paramData.chargingIntervalEnumList;
    const perEnumList = paramData.perEnumList;
    const tapServiceList = paramData.tapServiceList;
    const exclusionServiceList = paramData.exlusionServiceList;
    const _entity = isHome ? tapValue.HomeEntity : tapValue.VisitorEntity;
    _entity.forEach((element) => {

      element.EntityDetails.forEach((elementitem, ind) => {
        this.row = 4;
        var tapName = (isHome ? 'TapIn(' + elementitem.PartyATAPCode + '-' + elementitem.PartyBTAPCode + ')' : 'TapOut(' + elementitem.PartyATAPCode + '-' + elementitem.PartyBTAPCode + ')');
        this.worksheet = this.workbook.addWorksheet(tapName,
          { views: [{ showGridLines: false }] });
        const ISO = element.OperatorCurrencyISO;
        element.EntityDetails[ind].TapService.forEach((eleTab, periodIndex) => {
          let IsEndDateAllow = true;
          if (element.EntityDetails[ind].TapService.length - 1 === periodIndex && this.isAutoRenewalRoot) {
            IsEndDateAllow = false;
          }
          const TradingEntity = elementitem.PartyATAPCode;
          const CounterParty = elementitem.PartyBTAPCode;
          // const TradingEntity = lodash.uniqBy(element.EntityDetails.map(x => x.PartyATAPCode), 0).toString();
          // const CounterParty = lodash.uniqBy(element.EntityDetails.map(x => x.PartyBTAPCode), 0).toString();
          let exclusionsArray = [];
          let exclusions: any;
          if (element.Exclusions && element.Exclusions.length > 0) {
            exclusionsArray = element.Exclusions.split(',').map(x => x.trim());
            exclusions = element.Exclusions.split(',').length;
          }
          this.row = this.row + 1;
          const commonInfoBorder = [];
          // Row1
          this.worksheet.mergeCells('A' + this.row + ':A' + this.row);
          this.worksheet.getCell('A' + this.row).value = 'VPLMN' as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('A' + this.row);

          this.worksheet.mergeCells('B' + this.row + ':B' + this.row);
          this.worksheet.getCell('B' + this.row).value = CounterParty;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('B' + this.row);

          this.worksheet.mergeCells('C' + this.row + ':C' + (this.row));
          this.worksheet.getCell('C' + (this.row)).value = 'Valid From' as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('C' + this.row);

          this.worksheet.mergeCells('D' + this.row + ':D' + (this.row));
          this.worksheet.getCell('D' + (this.row)).value = eleTab.StartDate as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('D' + this.row);

          this.worksheet.mergeCells('E' + this.row + ':E' + (this.row + 1));
          this.worksheet.getCell('E' + this.row).value = 'Currency' as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('E' + this.row);

          this.worksheet.mergeCells('F' + this.row + ':F' + (this.row + 1));
          this.worksheet.getCell('F' + this.row).value = ISO as string;
          this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('F' + this.row);
          this.row = this.row + 1;


          //Row2
          this.worksheet.mergeCells('A' + this.row + ':A' + this.row);
          this.worksheet.getCell('A' + this.row).value = 'HPLMN' as string;
          commonInfoBorder.push('A' + this.row);

          this.worksheet.mergeCells('B' + this.row + ':B' + this.row);
          this.worksheet.getCell('B' + this.row).value = TradingEntity;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('B' + this.row);

          this.worksheet.mergeCells('C' + this.row + ':C' + (this.row));
          this.worksheet.getCell('C' + (this.row)).value = 'Valid to' as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('C' + this.row);

          this.worksheet.mergeCells('D' + this.row + ':D' + (this.row));
          this.worksheet.getCell('D' + (this.row)).value = (IsEndDateAllow ? eleTab.EndDate : 'N/A') as string;
          this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('D' + this.row);
          this.row = this.row + 1;
          //Row3
          this.worksheet.mergeCells('A' + this.row + ':A' + this.row);
          this.worksheet.getCell('A' + this.row).value = 'Additional Comment' as string;
          // this.worksheet.getRow(this.row).font = { bold: true };
          commonInfoBorder.push('A' + this.row);
          const textTreatmentName = taxTreatmentList.filter(x => x.EnumID === element.EntityDetails[ind].TaxTreatmentEnumID).map(x => x.DisplayName).toString();
          const VoiceMoExclusion = exclusionsArray && exclusionsArray.length > 0;
          //(exclusionsArray && exclusionsArray.length > 0) ? exclusionServiceList.map(x => x.ExclusionName).filter(t => exclusionsArray.includes(t)).length > 0 : false;
          this.worksheet.mergeCells('B' + this.row + ':F' + this.row);
          this.worksheet.getCell('B' + this.row).value = (textTreatmentName && textTreatmentName.length > 0) ? ('Tax Treatment :' + textTreatmentName +
            (
              (VoiceMoExclusion) ? '\n and Voice MO Exclusion :' +
                // exclusionServiceList.map(x => x.ExclusionName).filter(t => exclusionsArray.includes(t)).toString()
                exclusionsArray.toString()
                :
                ''
            )
          ) : ''
          commonInfoBorder.push('B' + this.row);
          this.worksheet.getRow(this.row).font = { bold: true };

          commonInfoBorder.forEach((eleheader2, n) => {
            this.worksheet.getCell(eleheader2).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }

            this.worksheet.getCell(eleheader2).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            this.worksheet.getCell(eleheader2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: (n % 2 == 0) ? 'cccccc' : 'eeeeee' } }
          })



          this.row++;
          this.row1 = this.row;
          const startIndex = 0;
          const VoiceLength = 11;
          const GPRSLength = 10;
          ////// start header /////

          const clmIndex = lodash.range(1, 22);
          let Cell = [];
          Cell = this.getCellNo(Cell, clmIndex.length);
          //Service Header-header1
          this.worksheet.mergeCells(Cell[startIndex] + this.row + ':' + Cell[startIndex + VoiceLength - 1] + this.row);
          this.worksheet.getCell(Cell[startIndex] + this.row).value = 'Voice';

          this.worksheet.mergeCells(Cell[startIndex + VoiceLength] + this.row + ':' + Cell[startIndex + VoiceLength + GPRSLength - 1] + this.row);
          this.worksheet.getCell(Cell[startIndex + VoiceLength] + this.row).value = 'GPRS';

          const header1Border = [Cell[startIndex] + this.row, Cell[startIndex + VoiceLength + GPRSLength - 1] + this.row];

          header1Border.forEach((eleheader2, k) => {
            this.worksheet.getCell(eleheader2).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            this.worksheet.getCell(eleheader2).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            this.worksheet.getCell(eleheader2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: (k <= 0) ? 'cccccc' : 'eeeeee' } }
            this.worksheet.getRow(this.row).font = { bold: true };
          });
          this.row++;
          //Detail header-header2 (voice Detials)
          const header3Array = ['Service', 'Zone', 'Destinations', 'Time Band', 'IDD Rate', 'IDD Increments', 'Air Rate', 'Air Increments', 'Total Rate(Air + IDD)', 'Increments', 'Setup fee / One time charg',
            'APN', 'Band', 'Range From', 'Range From Type (KB/MB)', 'Range To', 'Range To Type (KB/MB)', 'Increment', 'Increment Type (KB/MB)', 'Price', 'Setup Fee / One Time Charge']
          let header3Border: any = [];
          header3Array.forEach((eleheader3, x) => {
            this.worksheet.mergeCells(Cell[startIndex + x] + this.row + ':' + Cell[startIndex + x] + this.row);
            this.worksheet.getCell(Cell[startIndex + x] + this.row).value = eleheader3;
            header3Border.push(Cell[startIndex + x] + this.row);
          });
          header3Border.forEach((eleheader3, x) => {
            this.worksheet.getCell(eleheader3).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            this.worksheet.getCell(eleheader3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            this.worksheet.getCell(eleheader3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: (x < 11) ? 'cccccc' : 'eeeeee' } }
          });

          //exclusions



          let Regioncountry = [];
          [element.EntityDetails[ind]].forEach((eleEntity, entityIndex) => {
            const Periodrow = eleEntity.TapService[periodIndex];
            if (!((Periodrow.isExclude && Periodrow.isExclude === 1) || (Periodrow.isRemove && Periodrow.isRemove === 1))) {

              const eleTabDetails = Periodrow.TapServicePeriodWise;

              Regioncountry = eleTabDetails.filter(x => x.TerminatedTypeID === 2 && (x.TAPRegionCountry && x.TAPRegionCountry.length > 0)).map(t => {
                return {
                  'TapServiceName': t.TapServiceName, 'Country': t.TAPRegionCountry.map((n) => {
                    return n.CountryName + '(' + n.CountryISO + ')';
                  }),
                  'ServiceEnumID': t.ServiceEnumID,
                  'TerminatedTypeID': t.TerminatedTypeID
                };
              });

              const _temp = this.getDataRowSVR(eleEntity, eleTabDetails, chargingIntervalEnumList, perEnumList,
                taxTreatmentList, ISO, clmIndex, exclusionsArray, Regioncountry, tapServiceList);
            }
          });
          this.row++;
        });
      });
    });
  }




  generateRows(paramData, isHome) {
    const tapValue = paramData.newTAPInstructionForm;
    const taxTreatmentList = paramData.taxTreatmentList;
    const chargingIntervalEnumList = paramData.chargingIntervalEnumList;
    const perEnumList = paramData.perEnumList;

    const _entity = isHome ? tapValue.HomeEntity : tapValue.VisitorEntity;
    // const _worksheetText = isHome ? ' HPMN' : ' VPMN';

    _entity.forEach(element => {
      this.worksheet = this.workbook.addWorksheet(element.OperatorCode,
        { views: [{ showGridLines: false }] });
      // Logo
      if (paramData.newTAPInstructionForm.HomeDataClearingHosuseID !== 4) {
        this.bindlogo();
      }

      const ISO = element.OperatorCurrencyISO;
      // Message information
      const msgTextRow = this.worksheet.addRow(['*TAP Instruction sheet created and approved on the Tritex IOT Management platform']);
      msgTextRow.font = { color: { argb: '949494' }, };

      const commonInfo = [
        ['Contract Effective Date', element.EffectiveDate],
        ['Home network', isHome ? tapValue.TradingEntity : tapValue.CounterParty],
        ['Home network operator', element.OperatorName],
        ['Home network TCID', element.OperatorCode],
        ['Visitor network', isHome ? tapValue.CounterParty : tapValue.TradingEntity],
        ['Excluded Services', element.Exclusions ? element.Exclusions : 'N/A'],
        ['Excluded Countries', element.ExclusionCountry ? element.ExclusionCountry : 'N/A'],
        ['Auto Renew TAP rates', this.isAutoRenewalRoot ? 'Yes' : 'No'],
        ['Decimal Points', element.DecimalPoints.toString()],
      ];

      if (commonInfo) {
        commonInfo.forEach((eleCommonInfo, index) => {
          const rowIndex = index + 2;
          // CommonInfo Header
          this.worksheet.mergeCells('A' + rowIndex + ':C' + rowIndex);
          this.worksheet.getCell('A' + rowIndex).value = eleCommonInfo[0] as string;
          // CommonInfo Content
          this.worksheet.mergeCells('D' + rowIndex + ':F' + rowIndex);
          this.worksheet.getCell('D' + rowIndex).value = eleCommonInfo[1] as string;
          this.worksheet.getRow(rowIndex).font = { bold: true };

          const commonInfoBorder = ['A' + rowIndex, 'D' + rowIndex];
          commonInfoBorder.forEach(eleheader2 => {
            this.worksheet.getCell(eleheader2).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
      }

      // Blank Row
      this.worksheet.addRow([]); // Row No-9 for new Row
      this.row = 10;
      this.row1 = this.row + 1;
      element.EntityDetails[0].TapService.forEach((eleTab, periodIndex) => {
        const titleRow = this.worksheet.addRow(['Period ' + (periodIndex + 1) as string]);
        titleRow.font = { family: 4, size: 16, underline: 'double', bold: true };
        this.row++;
        this.row1 = this.row + 1;

        ////// start header /////
        const AllService = eleTab.TapServicePeriodWise;
        const VoiceMoData = AllService.filter(x => x.ServiceEnumID === 1);
        let VoiceLength = 0;
        if (VoiceMoData && VoiceMoData.length > 0) {
          const VoicMoLength = VoiceMoData.length;
          VoiceLength = (VoicMoLength + 1) * 2;
        } else {
          const VoiceMoData = AllService.filter(x => x.ServiceEnumID === 8);
          const VoicMoLength = VoiceMoData.length;
          VoiceLength = (VoicMoLength) * 2;
        }
        const SmsLength = (2) * 2;
        const DataLength = (1 * 3);
        const VolteLength = (1 * 3);
        const startIndex = (1 * 3);
        const TextTreatmentLength = 2;
        const TotalLength = startIndex + VoiceLength + SmsLength + DataLength + VolteLength + TextTreatmentLength;
        // 'VoiceLength'- total number of Voice Mo and Mt Length,'16'-Other service Column
        const clmIndex = lodash.range(1, TotalLength);
        //
        // Add a Worksheet

        // Blank Row
        this.worksheet.addRow([]); // Row No-9 for new Row
        this.row++;
        this.row1 = this.row + 1;

        let Cell = [];
        Cell = this.getCellNo(Cell, clmIndex.length);
        // Header 1
        this.worksheet.getCell(Cell[0] + this.row).value = 'StartDate';
        this.worksheet.getCell(Cell[1] + this.row).value = eleTab.StartDate;

        this.worksheet.mergeCells(Cell[startIndex] + this.row + ':' + Cell[startIndex + VoiceLength - 1] + this.row);
        this.worksheet.getCell(Cell[startIndex] + this.row).value = 'Voice';

        this.worksheet.mergeCells(Cell[startIndex + VoiceLength] + this.row + ':' + Cell[startIndex + VoiceLength + SmsLength - 1] + this.row);
        this.worksheet.getCell(Cell[startIndex + VoiceLength + 1] + this.row).value = 'SMS';

        this.worksheet.mergeCells(Cell[startIndex + VoiceLength + SmsLength] + this.row + ':' + Cell[startIndex +
          VoiceLength + SmsLength + DataLength - 1] + this.row);
        this.worksheet.getCell(Cell[startIndex + VoiceLength + SmsLength] + this.row).value = 'Data';

        this.worksheet.mergeCells(Cell[startIndex + VoiceLength + SmsLength + DataLength] + this.row + ':' +
          Cell[startIndex + VoiceLength + SmsLength + DataLength + VolteLength - 1] + this.row);
        this.worksheet.getCell(Cell[startIndex + VoiceLength + SmsLength + DataLength] + this.row).value = 'VoLTE';
        // bold  header of first row
        this.worksheet.getRow(this.row).font = { bold: true };
        this.worksheet.getRow(this.row).getCell(2).font = { bold: false };

        const header1Border = [Cell[0] + this.row, Cell[1] + this.row, Cell[startIndex] + this.row, Cell[startIndex + VoiceLength] + this.row,
        Cell[startIndex + VoiceLength + SmsLength] + this.row, (Cell[startIndex + VoiceLength + SmsLength + DataLength]) + this.row];

        header1Border.forEach(eleheader2 => {
          this.worksheet.getCell(eleheader2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        const header2Border = [];
        const header3 = ['Home', 'Visitor', 'Currency'];
        AllService.forEach((item, i) => {
          const iIndex = 2;
          let VolteiIndex = 0;
          let incremental;
          let ServiceName;
          if (item.ServiceEnumID === 4 || item.ServiceEnumID === 11 || item.ServiceEnumID === 5 || item.ServiceEnumID === 10) {
            if (item.ServiceEnumID === 11 || item.ServiceEnumID === 5) {
              VolteiIndex = 1;
            }
            incremental = 2;
            ServiceName = '';
            header3.push('Rate');
            header3.push('per:');
            header3.push('Interval');
          } else {
            incremental = 1;
            ServiceName = item.TapServiceName;
            header3.push('Rate');
            header3.push('Interval');
          }

          let IsEndDateAllow = true;
          if (element.EntityDetails[0].TapService.length - 1 === periodIndex && this.isAutoRenewalRoot) {
            IsEndDateAllow = false;
          }


          this.worksheet.getCell(Cell[0] + this.row1).value = 'EndDate';
          this.worksheet.getCell(Cell[1] + this.row1).value = IsEndDateAllow ? eleTab.EndDate : 'N/A';

          header2Border.push(Cell[0] + this.row1);
          header2Border.push(Cell[1] + this.row1);

          const CuruntIndex = startIndex + (i * iIndex) + VolteiIndex;
          this.worksheet.mergeCells(Cell[CuruntIndex] + this.row1 + ':'
            + Cell[CuruntIndex + incremental] + this.row1);
          this.worksheet.getCell(Cell[CuruntIndex] + this.row1).value = ServiceName;
          header2Border.push(Cell[CuruntIndex] + this.row1);

        });
        header3.push('Tax');
        // bold  header ofsecond row
        this.worksheet.getRow(this.row1).font = { bold: true };
        this.worksheet.getRow(this.row1).getCell(2).font = { bold: false };
        header2Border.forEach(eleheader2 => {
          this.worksheet.getCell(eleheader2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Header 3

        const header3Row = this.worksheet.addRow(header3);
        header3Row.font = { bold: true };
        this.row++;
        this.row1 = this.row + 1;

        clmIndex.forEach(eleClmIndex => {
          header3Row.getCell(eleClmIndex).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'double' },
            right: { style: 'thin' }
          };
        });

        //// end Header /////
        let Regioncountry = [];
        // Period Header

        element.EntityDetails.forEach((eleEntity, entityIndex) => {
          const row = eleEntity.TapService[periodIndex];
          if (!((row.isExclude && row.isExclude === 1) || (row.isRemove && row.isRemove === 1))) {
            const eleTabDetails = row.TapServicePeriodWise;
            Regioncountry = eleTabDetails.filter(x => x.TerminatedTypeID === 2 && (x.TAPRegionCountry && x.TAPRegionCountry.length > 0)).map(t => {
              return {
                'TapServiceName': t.TapServiceName,
                'Country': t.TAPRegionCountry.map((n) => {
                  return n.CountryName + '(' + n.CountryISO + ')';
                })
              };
            });
            const _temp = this.getDataRow(eleEntity, eleTabDetails, periodIndex, chargingIntervalEnumList, perEnumList,
              taxTreatmentList, ISO);
            const rowEntity = this.worksheet.addRow(_temp);
            this.row++;
            this.row1 = this.row + 1;

            clmIndex.forEach(eleClmIndex => {
              rowEntity.getCell(eleClmIndex).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
              rowEntity.getCell(eleClmIndex).alignment = {
                horizontal: 'left'
              };
            });
          }
        });

        this.bindCountryRegions(Regioncountry, Cell, clmIndex);
        this.row++;
        this.row1 = this.row + 1;
        this.worksheet.addRow([]);
        this.row++;
        this.row1 = this.row + 1;

      });

    });
  }

  bindlogo() {
    const logoBase64 = this.browserStorageService.getLocalStorageItem('logoBase64');
    const logo = this.workbook.addImage({
      base64: logoBase64,
      extension: 'png',
    });
    this.worksheet.addImage(logo, 'H2:J6');
  }

  getCellNo(alphabets, totalitem): any {
    if (totalitem <= 26) {
      const item = ((90) - (26 - totalitem));
      for (let i = 65; i <= item; i++) {
        alphabets.push(String.fromCharCode(i));
      }
    }
    if (totalitem > 26) {
      for (let i = 65; i <= 90; i++) {
        alphabets.push(String.fromCharCode(i));
      }
      for (let j = 0; j < totalitem - 26; j++) {
        for (let i = 65; i <= 90; i++) {
          alphabets.push(alphabets[j] + String.fromCharCode(i));
          if (alphabets.length === totalitem) {
            return alphabets;
          }
        }
      }
    }
    return alphabets;
  }

  getDataRow(eleEntity, eleTabDetails, periodIndex, chargingIntervalEnumList, perEnumList, taxTreatmentList, ISO): any {
    const Temp = [eleEntity.PartyATAPCode
      , eleEntity.PartyBTAPCode
      , (ISO) ? ISO as string : 'N/A'];
    eleTabDetails.forEach((item, index) => {
      Temp.push((item.O_Rate > -1) ? (item.Rate as string) : (item.O_Rate === -2) ? '' : (item.TapServiceEnumID === 8) ? 'N/A' : 'AA14');
      if (item.ServiceEnumID === 4 || item.ServiceEnumID === 11 || item.ServiceEnumID === 5 || item.ServiceEnumID === 10) {
        Temp.push(perEnumList.filter(x => x.EnumID === item.PerEnumID).map(x => x.DisplayName).toString());
      }
      Temp.push(chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString());
    });
    Temp.push(taxTreatmentList.filter(x => x.EnumID === eleEntity.TaxTreatmentEnumID).map(x => x.DisplayName).toString());
    return Temp;
  }

  getDataRowSVR(eleEntity, eleTabDetails, chargingIntervalEnumList, perEnumList, taxTreatmentList, ISO, clmIndex, exclusionsArray, Regioncountry, tapServiceList): any {
    const Temp = [];
    const Temp1 = [];
    let FinalTemp = [];
    eleTabDetails.forEach((item, index) => {
      let isAllowPremiumRate = false;
      let isAll = false;

      let per = '';
      let ServiceName = '';
      let Destination = '';
      let Zone = '';
      const rate = (item.O_Rate > -1) ? (item.Rate as string) : (item.O_Rate === -2) ? '' : (item.TapServiceEnumID === 8) ? 'N/A' : 'AA14';

      const exclusionCondtion = exclusionsArray && exclusionsArray.length > 0;
      const RegionCondition = Regioncountry && Regioncountry.length > 0 && Regioncountry.filter(x => x.TapServiceName == item.TapServiceName).length > 0;
      if (item.ServiceEnumID === 1) {
        ServiceName = 'All MO';
        if (item.TerminatedTypeID === 1) {
          //MOC Local
          if (item.TapServiceEnumID === 1) {
            isAllowPremiumRate = true;
            Zone = 'MOC National';
            Destination = 'National country destinations';
          }
          //MOC Home
          if (item.TapServiceEnumID === 2) {
            Zone = 'MOC Home Country';
            Destination = 'Home country destinations';
          }
          //MOC Row
          if (item.TapServiceEnumID === 3) {
            Zone = 'Rest of World';
            Destination = 'Rest of World';
          }

        } else {

          if (item.ServiceEnumID === 1) {
            isAll = true;
            Zone = 'All';
            ServiceName = 'All MO';
            if (item.TapServiceEnumID === 1) {
              Destination = 'All';
            }
          } else {
            ServiceName = 'All MO';
            Destination = 'All';
          }

        }


      } else {
        //MTC
        if (item.ServiceEnumID === 2) {
          if (item.TapServiceEnumID === 4) {
            if (item.TerminatedTypeID === 1) {
              ServiceName = 'All MTC';
              Zone = 'All';
              Destination = 'Same as AA.14';
            }
          }
        }

        //SMS MO
        if (item.TapServiceEnumID === 5 && item.ServiceEnumID === 3) {
          ServiceName = 'MO SMS';
          Zone = 'All';
          Destination = 'Same as AA.14';
        }
        //SMS MT
        if (item.TapServiceEnumID === 6 && item.ServiceEnumID === 7) {
          ServiceName = 'MT SMS';
          Zone = 'All';
          Destination = 'Same as AA.14';
        }
      }

      let ExlusionAr = [];

      if (item.O_Rate > -1) {
        //with out data services (voice,sms)
        if (item.ServiceEnumID !== 4 && item.ServiceEnumID !== 5 && item.ServiceEnumID !== 10 && item.ServiceEnumID !== 11) {
          //when we use exclusion like setelite,special number etc
          if (exclusionCondtion && RegionCondition) {
            const AllowExclusion = exclusionsArray.filter(ex => (ex === 'Premium Rate' && ex === 'Video') || ex === 'Video' || ex === 'Satellite').length > 0;
            if (AllowExclusion) {
              if (item.ServiceEnumID === 2 && item.TapServiceEnumID === 4 && item.TerminatedTypeID === 1) {
                ServiceName = 'MT Telephony';
              } else {
                if (item.ServiceEnumID === 1) {
                  ServiceName = 'MO Telephony';
                }
              }
              if (item.ServiceEnumID !== 1) {
                Zone = 'All';
                Destination = 'All';
              }
            }
            per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
            if (RegionCondition) {
              Regioncountry.filter(x => x.TapServiceName == item.TapServiceName).forEach(ex => {
                per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
                Temp.push([ServiceName, ex.TapServiceName, ex.Country.toString(), 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
              });
            } else {
              Temp.push([ServiceName, Zone, Destination, 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
            }

          }
          if (exclusionCondtion && !RegionCondition) {
            const AllowExclusion = exclusionsArray.filter(ex => (ex === 'Premium Rate' && ex === 'Video') || ex === 'Video' || ex === 'Satellite').length > 0;
            if (AllowExclusion) {
              if (item.ServiceEnumID === 2 && item.TapServiceEnumID === 4 && item.TerminatedTypeID === 1) {
                ServiceName = 'MT Telephony';
              } else {
                if (item.ServiceEnumID === 1) {
                  ServiceName = 'MO Telephony';
                }
              }
              if (item.ServiceEnumID !== 1) {
                Zone = 'All';
                Destination = 'All';
              }

            }

            per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
            Temp.push([ServiceName, Zone, Destination, 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
          }

          // when we use Custom regions asia urope etc


          if (!exclusionCondtion && RegionCondition) {
            Regioncountry.filter(x => x.TapServiceName == item.TapServiceName).forEach(ex => {
              per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
              Temp.push([ServiceName, ex.TapServiceName, ex.Country.toString(), 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
            });
          }

          if (!RegionCondition && !exclusionCondtion) {
            per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
            Temp.push([ServiceName, Zone, Destination, 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
          }

          if (isAllowPremiumRate && exclusionsArray.filter(ex => (ex === 'Premium Rate')).length == 0) {
            per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
            Temp.push([ServiceName, 'Premium Number', 'Same as AA.14', 'Independent', '', '', '', '', rate, (rate != 'N/A' && rate != 'AA14' ? per : ''), '', '', '', '', '', '', '', '', '', '', '']);
          }

        } else {
          //with data services (data,volte)
          let charginginterval: any;
          if (item.ServiceEnumID === 4 || item.ServiceEnumID === 11 || item.ServiceEnumID === 5 || item.ServiceEnumID === 10) {
            per = perEnumList.filter(x => x.EnumID === item.PerEnumID).map(x => x.DisplayName).toString();
            charginginterval = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
          } else {
            per = chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString();
          }
          Temp1.push(['', '', '', '', '', '', '', '', '', '', '', 'Any', '1', '0', 'KB', 'Last', 'KB', '1', charginginterval/* (rate != 'N / A' && rate != 'AA14' ? per : '')*/, (rate != 'N / A' && rate != 'AA14' ? (rate + ' / ' + per) : ''), '']);
        }
      }
    });

    if (Temp1.length > Temp.length) {
      Temp1.forEach((tx, i) => {
        FinalTemp.push([]);
        if (i < Temp.length) {
          for (let n = 0; n < 21; n++) {
            if (n <= 11) {
              FinalTemp[i].push(Temp1[i][n]);
            } else {
              FinalTemp[i].push(Temp[i][n]);
            }
          }
        } else {
          Temp1[i].forEach(element => {
            FinalTemp[i].push(element);
          });
        }
      });

    } else {
      Temp.forEach((tx, i) => {
        FinalTemp.push([]);
        if (i < Temp1.length) {
          for (let n = 0; n < 21; n++) {
            if (n >= 11) {
              FinalTemp[i].push(Temp1[i][n]);
            } else {
              FinalTemp[i].push(Temp[i][n]);
            }
          }
        } else {
          Temp[i].forEach(element => {
            FinalTemp[i].push(element);
          });
        }
      });
    }

    FinalTemp.forEach(row => {
      const rowEntity = this.worksheet.addRow(row);
      this.row++;
      this.row1 = this.row + 1;
      clmIndex.forEach(eleClmIndex => {
        rowEntity.getCell(eleClmIndex).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        rowEntity.getCell(eleClmIndex).alignment = {
          horizontal: 'left'
        };
      });
    })

  }

  getDataComfone(exclusionsArray, eleEntity, eleTabDetails, periodIndex, chargingIntervalEnumList, perEnumList, taxTreatmentList, ISO, eleTab, homeFlag): any {
    let IsEndDateAllow = true;
    let Temp = []
    if (eleEntity.TapService.length - 1 === periodIndex && this.isAutoRenewalRoot) {
      IsEndDateAllow = false;
    }
    if (!homeFlag) {
      Temp = [eleEntity.PartyATAPCode, eleEntity.PartyBTAPCode, eleTab.StartDate, IsEndDateAllow ? eleTab.EndDate : 'N/A', (ISO) ? ISO as string : 'N/A'];
    } else {
      Temp = [eleEntity.PartyBTAPCode, eleTab.StartDate, IsEndDateAllow ? eleTab.EndDate : 'N/A', (ISO) ? ISO as string : 'N/A'];
    }
    eleTabDetails.forEach((item, index) => {
      if (item.TapServiceEnumID === 3 && item.TerminatedTypeID == 1) {
        Temp.push("Row");
      }
      if (item.TAPRegionCountry && item.TAPRegionCountry.length > 0) {
        Temp.push(item.TAPRegionCountry.map(x => x.CountryName).toString());
      }
      Temp.push((item.O_Rate > -1) ? (item.Rate as string) : (item.O_Rate === -2) ? '' : (item.TapServiceEnumID === 8) ? 'N/A' : 'AA14');
      if (!(item.TapServiceEnumID == 5 && item.TerminatedTypeID == 1)) {
        Temp.push(chargingIntervalEnumList.filter(x => x.EnumID === item.IntervalEnumID).map(x => x.DisplayName).toString());
      }
      // Row cell value
      if (item.TapServiceEnumID === 3 && item.TerminatedTypeID == 1) {
        const rowValue = "";
        Temp.push(rowValue, rowValue, rowValue, rowValue, rowValue, rowValue);
        if (exclusionsArray[0] !== undefined && exclusionsArray[0] !== null && exclusionsArray[0].length > 0) {
          for (let i = 0; i < exclusionsArray[0].length; i++) {
            Temp.push("AA14");
            Temp.push("AA14");
          }
        }
      }
    });
    Temp.push("AA14");
    Temp.push("AA14");
    Temp.push(taxTreatmentList.filter(x => x.EnumID === eleEntity.TaxTreatmentEnumID).map(x => x.DisplayName).toString().toLowerCase() !== 'exclusive' ? 'Yes' : 'No');
    Temp.push("AA14");
    return Temp;
  }

  bindCountryRegions(Regioncountry, Cell, clmIndex) {
    if (Regioncountry && Regioncountry.length > 0) {
      this.row++;
      this.row1 = this.row + 1;
      // Create Header
      this.worksheet.addRow([]);
      this.row++;
      this.row1 = this.row + 1;
      this.worksheet.mergeCells(Cell[0] + this.row1 + ':' + Cell[1] + this.row1);
      this.worksheet.getCell(Cell[0] + this.row1).value = 'Region';
      this.worksheet.mergeCells(Cell[2] + this.row1 + ':' + Cell[clmIndex.length - 1] + this.row1);
      this.worksheet.getCell(Cell[2] + this.row1).value = 'Country(ISO)';
      const header4Row = [Cell[0] + this.row1, (Cell[clmIndex.length - 1]) + this.row1];
      header4Row.forEach(eleheader2 => {
        this.worksheet.getCell(eleheader2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        this.worksheet.getCell(eleheader2).font = {
          bold: true
        };
      });
      // end Header
      this.row++;
      this.row1 = this.row + 1;
      // Create Row
      Regioncountry.forEach((x => {
        this.worksheet.mergeCells(Cell[0] + this.row1 + ':' + Cell[1] + this.row1);
        this.worksheet.getCell(Cell[0] + this.row1).value = x.TapServiceName;
        this.worksheet.mergeCells(Cell[2] + this.row1 + ':' + Cell[clmIndex.length - 1] + this.row1);
        this.worksheet.getCell(Cell[2] + this.row1).value = x.Country.toString();
        const header5Row = [Cell[0] + this.row1, (Cell[clmIndex.length - 1]) + this.row1];
        this.row++;
        this.row1 = this.row + 1;
        header5Row.forEach(eleheader2 => {
          this.worksheet.getCell(eleheader2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }));
      // End Row
    }
  }

}
