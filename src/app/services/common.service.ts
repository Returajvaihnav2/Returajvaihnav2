import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public fxRateList: any[] = [];
  isSpinner = true;
  ignoreSpinner = false;
  constructor(private apiService: ApiService, public http: HttpClient, private spinner: SpinnerService) { }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetCountries').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getTimeZone(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetTimeZone?Flag=TimeZone').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  // Get All Crruncies
  getCurrencies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetCurrencies').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  // Currency by country ID
  GetCurrencybyCountryID(countryID): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetCurrencybyCountryID?countryID=' + countryID).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getRegions(userId, Flag: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetRegions?UserId=' + userId + '&Flag=' + Flag).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getCountriesByRegion(regionId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetCountryByRegions?RegionID=' + regionId + '&Flag').subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getEnum(enumType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetEnumValues?enumType=' + enumType).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getFXRate(baseCurrency: any): Promise<any> {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    const url = 'https://data.fixer.io/api/latest?access_key=345e38de02627129e81661f829a1bfc2&base=' + baseCurrency;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        if (this.isSpinner && !this.ignoreSpinner) {
          this.spinner.displaySpinner(false);
        }
        return resolve(res);
      }, (err) => {
        if (this.isSpinner && !this.ignoreSpinner) {
          this.spinner.displaySpinner(false);
        }
        reject(err);
      });
    });
  }

  getFXRateBaseOnDate(baseCurrency: any, date: any): Promise<any> {
    if (this.isSpinner) {
      this.spinner.displaySpinner(true);
    }
    const url = 'https://data.fixer.io/api/' + date + '?access_key=345e38de02627129e81661f829a1bfc2&base=' + baseCurrency;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((res: any) => {
        if (this.isSpinner && !this.ignoreSpinner) {
          this.spinner.displaySpinner(false);
        }
        return resolve(res);
      }, (err) => {
        if (this.isSpinner && !this.ignoreSpinner) {
          this.spinner.displaySpinner(false);
        }
        reject(err);
      });
    });
  }


  getDiscountPeriodDate(StartDate, EndDate, DiscountMonths, isLong): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Contract/GetDiscountPeriodDate?StartDate=' + StartDate + '&EndDate=' + EndDate
        + '&DiscountMonths=' + DiscountMonths + '&isLong=' + isLong).subscribe((res: any) => {
          return resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  saveFeedback(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('User/SaveFeedback', data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  saveRequestDemo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postFormDataWithHeader('User/SaveRequestDemo', data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }
  // #region TDR-461 Need to bifurcate / implement future of subgroup concept
  getRegionTypes(Flag): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader('Common/GetRegionType?Flag=' + Flag).subscribe((res: any) => {
        return resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  // #endregion

  getcolor(tabId: string): string {
    let result = '';
    const element = document.getElementById(tabId) as HTMLElement;
    if (element !== null) {
      const reditem = element.getElementsByClassName('counterred');
      const orangeitem = element.getElementsByClassName('counterorange');
      if (reditem && reditem.length) {
        result = 'counterred ';
      }
      if (orangeitem && orangeitem.length) {
        result += 'counterorange ';
      }
    }
    return result;
  }
}
