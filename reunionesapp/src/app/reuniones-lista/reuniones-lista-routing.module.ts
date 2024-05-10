import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReunionesListaPage } from './reuniones-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ReunionesListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReunionesListaPageRoutingModule {}
