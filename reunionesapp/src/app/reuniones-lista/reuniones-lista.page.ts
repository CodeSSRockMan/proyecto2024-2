import { Component, OnInit } from '@angular/core';

export interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fecha: string;
  participantes: Participante[];
}

export interface Participante {
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-reuniones-lista',
  templateUrl: './reuniones-lista.page.html',
  styleUrls: ['./reuniones-lista.page.scss'],
})
export class ReunionesListaPage implements OnInit {
  

  reuniones: Reunion[] = [];
  reunionesFiltradas: Reunion[] = [];

  constructor() { }

  ngOnInit() {
    this.obtenerReuniones(); // Obtener las reuniones al iniciar el componente
  }

  obtenerReuniones() {
    const fechaActivacion = '2024-04-20';
    this.reuniones = [
      { motivo: 'Reunión de planificación', comentarios: 'Planificando actividad - Poner las fechas disponibles y añadir participantes', estado: 'planificacion', fecha: '', participantes: [] },
      { motivo: 'Reunión de coordinación', comentarios: 'Seleccionando fechas - Los participantes eligen las fechas disponibles', estado: 'coordinacion', fecha: '', participantes: [] },
      { motivo: 'Reunión activa', comentarios: 'Reunión coordinada - Se espera que se realice', estado: 'activa', fecha: fechaActivacion, participantes: [{ nombre: 'Juan', correo: 'juan@example.com' }, { nombre: 'María', correo: 'maria@example.com' }] },
      { motivo: 'Reunión finalizada', comentarios: 'Reunión terminada - La reunión ha finalizado', estado: 'finalizada', fecha: fechaActivacion, participantes: [{ nombre: 'Pedro', correo: 'pedro@example.com' }, { nombre: 'Ana', correo: 'ana@example.com' }] }
    ];
    
    
    this.reunionesFiltradas = this.reuniones; // Inicializar reunionesFiltradas con todas las reuniones
  }

  buscarReuniones(event: any) {
    const termino = event.target.value.toLowerCase();
    this.reunionesFiltradas = this.reuniones.filter(reunion =>
      reunion.motivo.toLowerCase().includes(termino) ||
      reunion.comentarios.toLowerCase().includes(termino) ||
      reunion.estado.toLowerCase().includes(termino) ||
      reunion.fecha.toLowerCase().includes(termino)
    );
  }
  
  verDetalles(reunion: any) {
    console.log('Detalles de la reunión:', reunion);
    // Aquí puedes redirigir a una página de detalles de reunión o mostrar más información en un modal, por ejemplo.
  }
  
}
