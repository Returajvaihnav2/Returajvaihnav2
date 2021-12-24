import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ConfirmationModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    public modalData = {
        title: '',
        message: '',
        cancelTitle: 'Cancel',
        submitTitle: 'Submit',
        closeTitle: '',
        isRemoveXButton: false
    };

    constructor(private _bsModalRef: BsModalRef) {
        this.onClose = new Subject();
    }

    ngOnInit(): void {
    }

    onConfirm(status = null) {
        this.onClose.next(status);
        this._bsModalRef.hide();
    }
}
