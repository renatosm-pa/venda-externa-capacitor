import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ComponenteModule} from "../../componentes/componente.module";
import { PedidoListPageRoutingModule } from './lista-pedido-routing.module';
import { PedidoListPage } from './lista-pedido.page';

import { PdfService } from 'src/app/services/pdf.service';
import { FiltroComponentPage } from './filtro-component/filtro-component.page';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PedidoListPageRoutingModule,
        ComponenteModule,        
    ],
  declarations: [PedidoListPage, FiltroComponentPage],
  providers:[
    PdfService
  ]
})
export class PedidoListPageModule {}
