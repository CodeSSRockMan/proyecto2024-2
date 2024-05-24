import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterGuestPageRoutingModule } from './register-guest-routing.module';

import { RegisterGuestPage } from './register-guest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterGuestPageRoutingModule
  ],
  declarations: [RegisterGuestPage]
})
export class RegisterGuestPageModule {}
