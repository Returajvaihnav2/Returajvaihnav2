import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})


export class DateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value instanceof Date) {
      const currDate = new Date();
      if (value.toDateString() === currDate.toDateString()) {
        return 'Today';
      }
      currDate.setDate(currDate.getDate() - 1);
      if (value.toDateString() === currDate.toDateString()) {
        return 'Yesterday';
      }
    }
    return super.transform(value, args);
  }
}
