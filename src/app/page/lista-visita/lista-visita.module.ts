import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {ComponenteModule} from "../../componentes/componente.module";

import { VisitaListPage } from './lista-visita.page';
import { VisitaListPageRoutingModule } from './lista-visita-routing.module';
import { FiltroVisitaPage } from './filtro-visita/filtro-visita.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VisitaListPageRoutingModule,
        ComponenteModule        
    ],
  declarations: [VisitaListPage, FiltroVisitaPage]
})
export class VisitaListPageModule {}
//, FiltroVisitaPage