import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getpriceindex'
})
export class GetPriceIndex implements PipeTransform {

    transform(array: any[], query: string): any {
        const result = array.filter(x => x.OrderIndex == query);
        if (result && result.length > 0) {
            return result[0];
        } else {
            return result;
        }
    }
}
