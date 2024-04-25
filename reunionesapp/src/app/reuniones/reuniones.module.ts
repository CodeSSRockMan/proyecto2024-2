import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReunionesPageRoutingModule } from './reuniones-routing.module';

import { ReunionesPage } from './reuniones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReunionesPageRoutingModule
  ],
  declarations: [ReunionesPage]
})
export class ReunionesPageModule {}
