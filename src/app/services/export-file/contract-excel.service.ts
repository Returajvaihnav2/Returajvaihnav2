import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs/dist/exceljs';
import * as FileSaver from 'file-saver';
import * as lodash from 'lodash';
import { BrowserStorageService } from '../../utility/browser-storage.service.js';
import { TapInstructionService } from '../tap-instruction/tap-instruction.service.js';
import { ExcelApiService } from './excel-api.service.js';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare const ExcelJS: any;
@Injectable({
    providedIn: 'root'
})
export class ContractExcelService {
    workbook: ExcelJS.Workbook;
    worksheet: any;
    row = 0;
    row1 = this.row + 1;
    isAutoRenewalRoot: any;
    clmIndex = lodash.range(1, 60);
    isTrade = true;
    constructor(private browserStorageService: BrowserStorageService, public tapInstructionService: TapInstructionService
        , private excelApiService: ExcelApiService) {
    }

    public generateExcel(paramData: any, _ReferenceNo, IsSend = false, isTrade = true, isSender?): Promise<any> {
        return this.generateUserExcel(paramData, _ReferenceNo, IsSend, isTrade, isSender);
    }


    public generateUserExcel(paramData: any, _ReferenceNo, IsSend = false, isTrade = true, isSender?): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.excelApiService.GetExcel('user/contract-excel', { 'paramData': paramData, '_ReferenceNo': _ReferenceNo, 'IsSend': IsSend, 'isTrade': isTrade, 'isSender': isSender, 'logoBase64': this.browserStorageService.getLocalStorageItem('logoBase64') }, 'blob').then(res => {
                    if (IsSend) {
                        const itemdata = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                        const reader = new FileReader();
                        reader.readAsDataURL(itemdata);
                        reader.onloadend = function () {
                            return resolve(reader.result.toString().replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', ''));
                        }
                    }
                    else {
                        const blob = new Blob([res], { type: EXCEL_TYPE });
                        FileSaver.saveAs(blob, (_ReferenceNo ? _ReferenceNo : 'temporary') + EXCEL_EXTENSION);
                        return resolve(true);
                    }
                }).catch(err => {
                    console.log(err);
                    return reject(err);
                })
            } catch (er) {
                return reject(er);
            }

        });

    }


}
