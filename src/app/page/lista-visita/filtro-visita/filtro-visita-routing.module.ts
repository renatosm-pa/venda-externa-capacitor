import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiltroVisitaPage } from './filtro-visita.page';





const routes: Routes = [
  {
    path: '',
    component: FiltroVisitaPage
  }

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroVisitaPageRoutingModule {}
