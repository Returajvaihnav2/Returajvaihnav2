import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceTextPipe'
})
export class ReplaceTextPipe implements PipeTransform {

    transform(query: string): any {
        if (query && query.length > 0) {
            return query.toString().replace(/,/g, '');
        }
        return '';
    }
}
