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
  fechaSeleccionada: Date = new Date();
  reunion: Reunion | null = null;
  code: string = '';

  mostrarTodas: boolean = true;
  participantes: Participante[] = [];
  estadosReunion: string[] = ['planificacion', 'coordinacion', 'activa', 'terminada'];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private reunionesService: ReunionesService
  ) {}

  ngOnInit() {
    // Recuperar la ID de la reunión desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { reunionId: number };

    if (state?.reunionId) {
      this.obtenerReunionDetalles(state.reunionId);
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

  async obtenerReunionDetalles(id: number) {
    try {
      this.reunion = await this.reunionesService.obtenerReunionPorId(id);
      if (this.reunion) {
        this.code = this.reunion.codigo_invitacion || '';
        this.procesarReunion(this.reunion);
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

// Método para formatear la fecha en la zona horaria local
// Método para formatear la fecha en la zona horaria local
// Método para formatear la fecha en la zona horaria local
formatDate(dateString: string): string {
  // Asegúrate de que dateString esté en formato ISO y en UTC
  const date = new Date(dateString);

  date.setHours(date.getHours() + 4);

  // Opciones para mostrar la fecha en formato largo
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    timeZone: 'America/Santiago' // Ajusta la zona horaria según sea necesario
  };

  // Convertir a fecha local en la zona horaria deseada
  return date.toLocaleDateString('es-ES', options);
}

// Método para formatear la hora en la zona horaria local
formatTime(timeString: string): string {
  // Asegúrate de que timeString esté en formato adecuado y en UTC
  // Agregar fecha base para la hora
  const date = new Date(`1970-01-01T${timeString}Z`);

  date.setHours(date.getHours() + 3);

  // Opciones para mostrar la hora en formato de 24 horas
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'America/Santiago' // Ajusta la zona horaria según sea necesario
  };

  // Convertir a hora local en la zona horaria deseada
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
      return false; // Si no hay reunión, no se puede confirmar
    }
  
    // Verifica que haya al menos dos participantes confirmados solo si la reunión no está en planificación
    const tieneSuficientesParticipantes = this.reunion.estado === 'planificacion'
      ? true // En planificación, no es necesario verificar participantes confirmados
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

  procesarReunion(reunion: Reunion) {
    if (!reunion || !reunion.participantes) {
      console.error('Reunión o participantes no definidos');
      return;
    }

    // Actualizar totalParticipantes
    this.totalParticipantes = reunion.participantes.length;

    // Procesar participantes confirmados con y sin fechas
    this.confirmadosConFechas = reunion.participantes.filter(participante =>
      participante.confirmado && participante.fechasSeleccionadas && participante.fechasSeleccionadas.length > 0
    );

    this.confirmadosSinOpcion = reunion.participantes.filter(participante =>
      participante.confirmado && (!participante.fechasSeleccionadas || participante.fechasSeleccionadas.length === 0)
    );

    this.sinConfirmar = reunion.participantes.filter(participante => !participante.confirmado);

    // Actualizar fechasSeleccionadas
    this.fechasSeleccionadas = reunion.fechas_reunion.map(fecha => new Date(fecha.fecha));
    console.log('Fechas seleccionadas:', this.fechasSeleccionadas);
  }

  participantesPorFecha(fecha: Date): Participante[] {
    const participantes = this.confirmadosConFechas.filter(participante =>
      participante.fechasSeleccionadas?.some(f => new Date(f.fecha).getTime() === fecha.getTime())
    );
    console.log(`Participantes para la fecha ${fecha}:`, participantes);
    return participantes;
  }

  seleccionarFechaDefinitiva() {
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    if (this.reunion) {
      this.reunion.estado = 'activa'; 
      this.actualizarEstadoReunion();
    }
  }
  
  async actualizarEstadoReunion() {
    if (this.reunion) {
      try {
        await this.reunionesService.actualizarEstadoReunion(this.reunion.id, this.reunion.estado);
        this.showToast('Estado de la reunión actualizado a "activa"');
        console.log('Estado de la reunión actualizado a:', this.reunion.estado);
      } catch (error) {
        console.error('Error al actualizar el estado de la reunión:', error);
        this.showToast('Error al actualizar el estado de la reunión');
      }
    }
  }
}
