import { NgModule } from '@angular/core';
import {ValorDecimalDirective} from './valor-decimal.directive';

@NgModule({
  declarations: [ValorDecimalDirective],
  exports: [ValorDecimalDirective]
})
export class ValorDecimalModule { }
