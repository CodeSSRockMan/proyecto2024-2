import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

export interface Participante {
  nombre: string;
  telefono: string;
  confirmado?: boolean;
  fechasSeleccionadas?: { inicio: Date, fin: Date }[];
}

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fechas: Date[]; // Convertir las fechas a objetos Date
  participantes: Participante[];
  createdByUser: boolean;
  ubicacion?: string; // Ubicación de la reunión (opcional)
  tipo?: string; // Tipo de reunión (opcional)
}

@Component({
  selector: 'app-estado-reunion',
  templateUrl: './estado-reunion.page.html',
  styleUrls: ['./estado-reunion.page.scss'],
})
export class EstadoReunionPage implements OnInit {
  totalParticipantes: number = 0;
  confirmadosConFechas: Participante[] = [];
  confirmadosSinOpcion: Participante[] = [];
  sinConfirmar: Participante[] = [];
  fechasSeleccionadas: Date[] = [];
  fechaSeleccionada: Date = new Date();
  reunion: Reunion = { motivo: '', comentarios: '', estado: '', fechas: [], participantes: [], createdByUser: false };

  mostrarTodas: boolean = true;
  participantes: Participante[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['reunion']) {
        const reunionJson = params['reunion'];
        console.log('Reunión JSON recibido:', reunionJson); // Log para verificar el JSON recibido

        const reunionObject = JSON.parse(reunionJson);
        console.log('Reunión objeto antes de convertir fechas:', reunionObject); // Log para verificar el objeto antes de convertir fechas

        // Convertir fechas a objetos Date
        reunionObject.fechas = reunionObject.fechas.map((fecha: string) => new Date(fecha));
        console.log('Reunión objeto después de convertir fechas:', reunionObject); // Log para verificar el objeto después de convertir fechas

        this.reunion = reunionObject as Reunion;
        this.procesarReunion(this.reunion);
      } else {
        console.error('No se encontró la reunión en los parámetros de la ruta.');
        this.reunion = {
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
        };
        this.procesarReunion(this.reunion);
      }
    });
  }

  procesarReunion(reunion: Reunion) {
    if (!reunion || !reunion.participantes) {
      console.error('Reunión o participantes no definidos');
      return;
    }

    const data: Participante[] = reunion.participantes;
    console.log('Datos de participantes:', data); // Log para verificar los datos de participantes

    this.totalParticipantes = data.length;

    this.confirmadosConFechas = data.filter(participante =>
      participante.confirmado && participante.fechasSeleccionadas && participante.fechasSeleccionadas.length > 0
    );

    this.confirmadosSinOpcion = data.filter(participante =>
      participante.confirmado && (!participante.fechasSeleccionadas || participante.fechasSeleccionadas.length === 0)
    );

    this.sinConfirmar = data.filter(participante => !participante.confirmado);

    // Asegurar que todas las fechas de la reunión estén en fechasSeleccionadas
    this.fechasSeleccionadas = reunion.fechas.map(fecha => new Date(fecha));

    console.log('Fechas seleccionadas:', this.fechasSeleccionadas); // Log para verificar las fechas seleccionadas
  }

  participantesPorFecha(fecha: Date): Participante[] {
    const participantes = this.confirmadosConFechas.filter(participante =>
      participante.fechasSeleccionadas?.some(f => f.inicio.getTime() === fecha.getTime())
    );
    console.log(`Participantes para la fecha ${fecha}:`, participantes); // Log para verificar los participantes por fecha
    return participantes;
  }

  seleccionarFechaDefinitiva() {
    console.log('Fecha seleccionada:', this.fechaSeleccionada); // Log para verificar la fecha seleccionada
  }
}
