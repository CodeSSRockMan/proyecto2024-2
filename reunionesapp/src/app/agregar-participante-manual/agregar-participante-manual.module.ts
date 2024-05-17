import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarParticipanteManualPageRoutingModule } from './agregar-participante-manual-routing.module';

import { AgregarParticipanteManualPage } from './agregar-participante-manual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarParticipanteManualPageRoutingModule
  ],
  declarations: [AgregarParticipanteManualPage]
})
export class AgregarParticipanteManualPageModule {}
