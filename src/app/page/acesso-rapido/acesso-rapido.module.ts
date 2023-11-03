import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcessoRapidoPageRoutingModule } from './acesso-rapido-routing.module';

import { AcessoRapidoPage } from './acesso-rapido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcessoRapidoPageRoutingModule
  ],
  declarations: [AcessoRapidoPage]
})
export class AcessoRapidoPageModule {}
