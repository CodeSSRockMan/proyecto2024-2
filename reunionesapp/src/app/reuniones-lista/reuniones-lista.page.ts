import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fechas: any[]; // Se mantiene igual, asumiendo que ya contiene la información de fecha y hora
  participantes: Participante[];
  createdByUser: boolean;
  ubicacion?: string; // Ubicación de la reunión (opcional)
  tipo?: string; // Tipo de reunión (opcional)
}

export interface Participante {
  nombre: string;
  telefono: string;
  fechasElegidas?: boolean;
}

@Component({
  selector: 'app-reuniones-lista',
  templateUrl: './reuniones-lista.page.html',
  styleUrls: ['./reuniones-lista.page.scss'],
})
export class ReunionesListaPage implements OnInit {
  reuniones: Reunion[] = [];
  reunionesFiltradas: Reunion[] = [];
  mostrarFinalizadas = false;

  constructor(private router: Router) {}

  ngOnInit() {
    
    this.obtenerReuniones(); // Obtener las reuniones al iniciar el componente
  }

  obtenerReuniones() {
    this.reuniones = [
      {
        motivo: 'Reunión Avance de Trabajo',
        ubicacion: 'Telemática',
        comentarios: 'Revisar progreso del informe',
        estado: 'Coordinacion',
        fechas: [new Date(2024, 5, 13, 12, 30)], // Cambiado a un arreglo de fechas
        participantes: [
          { nombre: 'Pedro', telefono: '123456789' },
          { nombre: 'Alfonso', telefono: '987654321' },
        ],
        createdByUser: true,
      },
      {
        motivo: 'Reunión Proyecto de Título',
        ubicacion: 'Universidad del Bío-Bío',
        comentarios: 'revisar el progreso de la aplicación',
        estado: 'Programada', // Corregido el estado
        fechas: [new Date(2024, 5, 21, 12)], // Cambiado a un arreglo de fechas
        participantes: [
          { nombre: 'Pedro', telefono: '123456789' },
          { nombre: 'Alfonso', telefono: '987654321' },
        ],
        createdByUser: true,
      },
      {
        motivo: 'Reunión Finalizada Ejemplo',
        ubicacion: 'Oficina',
        comentarios: 'Ejemplo de reunión finalizada',
        estado: 'Finalizada',
        fechas: [new Date(2024, 5, 25, 10, 0)],
        participantes: [
          { nombre: 'Laura', telefono: '555555555' },
          { nombre: 'Carlos', telefono: '666666666' },
        ],
        createdByUser: true,
      },
    ];

    this.reunionesFiltradas = this.ordenarReuniones(this.reuniones); // Inicializar reunionesFiltradas con todas las reuniones
  }

  ordenarReuniones(reuniones: Reunion[]): Reunion[] {
    const ordenEstado = ['planificacion', 'coordinacion', 'programada', 'finalizada'];
    return reuniones.sort((a, b) => ordenEstado.indexOf(a.estado.toLowerCase()) - ordenEstado.indexOf(b.estado.toLowerCase()));
  }

  buscarReuniones(event: any) {
    const termino = event.target.value.toLowerCase();
    this.reunionesFiltradas = this.reuniones.filter(
      (reunion) =>
        reunion.motivo.toLowerCase().includes(termino) ||
        reunion.comentarios.toLowerCase().includes(termino) ||
        reunion.estado.toLowerCase().includes(termino)
    );
  }

  toggleMostrarFinalizadas() {
    this.mostrarFinalizadas = !this.mostrarFinalizadas;
    if (this.mostrarFinalizadas) {
      this.reunionesFiltradas = this.ordenarReuniones(this.reuniones);
    } else {
      this.reunionesFiltradas = this.ordenarReuniones(this.reuniones).filter(
        (reunion) => reunion.estado.toLowerCase() !== 'finalizada'
      );
    }
  }

  verDetalles(reunion: Reunion) {
    console.log('Reunión seleccionada:', reunion);
    this.router.navigate(['/estado-reunion', { reunion: JSON.stringify(reunion) }]);
  }
}
