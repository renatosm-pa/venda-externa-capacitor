import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilialListPage } from './lista-filial.page';



const routes: Routes = [
  {
    path: '',
    component: FilialListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilialListPageRoutingModule {}
