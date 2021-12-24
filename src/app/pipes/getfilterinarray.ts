import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
    name: 'getfilterinarray'
})
export class GetFilterInArray implements PipeTransform {

    transform(array: any[], key: string, val: string): any {
        if (val) {
            return _.filter(array, row => {
                let isMatched = false;
                if (row.hasOwnProperty(key)) {
                    if (row[key] == val) {
                        isMatched = true;
                    }
                }
                return isMatched;
            }
            );
        }
        return array;
    }
}
