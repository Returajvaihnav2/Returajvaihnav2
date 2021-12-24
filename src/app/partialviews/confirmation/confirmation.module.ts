import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ConfirmationModalComponent],
  entryComponents: [ConfirmationModalComponent],
  exports: [ConfirmationModalComponent]
})
export class ConfirmationModule { }
