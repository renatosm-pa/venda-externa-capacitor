import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcessoRapidoPage } from './acesso-rapido.page';

const routes: Routes = [
  {
    path: '',
    component: AcessoRapidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcessoRapidoPageRoutingModule {}
