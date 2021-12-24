import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nullCheckPipe'
})
export class NullCheckPipe implements PipeTransform {

    transform(query: string): any {
        if (query == 'true') {
            return 'true';
        } else if (query == 'false') {
            return 'false';
        } else if (query == '0') {
            return '0';
        } else if (query && query !== null) {
            return query.toString();
        } else {
            return '';
        }

    }
}
