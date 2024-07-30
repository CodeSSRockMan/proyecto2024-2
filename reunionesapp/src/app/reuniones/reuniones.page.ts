import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { ReunionesService } from '../services/reuniones.service';
import { Reunion, FechaReunion, Participante } from '../services/reuniones.service';
import { AuthService } from '../services/auth.service';

Swiper.use([Navigation, Pagination]);

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
  selectedDates: string[] = [];
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  meetingDates: FechaReunion[] = [];
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
  
  constructor(private menuCtrl: MenuController, private router: Router, private reunionesService: ReunionesService,private authService:AuthService) {
    this.location = { type: '', value: '', other: '' };
    
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

  // Método para añadir una fecha de reunión
  // Método para añadir una fecha de reunión
  addMeetingDate() {
    console.log("Selected Dates:", this.selectedDates);
    console.log("Selected Start Time:", this.selectedStartTime);
    console.log("Selected End Time:", this.selectedEndTime);

    if (!this.selectedDates.length || !this.selectedStartTime || !this.selectedEndTime) {
      console.error('Una o más fechas u horas están vacías');
      return;
    }

    // Convertir la hora de inicio y fin en minutos desde medianoche
    const [startHour, startMinute] = this.selectedStartTime.split(':').map(Number);
    const [endHour, endMinute] = this.selectedEndTime.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Verificar que la hora de fin no sea antes de la hora de inicio
    if (endTimeInMinutes <= startTimeInMinutes) {
      console.error('La hora de fin debe ser después de la hora de inicio.');
      return;
    }

    this.selectedDates.forEach(dateStr => {
      // Convertir la fecha seleccionada a un formato Date
      const date = new Date(dateStr);

      // Crear las fechas y horas directamente
      const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, startMinute);
      const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, endMinute);

      // Solo la fecha en formato YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0]; // Obtener YYYY-MM-DD

      // Solo la hora en formato HH:MM
      const formattedStartTime = startDateTime.toTimeString().split(' ')[0].slice(0, 5); // Obtener HH:MM
      const formattedEndTime = endDateTime.toTimeString().split(' ')[0].slice(0, 5); // Obtener HH:MM

      // Verificar si ya existe una fecha tentativa igual
      const existingDate = this.meetingDates.find(m => m.fecha === formattedDate && m.hora_inicio === formattedStartTime && m.hora_fin === formattedEndTime);
      if (existingDate) {
        console.error('La fecha y hora ya están registradas.');
        return;
      }

      // Guardar la fecha y las horas sin zona horaria
      this.meetingDates.push({
        id:0,
        fecha: formattedDate, // Solo la fecha en formato YYYY-MM-DD
        hora_inicio: formattedStartTime, // Solo la hora de inicio en formato HH:MM
        hora_fin: formattedEndTime // Solo la hora de fin en formato HH:MM
      });
    });

    console.log("Meeting Dates:", this.meetingDates);

    this.slides[1].valid = this.meetingDates.length > 0;
    this.isSlideValid(1);
    this.completeSlide(1);
}

  
  

  // Formatea la fecha en formato ISO 8601
// Formatea la fecha en formato DD/MM/YYYY desde una fecha ISO
// Formatea la fecha en formato DD/MM/YYYY desde una fecha en formato ISO o DD/MM/YYYY
// Método para formatear la fecha
formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // Día de la semana
    day: 'numeric',  // Día del mes
    month: 'long',   // Mes
    year: 'numeric'  // Año
  };

  return date.toLocaleDateString('es-ES', options);
}

formatTime(time: string): string {
  // Verificar si el tiempo está en formato válido (HH:mm)
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    console.error("Invalid Time:", time);
    return "Hora Inválida";
  }

  // Crear un objeto Date con la hora y minuto proporcionado
  const d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(0); // Establecer segundos a 0

  // Opciones para el formato en 12 horas con AM/PM
  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const formattedTime = d.toLocaleTimeString('es-ES', options);

/*   console.log("Original Time String:", time);
  console.log("Parsed Time Object:", d);
  console.log("Formatted Time:", formattedTime); */

  return formattedTime; // Devuelve la hora en formato 12 horas con AM/PM
}

  /* formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  formatTime(date: Date): string {
    return date.toLocaleString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
 */
  async crearReunion() {
    if (this.meetingDates.length === 0) {
      console.error('No hay fechas de reunión seleccionadas.');
      return;
    }

    const userId = this.authService.getCurrentUserId();
  if (!userId) {
    console.error('User ID is invalid or not found');
    return;
  }
  
    const nuevaReunion: Reunion = {
      id:0,
      motivo: this.motivo,
      ubicacion: this.location.value, // Cambiado aquí
      tipo: this.location.type,
      codigo_invitacion: '',
      comentarios: this.comentarios,
      estado: 'planificacion',
      fechas_reunion: this.meetingDates.map(date => ({
        id:0,
        fecha: date.fecha,
        hora_inicio: date.hora_inicio,
        hora_fin: date.hora_fin
      })),
      participantes: [],
      created_by: userId // Cambiado aquí
    };
  
    try {
      await this.reunionesService.crearReunion(nuevaReunion);
      console.log('Nueva reunión creada:', nuevaReunion);
      this.router.navigate(['/home']); // Actualizado aquí, sin estado
    } catch (error) {
      console.error('Error al crear la reunión:', error);
    }
  }
  

  updateEndTime() {
    if (this.selectedStartTime) {
      // Crea un objeto Date usando la hora de inicio
      const startTime = new Date(`1970-01-01T${this.selectedStartTime}:00`); // Ajusta para formato de 24 horas
  
      // Crea una nueva fecha usando la hora de inicio
      const endTime = new Date(startTime);
      
      // Aumenta la hora de fin en 1 hora
      endTime.setHours(startTime.getHours() + 1);
      
      // Obtén la hora y minuto en formato de 24 horas
      const endHour = endTime.getHours();
      const endMinute = endTime.getMinutes();
      
      // Formatea la hora de fin en formato de 24 horas
      this.selectedEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      console.log('Hora de fin actualizada a:', this.selectedEndTime);
    }
  }
  

  // Método para establecer las fechas mínimas y predeterminadas
// Método para redondear los minutos al siguiente valor disponible en intervalos de 15 minutos
roundMinutes(minutes: number): number {
  return Math.ceil(minutes / 15) * 15;
}

// Método para establecer las fechas mínimas y predeterminadas
setDates() {
  const today = new Date();
  const currentHours = today.getHours();
  const currentMinutes = today.getMinutes();

  // Redondear los minutos al siguiente valor disponible en intervalos de 15 minutos
  const roundedMinutes = this.roundMinutes(currentMinutes);
  
  // Hora de inicio: una hora más adelante con minutos redondeados
  const startHour = (currentHours) % 24; // Asegura que no exceda las 24 horas
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, roundedMinutes);
  
  // Hora de fin: una hora después de la hora de inicio
  const endHour = (startHour + 1) % 24; // Hora de fin es una hora después de la hora de inicio
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, roundedMinutes);

  // Convertir las fechas a las zonas horarias locales y formatear para ion-datetime
  this.minDate = today.toISOString().substring(0, 10); // Fecha actual sin hora
  this.selectedDates = [today.toISOString().substring(0, 10)]; // Iniciar con un arreglo con la fecha actual
  this.selectedStartTime = startDate.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }); // Hora de inicio en formato local
  this.selectedEndTime = endDate.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }); // Hora de fin en formato local

  // Asegúrate de que se muestre correctamente en el formato esperado por ion-datetime
/*   console.log('Min Date:', this.minDate);
  console.log('Selected Dates:', this.selectedDates);
  console.log('Selected Start Time:', this.selectedStartTime);
  console.log('Selected End Time:', this.selectedEndTime); */
}

  // Generar opciones de hora
  generateHourOptions() {
    this.hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  }

  // Generar opciones de minuto
  generateMinuteOptions() {
    this.minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  }

  isSlideValid(index: number): boolean {
    switch(index) {
      case 0:
        return this.location.type !== '' && (this.location.type === 'presencial' ? this.location.value !== '' : true) && this.motivo !== '' && this.comentarios !== '';
      case 1:
        return this.selectedDates.length > 0 && this.selectedStartTime !== '' && this.selectedEndTime !== '';
      case 2:
        return this.meetingDates.length > 0;
      default:
        return false;
    }
  }

  completeSlide(index: number) {
    if (this.isSlideValid(index)) {
      this.slides[index].progress = 100;
      this.slides[index].valid = true;
      this.goToNextSlide();
    } else {
      this.slides[index].progress = 0;
      this.slides[index].valid = false;
    }
  }
  validateSlide(index: number): boolean {
    switch(index) {
      case 0:
        return this.meetingName !== '' && this.location.type !== '' && (this.location.type === 'presencial' ? this.location.value !== '' : true) && this.motivo !== '' && this.comentarios !== '';
      case 1:
        return this.selectedDates.length > 0 && this.selectedStartTime !== '' && this.selectedEndTime !== '';
      case 2:
        return this.meetingDates.length > 0;
      default:
        return false;
    }
  }
  
  goToNextSlide() {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    }
  }
  removeMeetingDate(index: number) {
    if (index >= 0 && index < this.meetingDates.length) {
      this.meetingDates.splice(index, 1);
    } else {
      console.error('Índice de reunión fuera de rango:', index);
    }
  }
}
