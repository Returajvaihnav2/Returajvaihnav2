
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'mathfloor' })
export class MathFloorPipe implements PipeTransform {
    transform(input: number) {
        return Math.floor(input);
    }
}


@Pipe({ name: 'mathciel' })
export class MathCielPipe implements PipeTransform {
    transform(input: number) {
        return Math.ceil(input);
    }
}
