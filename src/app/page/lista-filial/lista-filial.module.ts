import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {ComponenteModule} from "../../componentes/componente.module";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PdfService } from 'src/app/services/pdf.service';
import { FilialListPage } from './lista-filial.page';
import { FilialListPageRoutingModule } from './lista-filial-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FilialListPageRoutingModule,
        ComponenteModule,
        FontAwesomeModule
    ],
  declarations: [FilialListPage],

  providers:[
    PdfService
  ]
})
export class FilialListPageModule {}
