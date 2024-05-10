import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Crear reunión', url: '/reuniones', icon: 'mail' },
    { title: 'Mis grupos', url: '/grupos', icon: 'grid' },
    { title: 'Mis reuniones', url: '/reuniones-lista', icon: 'briefcase' },
  ];
  public labels = [
    
  //  'Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'
  
  ];
  constructor() {}
}
