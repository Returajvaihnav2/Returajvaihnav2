import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'negative' })

export class NegativeBracket implements PipeTransform {
  transform(value) {
    return value;
    // // commented add bracket code
    // if (value) {
    //   const strVal = value.toString();
    //   if (strVal[0] === '-') {
    //     return '(' + strVal.substring(1) + ')';
    //   }
    //   return strVal;
    // }
    // return value;
  }
}
