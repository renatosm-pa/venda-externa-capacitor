import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuscaPrecoPage } from './busca-preco.page';


const routes: Routes = [
  {
    path: '',
    component: BuscaPrecoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscaPrecoRoutingModule {}
