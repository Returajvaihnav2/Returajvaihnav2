import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
    name: 'getfilterinarrayitem'
})
export class GetFilterInArrayItem implements PipeTransform {

    transform(array: any[], key: string, val: string): any {
        const result = [];
        if (val) {
            _.filter(array, row => {
                if (row.hasOwnProperty(key)) {
                    if (row[key] == val) {
                        result.push(row);
                    }
                }
            }
            );
        }
        return result;
    }
}
