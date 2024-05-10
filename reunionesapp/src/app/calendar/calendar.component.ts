import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [
      // Eventos aquí
    ],
    // Otras opciones aquí
  };
  constructor() { }

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      events: [
        // Aquí puedes definir tus eventos
        { title: 'Evento 1', date: '2022-04-20' },
        { title: 'Evento 2', date: '2022-04-25' }
      ]
    };
  }
}
