import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReunionesPage } from './reuniones.page';

const routes: Routes = [
  {
    path: '',
    component: ReunionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReunionesPageRoutingModule {}
