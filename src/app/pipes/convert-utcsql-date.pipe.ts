import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'convertUTCSqlDate'
})
export class ConvertUTCSqlDatePipe implements PipeTransform {

  transform(date: any, format = 'DD/MM/YYYY HH:mm:ss') {
    if (date) {
      let localText;
      if (date instanceof moment) {

        const _date: any = date;
        localText = moment(moment.utc(_date._i, format).toDate()).format(format);
      } else {
        localText = moment(moment.utc(date, format).toDate()).format(format);
      }
      return localText;

    } else {
      return '';
    }
  }

}
