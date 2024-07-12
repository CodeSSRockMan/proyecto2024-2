import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fechas: Date[]; // Se mantiene igual, asumiendo que ya contiene la información de fecha y hora
  participantes: Participante[];
  createdByUser: boolean;
  ubicacion?: string; // Ubicación de la reunión (opcional)
  tipo?: string; // Tipo de reunión (opcional)
}

interface Participante {
  nombre: string;
  telefono: string;
}

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
  reuniones: Reunion[] = [
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
  ];
  checkNoActivities() {
    console.log("Reuniones:", this.reuniones);
    
    this.noActivitiesCreatedByUser = this.reuniones
      .filter(reunion => {
        const isValid = this.isValidReunion(reunion);
        console.log("Reunión creada por usuario:", reunion.createdByUser, " - Válida:", isValid);
        return reunion.createdByUser && isValid;
      })
      .length === 0;
  
    this.noActivitiesParticipant = this.reuniones
      .filter(reunion => {
        const isValid = this.isValidReunion(reunion);
        console.log("Reunión en la que participa:", !reunion.createdByUser, " - Válida:", isValid);
        return !reunion.createdByUser && isValid;
      })
      .length === 0;
  
    console.log("No activities created by user:", this.noActivitiesCreatedByUser);
    console.log("No activities participant:", this.noActivitiesParticipant);
  }

  isValidReunion(reunion: Reunion): boolean {
    return (reunion!=null);
    //return reunion.motivo !== undefined && reunion.comentarios !== undefined && reunion.estado !== undefined && reunion.fecha !== undefined && reunion.participantes.length >= 0;
}


  constructor(private router: Router) {}

  ngOnInit() {
    // Obtener los datos de la reunión enviados desde el DatePickerComponent
    const reunion: Reunion = history.state.reunion;
    console.log('Reunión recibida:', reunion);

    // Añadir la reunión a las actividades creadas por el usuario si es válida
    if (this.isValidReunion(reunion)) {
      this.reuniones.push(reunion);
    }

    this.generateUpcomingActivityDates();
    this.generateUserCreatedActivities();
    this.generateParticipantActivities();
    this.checkNoActivities();
  }

  verParticipantes(reunion: Reunion) {
    // Navegar a la página de participantes y pasar la reunión seleccionada como estado
    this.router.navigate(['/participantes'], { state: { reunion } });
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

  formatDate(dates: Date[] | string | any[]): string {
    console.log('Entrando en formatDate con:', dates);
  
    if (Array.isArray(dates)) {
      const formattedDates = dates.map(date => {
        if (Array.isArray(date)) {
          // Handle nested arrays, assuming they contain valid dates
          return date.map(subDate => this.formatSingleDate(subDate)).join(', ');
        } else {
          return this.formatSingleDate(date);
        }
      });
  
      console.log('Fechas formateadas:', formattedDates);
      return formattedDates.join(', ');
    } else {
      // Handle single date or string case
      return this.formatSingleDate(dates);
    }
  }
  
  formatSingleDate(date: string | Date): string {
    console.log('Entrando en formatSingleDate con:', date);
  
    let dateObject: Date;
  
    if (typeof date === 'string') {
      dateObject = new Date(date); // Attempt to convert string to Date object
    } else if (date instanceof Date) {
      dateObject = date; // If already a Date object, use it directly
    } else {
      throw new Error('Fecha inválida: se esperaba una cadena o un objeto Date.');
    }
  
    console.log('Fecha convertida a objeto Date:', dateObject);
  
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
  
  

  

}
