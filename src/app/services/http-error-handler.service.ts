import { Injectable } from '@angular/core';

import { LoggerService } from './log4ts/logger.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { throwError } from 'rxjs';
@Injectable()

export class HttpErrorHandler {

  ignoreEndpointErrors = {
    'billPayment/transfer-money-gth': true,
    'wallet/add-beneficiary': true
  };

  constructor(
    private logger: LoggerService,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  handleError(serviceName = '', error: any, endpoint = 'operation', isAlert = true) {

    // return (error: HttpErrorResponse): Observable<T> => {
    // TODO: send the error to remote logging infrastructure

    //  this.logger.info(endpoint);
    // this.logger.error(error); // log to console instead
    //
    this.spinner.displaySpinner(false);
    if (error.status === 401 || error.status === 403) {
      this.router.navigate(['/auth/login']);
    }
    // const message = (error.error instanceof Object) ?
    //   error.error.error :
    //   `server returned code ${error.status} with body '${error.message}'`;

    // switch (error.status) {
    //   case 400:
    //     return throwError(error);
    //   case 401:
    //     return throwError(error);
    //   case 403:
    //     // return Observable.throw({ status: error.status, message: 'Unauthorized user' });
    //     return throwError(error);
    //   case 404:
    //     // return Observable.throw({ status: error.status, message: 'Resource not found' });
    //     return throwError(error);
    //   case 500:
    //     // return Observable.throw('Server is unable to process your request please try again');
    //     return throwError(error);
    //   default:
    //     this.logger.info('No condition matched');
    //     return throwError(error);
    // }
    return error;
    // };
  }


}
