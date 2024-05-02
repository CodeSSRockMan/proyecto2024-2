import { Component, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { MenuController } from '@ionic/angular';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.page.html',
  styleUrls: ['./reuniones.page.scss'],
})
export class ReunionesPage {
  @ViewChild('swiper', { static: true }) swiper: any;
  meetingName: string = '';
  locationType: string = ''; 
  locationName: string = '';
  physicalLocation: string = '';
  reason: string = '';
  comments: string = '';
  selectedDate: string = '';
  selectedStartTime: string = '';
selectedEndTime: string = '';
  meetingDates: Date[][] = [];
  swiperInstance!: Swiper;
  minDate: string = '';
  defaultDate: string = '';

  constructor(private menuCtrl: MenuController,private elementRef: ElementRef) {
    this.setDates();
   }

   setDates() {
    // Obtener la fecha actual
    const today = new Date();
  
    // Establecer el mínimo y la fecha por defecto como el día de mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    // Convertir las fechas a cadenas de texto en formato ISO 8601
    this.minDate = tomorrow.toISOString().substring(0, 10); // Solo la parte de la fecha
    this.selectedDate = tomorrow.toISOString().substring(0, 10); // Solo la parte de la fecha

    this.selectedStartTime = tomorrow.toISOString().substring(0, 10);
    this.selectedEndTime = tomorrow.toISOString().substring(0, 10);
    console.log(tomorrow);
  }
  
  toggleMenu() {
    this.menuCtrl.toggle(); // Alternar la visibilidad del menú
  }

  addMeetingDate() {
    // Convertir las fechas y horas seleccionadas a objetos Date
    const startDate = new Date(this.selectedDate);
    const startTime = new Date(this.selectedStartTime);
    const endTime = new Date(this.selectedEndTime);

    // Verificar si las fechas son válidas antes de añadir
    if (!isNaN(startDate.getTime()) && !isNaN(startTime.getTime()) && !isNaN(endTime.getTime()) && endTime > startTime) {
        // Verificar si la fecha ya existe en el array antes de agregarla
        if (!this.meetingDates.some(dateEntry => dateEntry[0].getTime() === startDate.getTime() && dateEntry[1].getTime() === startTime.getTime() && dateEntry[2].getTime() === endTime.getTime())) {
            // Añadir las fechas al arreglo
            this.meetingDates.push([startDate, startTime, endTime]);
        } else {
            // Mostrar mensaje de error si la fecha ya existe
            console.error('La fecha ya existe en la lista.');
        }
    } else {
        // Mostrar mensaje de error si la fecha y hora no son válidas
        console.error('Fecha u hora inválida');
    }
}


removeMeetingDate(index: number) {
  if (index > -1 && index < this.meetingDates.length) {
      this.meetingDates.splice(index, 1); // Eliminar la fila completa en el índice dado
  }
}


}
