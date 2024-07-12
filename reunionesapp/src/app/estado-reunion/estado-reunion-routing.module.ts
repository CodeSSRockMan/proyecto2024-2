import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoReunionPage } from './estado-reunion.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoReunionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoReunionPageRoutingModule {}
