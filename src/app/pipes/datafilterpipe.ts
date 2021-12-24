import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => {
                let isMatched = false;
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        const str = String(row[key]);
                        const objString = str.toLocaleLowerCase();
                        const queryString = query.toLocaleLowerCase();
                        if (objString.includes(queryString)) {
                            isMatched = true;
                        }
                    }
                }
                return isMatched;
            }
            );
        }
        return array;
    }
}
