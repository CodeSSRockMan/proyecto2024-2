import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionesService } from '../services/reuniones.service';
import { Reunion, FechaReunion, Participante } from '../services/reuniones.service';

@Component({
  selector: 'app-reuniones-lista',
  templateUrl: './reuniones-lista.page.html',
  styleUrls: ['./reuniones-lista.page.scss'],
})
export class ReunionesListaPage implements OnInit {
  reuniones: Reunion[] = [];
  reunionesFiltradas: Reunion[] = [];
  mostrarFinalizadas = false;

  constructor(private router: Router,private reunionesService: ReunionesService) {}

  async ngOnInit() {
    try {
      this.reuniones = await this.reunionesService.obtenerReuniones();
      this.reunionesFiltradas = this.ordenarReuniones(this.reuniones); // Inicializar reunionesFiltradas con todas las reuniones
    } catch (error) {
      console.error('Error al obtener reuniones:', error);
    }
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
    // Navegar a la página de estado-reunion y pasar solo la ID de la reunión como estado
    this.router.navigate(['/estado-reunion'], { state: { reunionId: reunion.id } });
  }
}
