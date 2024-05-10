import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { register } from 'swiper/element/bundle';
register();
import dayGridPlugin from '@fullcalendar/daygrid';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Crear reunión', url: '/reuniones', icon: 'mail' },
    { title: 'Mis grupos', url: '/grupos', icon: 'grid' },
    { title: 'Mis reuniones', url: '/reuniones-lista', icon: 'briefcase' },
    { title: 'Participantes', url: '/participantes', icon: 'people' },
    { title: 'Agregar participantes', url: '/reuniones-agregar-participante', icon: 'people' },
  ];
  public labels = [
    
  //  'Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'
  
  ];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };
  constructor() {}
}
