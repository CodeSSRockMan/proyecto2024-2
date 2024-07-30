import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ReunionesService, FechaReunion, Reunion, Participante } from '../services/reuniones.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.page.html',
  styleUrls: ['./participantes.page.scss'],
})
export class ParticipantesPage implements OnInit, AfterViewInit {
  reunion: Reunion | null = null;
  editando: boolean[] = []; // Arreglo para manejar el estado de edición por índice
  participantes: Participante[] = [];
  mostrarMensajeInstrucciones: boolean = true;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private reunionesService: ReunionesService,
    private authService:AuthService
  ) {}

  ngOnInit() {
    // Recuperar la ID de la reunión desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { reunionId: number };
  
    if (state?.reunionId) {
      this.loadReunionData(state.reunionId);
    }
  }
  async loadReunionData(reunionId: number) {
    try {
      this.reunion = await this.reunionesService.obtenerReunionPorId(reunionId);
      if (this.reunion) {
        this.participantes = this.reunion.participantes || [];
        this.editando = this.participantes.map(() => false); // Inicializa el arreglo con `false`
        console.log('Reunión:', this.reunion);
        console.log('Participantes:', this.participantes);
        this.cdr.detectChanges(); // Detecta los cambios para actualizar la vista
      } else {
        console.error('La reunión no fue encontrada.');
      }
    } catch (error) {
      console.error('Error fetching reunion:', error);
    }
  }

  cerrarMensaje() {
    this.mostrarMensajeInstrucciones = false;
  }

  ngAfterViewInit() {
    //this.detectOverflowAndAnimate();
  }

  isCurrentUser(usuarioId: string): boolean {
    return usuarioId === this.authService.getCurrentUserId();
  }

  getCurrentUserId(): string {
    return this.authService.getCurrentUserId();
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom'
    });
    toast.present();
  }

  llamar(telefono: string) {
    window.open('tel:' + telefono);
  }

  enviarWhatsapp(telefono: string) {
    window.open('https://wa.me/' + telefono);
  }

  editarParticipante(index: number) {
    this.editando[index] = true;
  }

  async confirmarEdicion(index: number) {
    const participante = this.participantes[index];
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.cancelarEdicion(index);
          }
        },
        {
          text: 'Guardar',
          handler: () => {
            this.guardarCambios(index);
          }
        }
      ]
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  async guardarCambios(index: number) {
    const participante = this.participantes[index];
    if (this.isParticipanteValido(participante)) {
      await this.presentToast('Cambios guardados exitosamente.');
      this.editando[index] = false;
    } else {
      await this.presentToast('Por favor, corrige los errores en el formulario.');
    }
  }

  isParticipanteValido(participante: Participante): boolean {
    // Implementa la lógica para validar el participante
    return true; // Cambia esta línea según la lógica de validación
  }

  cancelarEdicion(index: number) {
    this.editando[index] = false;
    // Restaura los valores originales en caso de cancelación si es necesario
  }

  async confirmarEliminacion(index: number) {
    const participante = this.participantes[index];
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar a este participante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarParticipante(index);
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarParticipante(index: number) {
    if (index !== -1) {
      this.participantes.splice(index, 1);
      this.editando.splice(index, 1); // Elimina el estado de edición correspondiente
      await this.presentToast('Participante eliminado exitosamente.');
    }
  }

  agregarParticipante() {
    this.router.navigate(['/agregar-participante-manual'], { state: { reunion: this.reunion } });
  }

  toggleEdicion(index: number) {
    this.editando[index] = !this.editando[index];
    this.detectOverflowAndAnimate();
  }

  onScroll(event: any) {
    const scrollDirection = event.detail.deltaX > 0 ? 'right' : 'left';
    // Agrega lógica de scroll si es necesario
  }

  detectOverflowAndAnimate(): void {
    const elements = document.querySelectorAll('.card-title');
    elements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.offsetWidth < htmlElement.scrollWidth) {
        htmlElement.classList.add('moving-text');
      } else {
        htmlElement.classList.remove('moving-text');
      }
    });
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      if (phoneNumber && /^\+56\d{9}$/.test(phoneNumber)) {
        return null; // Válido
      } else {
        return { 'invalidPhoneNumber': true }; // Inválido
      }
    };
  }
}
