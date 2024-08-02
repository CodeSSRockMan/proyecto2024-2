import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ReunionesService, Reunion, Participante, FechaReunion } from '../services/reuniones.service';
import { Clipboard } from '@capacitor/clipboard';

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
  fechaSeleccionada: FechaReunion | null = null;
  reunion: Reunion | null = null;
  code: string = '';
  fechitas: FechaReunion[] = [];
  participantesPorFecha: { [key: number]: Participante[] } = {};
  mostrarTodas: boolean = true;
  participantes: Participante[] = [];
  estadosReunion: string[] = ['planificacion', 'coordinacion', 'activa', 'terminada'];
  participantesQueVotaronCache: { [fechaId: number]: Participante[] } = {};

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private reunionesService: ReunionesService
  ) {}

  onFechaSeleccionada(fecha: FechaReunion) {
    this.fechaSeleccionada = fecha;
  }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { reunionId: number };
  
    if (state?.reunionId) {
      await this.obtenerReunionDetalles(state.reunionId);
      await this.cargarFechitas(state.reunionId);
      // Precalcular la longitud de los participantes que votaron
      for (const fecha of this.fechitas) {

        this.participantesQueVotaronCache[fecha.id] = await this.obtenerParticipantesQueVotaron(fecha.id);
      }
    }
  }

  async obtenerParticipantesQueVotaron(fechaId: number): Promise<Participante[]> {
    try {
      const participantes = await this.reunionesService.obtenerParticipantesQueVotaron(fechaId);
      console.log(participantes);
      this.participantesPorFecha[fechaId] = participantes;
      return participantes;
    } catch (error) {
      console.error('Error al obtener los participantes que votaron:', error);
      return []; // Retorna una lista vacía en caso de error
    }
  }

  participantesQueVotaron(fechaId: number): Participante[] {
    return this.participantesQueVotaronCache[fechaId] || [];
  }

  async cargarParticipantesPorFechas() {
    for (const fecha of this.fechitas) {
      await this.participantesQueVotaron(fecha.id);
    }
  }
   // Método para obtener la longitud de los participantes que votaron
   async participantesQueVotaronLength(fechaId: number): Promise<number> {
    const participantes = await this.participantesQueVotaron(fechaId);
    return participantes.length;
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



  getParticipantes(fechaId: number): Participante[] {
    return this.participantesPorFecha[fechaId] || [];
  }

  async cargarFechitas(reunionId: number) {
    try {
      this.fechitas = await this.reunionesService.obtenerFechasTentativasPorIdReunion(reunionId);
    } catch (error) {
      console.error('Error al cargar las fechas tentativas:', error);
    }
  }

  async obtenerReunionDetalles(id: number) {
    try {
      this.reunion = await this.reunionesService.obtenerReunionPorId(id);
      if (this.reunion) {
        this.code = this.reunion.codigo_invitacion || '';
        await this.procesarReunion(this.reunion); // Asegurar que se procese la reunión correctamente
      } else {
        console.error('No se encontró la reunión con el ID proporcionado.');
      }
    } catch (error) {
      console.error('Error al obtener la reunión:', error);
    }
  }

  async generateInvitationCode() {
    if (!this.reunion) {
      console.error('No hay una reunión definida para generar el código.');
      return;
    }

    let isUnique = false;

    while (!isUnique) {
      // Generar un código de invitación aleatorio
      this.code = Math.random().toString(36).substring(2, 10).toUpperCase();
      isUnique = await this.reunionesService.isInvitationCodeUnique(this.code);
    }

    this.reunion.codigo_invitacion = this.code;

    // Guardar la reunión actualizada con el nuevo código
    try {
      await this.reunionesService.updateReunionCode(this.reunion.id, this.code);
      this.showToast('Código de invitación generado');
    } catch (error) {
      console.error('Error al generar el código de invitación:', error);
      this.showToast('Error al generar el código de invitación');
    }
  }

  async copyToClipboard(code: string) {
    await Clipboard.write({
      string: code
    });
    this.showToast('Código de invitación copiado');
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 4);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      timeZone: 'America/Santiago'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  formatTime(timeString: string): string {
    const date = new Date(`1970-01-01T${timeString}Z`);
    date.setHours(date.getHours() + 3);
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'America/Santiago'
    };
    return date.toLocaleTimeString('es-ES', options);
  }

  confirmarDetalles() {
    if (!this.reunion) {
      console.error('No hay una reunión definida para confirmar los detalles.');
      return;
    }

    console.log('Detalles confirmados');
    this.reunion.estado = 'coordinacion';
    this.actualizarEstadoReunion();
  }

  isValidToConfirm(): boolean {
    if (!this.reunion) {
      return false;
    }
    const tieneSuficientesParticipantes = this.reunion.estado === 'planificacion'
      ? true
      : this.confirmadosConFechas.length >= 2;
    return tieneSuficientesParticipantes;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'planificacion':
        return this.isPlanificacionCumplida() ? 'success' : 'medium';
      case 'coordinacion':
        return this.isCoordinacionCumplida() ? 'success' : 'medium';
      case 'activa':
        return this.isActivaCumplida() ? 'success' : 'medium';
      case 'terminada':
        return this.isTerminadaCumplida() ? 'success' : 'medium';
      default:
        return 'medium';
    }
  }

  isPlanificacionCumplida(): boolean {
    return this.reunion?.estado === 'planificacion' || this.reunion?.estado === 'coordinacion' || this.reunion?.estado === 'activa' || this.reunion?.estado === 'terminada';
  }

  isCoordinacionCumplida(): boolean {
    return this.reunion?.estado === 'coordinacion' || this.reunion?.estado === 'activa' || this.reunion?.estado === 'terminada';
  }

  isActivaCumplida(): boolean {
    return this.reunion?.estado === 'activa' || this.reunion?.estado === 'terminada';
  }

  isTerminadaCumplida(): boolean {
    return this.reunion?.estado === 'terminada';
  }

  async procesarReunion(reunion: Reunion) {
    if (!reunion || !reunion.participantes) {
      console.error('Reunión o participantes no definidos');
      return;
    }

    this.totalParticipantes = reunion.participantes.length;

    try {
      this.fechitas = await this.reunionesService.obtenerFechasTentativasPorIdReunion(reunion.id);
      this.fechasSeleccionadas = reunion.fechas_reunion.map(fecha => new Date(fecha.fecha));
      console.log(this.fechasSeleccionadas);
    } catch (error) {
      console.error('Error processing meeting:', error);
    }
  }

  seleccionarFechaDefinitiva() {
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    if (this.reunion) {
      this.reunion.estado = 'activa'; 
      this.actualizarEstadoReunion();
    }
  }

  async actualizarEstadoReunion() {
    try {
      await this.reunionesService.actualizarEstadoReunion(this.reunion?.id || 0, this.reunion?.estado || '');
      this.showToast('Estado de la reunión actualizado');
    } catch (error) {
      console.error('Error al actualizar el estado de la reunión:', error);
      this.showToast('Error al actualizar el estado de la reunión');
    }
  }
}
