import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuscaPrecoPage } from './busca-preco.page';
import { BuscaPrecoRoutingModule } from './busca-preco-routing.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscaPrecoRoutingModule
  ],
  declarations: [BuscaPrecoPage]
})
export class  BuscaPrecoPageModule {}
