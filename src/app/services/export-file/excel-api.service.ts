import { Injectable } from '@angular/core';
import { NodeJsAPIService } from '../nodejs-api.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelApiService {

  constructor(private nodeJsAPIService: NodeJsAPIService) {

  }
  GetExcel(url, data, responseType, graph?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nodeJsAPIService.postWithNodeJsApi(url, data, responseType).subscribe(res => {
        return resolve(res);
      });
    });
  }
}
