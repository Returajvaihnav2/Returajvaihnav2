import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getParseArray'
})
export class GetParseArrayPipe implements PipeTransform {

  transform(value: any, key: any): any {
    if (value) {
      return value.map(x => x[key]);
    } else {
      return '';
    }
  }

}
