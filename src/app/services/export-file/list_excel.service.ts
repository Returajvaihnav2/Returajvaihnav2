import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { BrowserStorageService } from '../../utility/browser-storage.service.js';
import { ExcelApiService } from './excel-api.service.js';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ListExcelService {
  constructor(private browserStorageService: BrowserStorageService, private excelApiService: ExcelApiService) {
  }

  public generateExcel(paramData: any, Name: string, graph?): Promise<any> {
    return this.generateUserExcel(paramData, Name, graph);
  }

  public generateUserExcel(paramData: any, Name: string, graph?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.excelApiService.GetExcel('user/generate-excel', { 'paramData': paramData, 'name': Name, 'logoBase64': this.browserStorageService.getLocalStorageItem('logoBase64'), graph }, 'blob').then(res => {
        FileSaver.saveAs(res, (Name ? Name : 'temporary') + EXCEL_EXTENSION);
        return resolve(true);
      }).catch(err => {
        console.log(err);
        return reject(err);
      })

    });
  }

  public generateDealFastReportExcel(paramData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.excelApiService.GetExcel('user/dealfast-chart-excel', { 'paramData': paramData }, 'blob').then(res => {
        FileSaver.saveAs(res, 'DealFastChatExport' + EXCEL_EXTENSION);
        return resolve(true);
      }).catch(err => {
        console.log(err);
        return reject(err);
      })

    });
  }

  public generateTradeFastReportExcel(paramData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.excelApiService.GetExcel('user/tradefast-chart-excel', { 'paramData': paramData }, 'blob').then(res => {
        FileSaver.saveAs(res, 'TradeFastChatExport' + EXCEL_EXTENSION);
        return resolve(true);
      }).catch(err => {
        console.log(err);
        return reject(err);
      })

    });
  }

}
