import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipe } from './datafilterpipe';
import { KeysPipe } from './getkeyspipe';
import { NullCheckPipe } from './nullcheckpipe';
import { PermissionPipe } from './permission-pipe';
import { GetPriceIndex } from './getpriceindex';
import { GetFilterInArray } from './getfilterinarray';
import { ConvertUTCSqlDatePipe } from './convert-utcsql-date.pipe';
import { GetParseArrayPipe } from './get-parse-array.pipe';
import { GetFilterInArrayItem } from './getfilterinarrayitem';
import { MathFloorPipe, MathCielPipe } from './math-floor.pipe';
import { MaxLengthTextGetPipe } from './max-length-text-get.pipe';

import { ReplaceTextPipe } from './replaceTextpipe';
import { NegativeBracket } from '../chat/pipes/negative-bracket.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DataFilterPipe, KeysPipe, NullCheckPipe, ReplaceTextPipe, PermissionPipe, GetPriceIndex, GetFilterInArray,
    GetFilterInArrayItem, ConvertUTCSqlDatePipe, GetParseArrayPipe, MathFloorPipe, MathCielPipe, MaxLengthTextGetPipe, NegativeBracket],
  exports: [DataFilterPipe, KeysPipe, NullCheckPipe, ReplaceTextPipe, PermissionPipe,
    GetPriceIndex, GetFilterInArray, GetFilterInArrayItem, ConvertUTCSqlDatePipe, GetParseArrayPipe, MathFloorPipe, MathCielPipe, MaxLengthTextGetPipe, NegativeBracket]
})
export class DataFilterPipeModule {
}
