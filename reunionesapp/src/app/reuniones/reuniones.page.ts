import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Router } from '@angular/router';

Swiper.use([Navigation, Pagination]);

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fechas: any[]; // Se mantiene igual, asumiendo que ya contiene la información de fecha y hora
  participantes: Participante[];
  createdByUser: boolean;
  direccion?:string;
  ubicacion?: string; // Ubicación de la reunión (opcional)
  tipo?: string; // Tipo de reunión (opcional)
}

interface Participante {
  nombre: string;
  telefono: string;
}

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.page.html',
  styleUrls: ['./reuniones.page.scss'],
})
export class ReunionesPage implements OnInit {
  @ViewChild('swiperContainer', { read: ElementRef }) swiperContainer!: ElementRef<HTMLElement>;
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
  minDate: string = '';
  defaultDate: string = '';
  progressValue: number = 0;
  slides: { progress: number, valid: boolean }[] = [];
  swiperInstance: Swiper | null = null;
  timeOptions: string[] = [];
  selectedStartHour: string = '';
  selectedStartMinute: string = '';
  selectedEndHour: string = '';
  selectedEndMinute: string = '';
  hourOptions: string[] = [];
  minuteOptions: string[] = [];
  motivo: string = '';
  comentarios: string = '';
  location: { type: string, value: string, other?: string };
  

  constructor(private menuCtrl: MenuController, private router: Router) {
    this.location = { type: '', value: '', other: '' };
    this.setDates();
    this.slides = [
      { progress: 0, valid: false }, // Slide 1
      { progress: 0, valid: false }, // Slide 2
      { progress: 0, valid: false }, // Slide 3
    ];
    this.generateHourOptions();
    this.generateMinuteOptions();
  }

  checkOtherOption() {
    if (this.location.value !== 'otro') {
      this.location.other = '';
    }
  }

  getIconForPlatform(platform: string): string {
    const icons: { [key: string]: string } = {
      'discord': 'logo-discord',
      'facebook': 'logo-facebook',
      'google-meet': 'logo-google',
      'skype': 'logo-skype',
      'teams': 'logo-microsoft',
      'telegram': 'paper-plane-outline',
      'webex': 'globe-outline',
      'whatsapp': 'logo-whatsapp',
      'zoom': 'videocam-outline',
      'otro': 'create-outline'
    };
    return icons[platform] || 'desktop-outline';
  }

  ngOnInit() {
    this.setDates();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initSwiper();
    }, 100); // Retrasa la inicialización por 100 milisegundos
  }

  initSwiper() {
    const swiperContainer = this.swiperContainer.nativeElement;
    if (swiperContainer) {
      this.swiperInstance = new Swiper(swiperContainer, {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    } else {
      console.error('Swiper container not found');
    }
  }

  isDateObject(obj: any): boolean {
    return obj instanceof Date;
  }

  addMeetingDate() {
    if (!this.selectedDate || this.selectedDate.length === 0 || !this.selectedStartTime || !this.selectedEndTime) {
      console.error('Debes seleccionar la fecha, hora de inicio y hora de fin antes de añadir la reunión.');
      return;
    }
  
    // Iterar sobre las fechas seleccionadas
    for (let i = 0; i < this.selectedDate.length; i++) {
      const selectedDate = new Date(this.selectedDate[i]);
      const selectedStartTime = new Date(this.selectedStartTime);
      const selectedEndTime = new Date(this.selectedEndTime);
  
      // Sumar 4 horas para convertir a hora de Chile
      selectedDate.setHours(selectedDate.getHours() + 4);
      selectedStartTime.setHours(selectedStartTime.getHours());
      selectedEndTime.setHours(selectedEndTime.getHours());
  
      // Verificar si las fechas y horas son válidas
      if (isNaN(selectedDate.getTime()) || isNaN(selectedStartTime.getTime()) || isNaN(selectedEndTime.getTime())) {
        console.error('Una o más fechas u horas son inválidas:', selectedDate, selectedStartTime, selectedEndTime);
        continue; // Saltar esta iteración si alguna fecha u hora es inválida
      }
  
      // Crear un objeto combinado de reunión
      const combinedMeeting = [selectedDate, selectedStartTime, selectedEndTime];
  
      // Verificar si la reunión ya existe en la matriz meetingDates
      const alreadyExists = this.meetingDates.some(existingMeeting =>
        existingMeeting[0].getTime() === selectedDate.getTime() &&
        existingMeeting[1].getTime() === selectedStartTime.getTime() &&
        existingMeeting[2].getTime() === selectedEndTime.getTime()
      );
  
      if (alreadyExists) {
        console.error('La reunión ya existe en la lista de reuniones:', combinedMeeting);
        continue; // Saltar esta iteración si la reunión ya existe
      }
  
      // Añadir la reunión a la matriz meetingDates
      this.meetingDates.push(combinedMeeting);
  
      // Log para verificar los datos agregados
      console.log('Datos añadidos:', combinedMeeting);
    }
  
    // Ordenar las reuniones por fecha ascendente
    this.meetingDates.sort((a, b) => a[0].getTime() - b[0].getTime());
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  formatTime(date: Date): string {
    return date.toLocaleString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  
  
  
  
  
  
  


  crearReunion() {
    // Verificar si hay fechas de reunión seleccionadas
    if (this.meetingDates.length === 0) {
      console.error('No hay fechas de reunión seleccionadas.');
      return; // Salir de la función si no hay fechas seleccionadas
    }
  
    // Crear una nueva reunión con los datos actuales
    const nuevaReunion: Reunion = {
      motivo: this.motivo,
      ubicacion: this.locationName,
      tipo: this.locationType,
      comentarios: this.comentarios,
      estado: 'programada', // Se puede establecer un estado predeterminado
      fechas: this.meetingDates, // Usar todas las fechas agregadas
      participantes: [],
      createdByUser: true // Suponiendo que la reunión fue creada por el usuario
    };
  
    // Agregar un registro de consola para mostrar la nueva reunión
    console.log('Nueva reunión:', nuevaReunion);
  
    // Navegar al componente de la página de inicio (Home) y pasar la reunión como parámetro
    this.router.navigate(['/home'], { state: { reunion: nuevaReunion } });
  
    // Luego de crear la reunión, puedes restablecer los campos de motivo y comentarios si es necesario
    this.motivo = '';
    this.comentarios = '';
  
    // También puedes realizar cualquier otra acción que necesites después de crear la reunión
  }

  updateEndTime() {
    if (this.selectedStartTime) {
      const startTime = new Date(this.selectedStartTime);
      const endTime = new Date(startTime);

      // Añadir una hora a la hora de inicio
      endTime.setHours(startTime.getHours() + 1);

      const endYear = endTime.getFullYear();
      const endMonth = ('0' + (endTime.getMonth() + 1)).slice(-2);
      const endDate = ('0' + endTime.getDate()).slice(-2);
      const endHours = ('0' + endTime.getHours()).slice(-2);
      const endMinutes = ('0' + endTime.getMinutes()).slice(-2);
      this.selectedEndTime = `${endYear}-${endMonth}-${endDate}T${endHours}:${endMinutes}`;
    } else {
      console.log('La hora de inicio no está definida. No se puede actualizar la hora de fin.');
    }
  }

  generateHourOptions() {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourString = hour.toString().padStart(2, '0');
      hours.push(hourString);
    }
    this.hourOptions = hours;
  }

  generateMinuteOptions() {
    const minutes = [];
    for (let minute = 0; minute < 60; minute += 15) {
      const minuteString = minute.toString().padStart(2, '0');
      minutes.push(minuteString);
    }
    this.minuteOptions = minutes;
  }

  updateMinutes(type: string) {
    if (type === 'start') {
      this.selectedStartTime = `${this.selectedStartHour}:${this.selectedStartMinute}`;
    } else {
      this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
    }
  }

  isSlideValid(index: number): boolean {
    switch(index) {
      case 0:
        return this.meetingName !== '' && this.location.type !== '' && (this.location.type === 'presencial' ? this.location.value !== '' : true) && this.motivo !== '' && this.comentarios !== '';
      case 1:
        return this.selectedDate !== '' && this.selectedStartTime !== '' && this.selectedEndTime !== '';
      case 2:
        return this.meetingDates.length > 0;
      default:
        return false;
    }
  }
  
  completeSlide(index: number, isValid: boolean) {
    if (this.isSlideValid(index)) {
      this.slides[index].progress = 100;
      this.slides[index].valid = true;
      this.goToNextSlide();
    } else {
      this.slides[index].progress = 0;
      this.slides[index].valid = false;
    }
  }
  
  goToNextSlide() {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    }
  }

  validateSlide(index: number): boolean {
    switch(index) {
      case 0:
        return this.meetingName !== '' && this.locationName !== '' && this.physicalLocation !== '' && this.reason !== '' && this.comments !== '';
      case 1:
        return this.selectedDate !== '' && this.selectedStartTime !== '' && this.selectedEndTime !== '';
      case 2:
        return this.meetingDates.length > 0;
      default:
        return false;
    }
  }

  nextSlide() {
    this.progressValue += 0.33; // Incrementa el valor de progreso en un tercio
  }

  setDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().substring(0, 10); // Solo la parte de la fecha
    this.selectedDate = tomorrow.toISOString().substring(0, 10); // Solo la parte de la fecha
    this.selectedStartTime = this.selectedDate + 'T00:00:00'; // Hora de inicio a las 00:00:00
    this.selectedEndTime = this.selectedDate + 'T01:00:00'; // Hora de fin a la 01:00:00
  }

  toggleMenu() {
    this.menuCtrl.toggle(); // Alternar la visibilidad del menú
  }

  removeMeetingDate(index: number) {
    if (index > -1 && index < this.meetingDates.length) {
      this.meetingDates.splice(index, 1);
    }
  }

  removeAllMeetingDates() {
    this.meetingDates = [];
  }
}
