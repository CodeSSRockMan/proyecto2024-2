import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReunionesAgregarParticipantePageRoutingModule } from './reuniones-agregar-participante-routing.module';

import { ReunionesAgregarParticipantePage } from './reuniones-agregar-participante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReunionesAgregarParticipantePageRoutingModule
  ],
  declarations: [ReunionesAgregarParticipantePage],
})
export class ReunionesAgregarParticipantePageModule {}
