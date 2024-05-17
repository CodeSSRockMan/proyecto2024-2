import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarParticipanteManualPage } from './agregar-participante-manual.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarParticipanteManualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarParticipanteManualPageRoutingModule {}
