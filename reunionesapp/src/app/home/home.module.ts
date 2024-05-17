import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { DatePickerComponent } from '../date-picker/date-picker.component'; // Importa el componente

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FullCalendarModule,
  ],
  declarations: [HomePage,DatePickerComponent],
  schemas: []
})
export class HomePageModule {}
