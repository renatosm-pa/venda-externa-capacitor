import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TecladoComponent} from './teclado/teclado.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [TecladoComponent  ],
    exports: [
        TecladoComponent ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class ComponenteModule {
}
