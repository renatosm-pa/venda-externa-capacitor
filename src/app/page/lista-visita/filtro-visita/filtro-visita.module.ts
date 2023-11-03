import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponenteModule } from 'src/app/componentes/componente.module';
import { CommonModule } from '@angular/common';
import { FiltroVisitaPage } from './filtro-visita.page';
import { FiltroVisitaPageRoutingModule } from './filtro-visita-routing.module';
import { NgCalendarModule  } from 'ionic2-calendar';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FiltroVisitaPageRoutingModule,
        ComponenteModule,
        NgCalendarModule
    ],
  declarations: [FiltroVisitaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FiltroProdutoPageModule {}
