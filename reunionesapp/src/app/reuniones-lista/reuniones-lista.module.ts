import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReunionesListaPageRoutingModule } from './reuniones-lista-routing.module';

import { ReunionesListaPage } from './reuniones-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReunionesListaPageRoutingModule
  ],
  declarations: [ReunionesListaPage]
})
export class ReunionesListaPageModule {}
