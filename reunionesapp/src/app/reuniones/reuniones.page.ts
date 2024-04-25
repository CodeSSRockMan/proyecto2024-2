import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.page.html',
  styleUrls: ['./reuniones.page.scss'],
})
export class ReunionesPage implements OnInit {

  meetingName: string = '';
  location: string = ''; // Aquí inicializamos la propiedad
  physicalLocation: string = '';
  reason: string = '';
  comments: string = '';
  tentativeDates: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  

  addTentativeDate() {
    // Implementar lógica para agregar fechas tentativas a tentativeDates
  }

  saveMeeting() {
    // Implementar lógica para guardar la reunión con los datos ingresados
  }

}
