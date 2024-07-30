import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReunionesService, Reunion, Participante, FechaReunion } from '../services/reuniones.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  upcomingActivityDates: Date[] = [];
  userCreatedActivities: { date: Date, description: string, lugar: string }[] = [];
  participantActivities: { date: Date, description: string, lugar: string }[] = [];

  noActivitiesCreatedByUser: boolean = false;
  noActivitiesParticipant: boolean = false;
  reuniones: Reunion[] = [];
  /* reuniones: Reunion[] = [
    {
      motivo: 'Reunión Avance de Trabajo',
      ubicacion: 'Telemática',
      comentarios: 'Revisar progreso del informe',
      estado: 'Coordinacion',
      fechas: [new Date(2024, 5, 13, 12, 30)], // Cambiado a un arreglo de fechas
      participantes: [
        { nombre: 'Pedro', telefono: '123456789' },
        { nombre: 'Alfonso', telefono: '987654321' }
      ],
      createdByUser: true
    },
    {
      motivo: 'Reunión Proyecto de Título',
      ubicacion: 'Universidad del Bío-Bío',
      comentarios: 'revisar el progreso de la aplicación',
      estado: 'Programada', // Corregido el estado
      fechas: [new Date(2024, 5, 21, 12)], // Cambiado a un arreglo de fechas
      participantes: [
        { nombre: 'Pedro', telefono: '123456789' },
        { nombre: 'Alfonso', telefono: '987654321' }
      ],
      createdByUser: true
    }
  ]; */
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
  checkNoActivities() {
    console.log("Reuniones:", this.reuniones);
    
    // Asegúrate de que `authService.getCurrentUserId()` devuelva el ID del usuario actual
    const currentUserId = this.authService.getCurrentUserId();
  
    this.noActivitiesCreatedByUser = this.reuniones
      .filter(reunion => {
        const isValid = this.isValidReunion(reunion);
        return reunion.created_by === currentUserId && isValid;
      })
      .length === 0;
  
    this.noActivitiesParticipant = this.reuniones
      .filter(reunion => {
        const isValid = this.isValidReunion(reunion);
        return reunion.created_by !== currentUserId && isValid;
      })
      .length === 0;
  }

  isValidReunion(reunion: Reunion): boolean {
    return (reunion!=null);
    //return reunion.motivo !== undefined && reunion.comentarios !== undefined && reunion.estado !== undefined && reunion.fecha !== undefined && reunion.participantes.length >= 0;
}


  constructor(private router: Router, private reunionesService: ReunionesService,private authService: AuthService) {}

  ngOnInit() {
    this.loadReuniones();
    /* // Obtener los datos de la reunión enviados desde el DatePickerComponent
    const reunion: Reunion = history.state.reunion;

    // Añadir la reunión a las actividades creadas por el usuario si es válida
    if (this.isValidReunion(reunion)) {
      this.reuniones.push(reunion);
    }

    this.generateUpcomingActivityDates();
    this.generateUserCreatedActivities();
    this.generateParticipantActivities();
    this.checkNoActivities(); */
  }

  async loadReuniones() {
  try {
    this.reuniones = await this.reunionesService.obtenerReuniones();
    const currentUserId = this.authService.getCurrentUserId();

    this.noActivitiesCreatedByUser = !this.reuniones.some(r => r.created_by === currentUserId);
    this.noActivitiesParticipant = !this.reuniones.some(r => r.created_by !== currentUserId);
  } catch (error) {
    console.error('Error loading reuniones:', error);
  }
}
  

  verParticipantes(reunion: Reunion) {
    // Navegar a la página de participantes y pasar la reunión seleccionada como estado
    this.router.navigate(['/participantes'], { state: { reunion } });
  }
  verDetalles(reunion: Reunion) {
    // Navegar a la página de estado-reunion y pasar solo la ID de la reunión como estado
    this.router.navigate(['/estado-reunion'], { state: { reunionId: reunion.id } });
  }

  generateUpcomingActivityDates() {
    const today = new Date();
    this.upcomingActivityDates.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    this.upcomingActivityDates.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3));
    this.upcomingActivityDates.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7));
    this.upcomingActivityDates.push(new Date(today.getFullYear(), today.getMonth() + 1, 15));
  }

  generateUserCreatedActivities() {
    // Generar las actividades creadas por el usuario
    this.userCreatedActivities = this.upcomingActivityDates.map(date => ({
      date: date,
      description: "Reunión proyecto de título (creada por el usuario)",
      lugar: "Universidad del Bío-Bío Campus Fernando May"
    }));
  }

  generateParticipantActivities() {
    // Generar las actividades en las que el usuario participa
    // Por ahora, simplemente copiamos las actividades creadas por el usuario como ejemplo
    this.participantActivities = this.userCreatedActivities.slice();
  }

  /* formatDate(dates: any): string[] {
  
    if (Array.isArray(dates) && dates.length === 1 && Array.isArray(dates[0])) {
      dates = dates[0]; // Desanidar el arreglo si es necesario
    }
  
    if (!Array.isArray(dates)) {
      throw new Error('El argumento dates debe ser un array.');
    }
  
    if (dates.length === 3) {
      // Handle case with exactly 3 dates
      const dayDate = this.formatDayDate(dates[0]);
      const startTime = this.formatTime(dates[1]);
      const endTime = this.formatTime(dates[2]);
  
  
      return [`${dayDate}`, `${startTime} - ${endTime}`]; // Devuelve un array de strings
    } else {
      // Handle other array cases
      return dates.map(date => {
        if (Array.isArray(date)) {
          // Handle nested arrays, assuming they contain valid dates
          return date.map(subDate => this.formatSingleDate(subDate)).join(', ');
        } else {
          return this.formatSingleDate(date);
        }
      });
    }
  } */
    formatDate(fechas_reunion: FechaReunion[]): string[] {
      return fechas_reunion.map(fecha => {
        const fechaObj = new Date(fecha.fecha);
        const horaInicio = new Date(`1970-01-01T${fecha.hora_inicio}`);
        const horaFin = new Date(`1970-01-01T${fecha.hora_fin}`);
        return `${fechaObj.toLocaleDateString()} ${horaInicio.toLocaleTimeString()} - ${horaFin.toLocaleTimeString()}`;
      });
    }
  
  
  formatSingleDate(date: string | Date): string {

  
    let dateObject: Date;
  
    if (typeof date === 'string') {
      dateObject = new Date(date); // Attempt to convert string to Date object
    } else if (date instanceof Date) {
      dateObject = date; // If already a Date object, use it directly
    } else {
      throw new Error('Fecha inválida: se esperaba una cadena o un objeto Date.');
    }
  

  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
  
    return dateObject.toLocaleDateString('es-ES', options);
  }
  
  formatDayDate(date: string | Date): string {
  
    let dateObject: Date;
  
    if (typeof date === 'string') {
      dateObject = new Date(date); // Attempt to convert string to Date object
    } else if (date instanceof Date) {
      dateObject = date; // If already a Date object, use it directly
    } else {
      throw new Error('Fecha inválida: se esperaba una cadena o un objeto Date.');
    }
  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
  
    return dateObject.toLocaleDateString('es-ES', options);
  }
  
  formatTime(date: string | Date): string {
  
    let dateObject: Date;
  
    if (typeof date === 'string') {
      dateObject = new Date(date); // Attempt to convert string to Date object
    } else if (date instanceof Date) {
      dateObject = date; // If already a Date object, use it directly
    } else {
      throw new Error('Fecha inválida: se esperaba una cadena o un objeto Date.');
    }
  
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
  
    return dateObject.toLocaleTimeString('es-ES', options);
  }
  

  

}
