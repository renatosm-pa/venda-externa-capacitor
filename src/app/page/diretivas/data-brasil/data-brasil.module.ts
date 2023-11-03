import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataBrasilDirective} from './data-brasil.directive';


@NgModule({
    declarations: [
        DataBrasilDirective
    ],
    exports: [DataBrasilDirective],
    imports: [
        CommonModule
    ]
})
export class DataBrasilModule {
}
