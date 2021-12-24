import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maxLengthTextGetPipe' })

export class MaxLengthTextGetPipe implements PipeTransform {
  transform(value: any, size?: any): any {
    let text = value;
    if (value) {
      text = value.length > size ? value.substring(0, size) + '..' : value;
    }
    return text;
  }
}
