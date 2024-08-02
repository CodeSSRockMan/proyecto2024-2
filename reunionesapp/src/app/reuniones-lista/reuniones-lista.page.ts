import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReunionesService, Reunion, Participante } from '../services/reuniones.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reuniones-lista',
  templateUrl: './reuniones-lista.page.html',
  styleUrls: ['./reuniones-lista.page.scss'],
})
export class ReunionesListaPage implements OnInit {
  reuniones: Reunion[] = [];
  reunionesFiltradas: Reunion[] = [];
  mostrarFinalizadas = false;
  filtroActual: string = 'todas';
  usuarioActualId: string = "";

  constructor(private router: Router, private reunionesService: ReunionesService, private authService: AuthService) {}

  async ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.usuarioActualId = user.id;
        console.log('User ID in date-picker component:', this.usuarioActualId);
      } else {
        console.log('User ID not found');
      }
    });

    try {
      this.reuniones = await this.reunionesService.obtenerReuniones();
      this.reunionesFiltradas = this.ordenarReuniones(this.reuniones);
    } catch (error) {
      console.error('Error al obtener reuniones:', error);
    }
  }

  ordenarReuniones(reuniones: Reunion[]): Reunion[] {
    const ordenEstado = ['planificacion', 'coordinacion', 'activa', 'finalizada'];
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

  setFiltro(filtro: string) {
    this.filtroActual = filtro;
    this.filtrarReuniones();
  }

  filtrarReuniones() {
    switch (this.filtroActual) {
      case 'coordinacion':
        this.reunionesFiltradas = this.reuniones.filter(reunion => this.esCoordinacion(reunion));
        break;
      case 'mias':
        this.reunionesFiltradas = this.reuniones.filter(reunion => this.esMia(reunion));
        break;
      case 'activas':
        this.reunionesFiltradas = this.reuniones.filter(reunion => reunion.estado.toLowerCase() === 'activa');
        break;
      default:
        this.reunionesFiltradas = this.reuniones;
        break;
    }
  }

  esCoordinacion(reunion: Reunion) {
    return reunion.estado.toLowerCase() === 'coordinacion' && this.esParticipante(reunion);
  }

  esMia(reunion: Reunion) {
    return reunion.created_by === this.usuarioActualId;
  }

  esParticipante(reunion: Reunion) {
    return reunion.participantes.some(participante => participante.usuario_id === this.usuarioActualId);
  }



  tieneFechasSeleccionadas(reunion: Reunion): boolean {
    if (!reunion) throw Error;
    const esCreador:boolean=reunion.created_by==this.authService.getCurrentUserId();
    if(esCreador)return false;
    const participante = reunion.participantes.find(p => p.usuario_id === this.usuarioActualId);
    return !!(participante &&participante.fechasSeleccionadas && participante.fechasSeleccionadas.length > 0);
  }

  contarReuniones(filtro: string) {
    switch (filtro) {
      case 'coordinacion':
        return this.reuniones.filter(reunion => this.esCoordinacion(reunion)).length;
      case 'mias':
        return this.reuniones.filter(reunion => this.esMia(reunion)).length;
      case 'activas':
        return this.reuniones.filter(reunion => reunion.estado.toLowerCase() === 'activa').length;
      default:
        return this.reuniones.length;
    }
  }

  toggleMostrarFinalizadas() {
    this.mostrarFinalizadas = !this.mostrarFinalizadas;
    this.filtrarReuniones();
  }

  verDetalles(reunion: Reunion) {
    if (this.verificarParticipacion(reunion) && !this.tieneFechasSeleccionadas(reunion)) {
      this.router.navigate(['/select-date'], { state: { reunionId: reunion.id } });
    } else {
      this.router.navigate(['/estado-reunion'], { state: { reunionId: reunion.id } });
    }
  }

  verificarParticipacion(reunion: Reunion): boolean {
    return reunion.estado.toLowerCase() === 'coordinacion' && this.esParticipante(reunion) && this.tieneFechasSeleccionadas(reunion);
  }
}
