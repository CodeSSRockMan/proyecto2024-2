import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoReunionPageRoutingModule } from './estado-reunion-routing.module';

import { EstadoReunionPage } from './estado-reunion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoReunionPageRoutingModule
  ],
  declarations: [EstadoReunionPage]
})
export class EstadoReunionPageModule {}
