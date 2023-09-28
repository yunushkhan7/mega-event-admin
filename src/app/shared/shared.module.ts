import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective, FloatNumberDirective, keyPressAlphaNumeric, keyPressNumeric, keyPressAlphaNumericWithSpace, keyPressAlphaNumericWithHypen } from './directive/number.directive';
import { PricePipe, SafePipe } from './pipe/status.pipe';
import { TextmaskPipe } from './pipe/textmask.pipe';
import { RouterBackDirective, onlyCharactersDirective, onlyNumbersAndHyphenDirective } from './directive/router-back.directive';
import { ActionPopupModule } from '../core/action-popup/action-popup.module';
import { AutofocusDirective } from './directive/autofocus.directive';

const components = [
  NumberDirective,
  FloatNumberDirective,
  keyPressAlphaNumeric,
  keyPressNumeric,
  keyPressAlphaNumericWithSpace,
  keyPressAlphaNumericWithHypen,
  PricePipe,
  SafePipe,
  TextmaskPipe,
  RouterBackDirective,
  onlyCharactersDirective,
  onlyNumbersAndHyphenDirective,
  AutofocusDirective

]
@NgModule({
  declarations: components,
  imports: [CommonModule, ActionPopupModule],
  exports: components
})
export class SharedModule { }
