import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterGuestPage } from './register-guest.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterGuestPageRoutingModule {}
