import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AlfrescoMiddlewareApiService } from '../alfresco-middleware-api.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  isValid: boolean;
  tempObjectTradingCode: any;
  constructor(private apiService: ApiService, private alfApi: AlfrescoMiddlewareApiService) { }

  public closeTADIGCodesModel(formName, modalName) {
    const OperatorTadigCode = formName.get('OperatorTadigCodeList') as FormArray;
    OperatorTadigCode.controls = [];
    OperatorTadigCode.setValue([]);
    if (Object.keys(this.tempObjectTradingCode).length > 0) {
      if (OperatorTadigCode && this.tempObjectTradingCode) {
        for (let i = 0; i < Object.keys(this.tempObjectTradingCode).length; i++) {
          OperatorTadigCode.push(new FormGroup({
            'TADIGGUID': new FormControl(this.tempObjectTradingCode[i].TADIGGUID),
            'TadigCode': new FormControl(this.tempObjectTradingCode[i].TadigCode,
              Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])),
            'CodeTypeID': new FormControl(this.tempObjectTradingCode[i].CodeTypeID, Validators.required),
            'CountryID': new FormControl(this.tempObjectTradingCode[i].CountryID, Validators.required),
            'CountryTAPCodeID': new FormControl(this.tempObjectTradingCode[i].CountryTAPCodeID, Validators.required),
            'RegionID': new FormControl(this.tempObjectTradingCode[i].RegionID, Validators.required),
            'RegionTypeID': new FormControl(this.tempObjectTradingCode[i].RegionTypeID, Validators.required),
          }));
        }
      }
    }
    modalName.hide();
  }
  getOperator(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Contract/GetOperators').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getOperatorProfilebyid(LoginID, ID, AlfToken): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('User/GetOperatorProfileByID?UserID=' + LoginID + '&ID=' + ID + '&AlfToken=' + AlfToken).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  getCounterParty(type: number, UserId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Contract/GetOperators?type=' + type + '&UserId=' + UserId).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  GetOperatorExceptGroup(Data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader('Common/GetOperatorExceptGroup', Data).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  searchOperator(LoginID?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('User/GetOperatorProfile?UserID=' + LoginID).subscribe((res: any) => {

        return resolve(res);
      }, (err) => {


        reject(err);
      });
    });
  }

  saveOperator(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.postFormDataWithHeader('User/SaveOperator', data).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('user/GetUserProfile').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  createOrEditNonTritexOperator(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alfApi.postWebscript('tritex/edit-operator', data).then((res: any) => {
        return resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getOperatorProps(id) {
    return new Promise((resolve, reject) => {
      this.alfApi.getWebScript('tritex/get-operator-properties?id=' + id)
        .then(function (data) {
          return resolve(data);
        }, function (error) {
          return reject(error);
        });
    });
  }
}
