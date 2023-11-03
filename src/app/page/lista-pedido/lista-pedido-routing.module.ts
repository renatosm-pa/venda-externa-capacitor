import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidoListPage } from './lista-pedido.page';


const routes: Routes = [
  {
    path: '',
    component: PedidoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class PedidoListPageRoutingModule {}
