import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];
        if (value) {
            keys = Object.keys(value);
        }
        return keys;
    }
}
