import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarWarningComponent } from './snack-bar-warning.component';



@NgModule({
  declarations: [SnackBarWarningComponent
  ],
  imports: [
    CommonModule
  ],exports:[SnackBarWarningComponent]
})
export class SnackBarWarningModule { }
