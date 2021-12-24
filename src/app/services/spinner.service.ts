import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SpinnerService {
    public spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    displaySpinner(value: boolean) {
        this.spinnerStatus.next(value);
    }
}
