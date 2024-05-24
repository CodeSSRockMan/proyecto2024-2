import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { GuestCodeModalComponent } from '../guest-code-modal/guest-code-modal.component'; // Asegúrate de que la ruta sea correcta


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage, GuestCodeModalComponent]
})
export class LoginPageModule {}
