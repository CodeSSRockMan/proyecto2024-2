import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReunionesAgregarParticipantePage } from './reuniones-agregar-participante.page';

const routes: Routes = [
  {
    path: '',
    component: ReunionesAgregarParticipantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReunionesAgregarParticipantePageRoutingModule {}
