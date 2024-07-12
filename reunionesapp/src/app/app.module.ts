import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GuestCodePopoverComponent } from './guest-code-popover/guest-code-popover.component';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent,GuestCodePopoverComponent],
  imports: [BrowserModule, IonicModule.forRoot(),ReactiveFormsModule, AppRoutingModule, FullCalendarModule,FormsModule],
  exports: [GuestCodePopoverComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
