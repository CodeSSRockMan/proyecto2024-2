import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Router, ActivatedRoute } from '@angular/router';
import { ReunionesService, Reunion, FechaReunion } from '../services/reuniones.service';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Importa los módulos de internacionalización
registerLocaleData(localeEs);

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.page.html',
  styleUrls: ['./select-date.page.scss'],
})
export class SelectDatePage implements OnInit {
  selectedDates: FechaReunion[] = [];
  tentativeDates: FechaReunion[] = []; // Fechas tentativas de la reunión
  showThankYouMessage: boolean = false;
  groupCreatorName: string = ""; // Nombre por defecto
  meetingName: string = ""; // Nombre de la reunión
  meetingPurpose: string = 'Motivo de la Reunión'; // Motivo de la reunión
  noneOfTheDatesWork: boolean = false;
  submitButtonDisabled: boolean = true;
  reunionId!: number; // ID de la reunión
  usuarioActualId: string = "";

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reunionesService: ReunionesService, // Servicio de Reuniones
    private authService: AuthService
  ) {

  }

  async ngOnInit() {

    this.authService.user$.subscribe(user => {
      if (user) {
        this.usuarioActualId = user.id;
        console.log('User ID in date-picker component:', this.usuarioActualId);
      } else {
        console.log('User ID not found');
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // No hacer nada
      } else if (event instanceof NavigationEnd) {
        // Recuperar el estado al navegar a la página
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
          this.reunionId = navigation.extras.state['reunionId'];
          console.log('reunionId en ngOnInit:', this.reunionId); // Verifica el valor del ID
          if (this.reunionId) {
            this.loadMeetingDetails(this.reunionId);
          }
        }
      }
    });
  }

  async loadMeetingDetails(id: number) {
    try {
      const reunion = await this.reunionesService.obtenerReunionPorId(id);
      console.log(reunion);
      if (reunion) {
        // Actualiza el nombre y el propósito de la reunión
        this.meetingName = reunion.motivo;
        this.meetingPurpose = reunion.comentarios;
        this.groupCreatorName = await this.authService.obtenerNombreUsuarioPorId(reunion.created_by); // Suponiendo que es el creador del grupo

        // Cargar las fechas tentativas directamente
        this.tentativeDates = reunion.fechas_reunion;

        // Verificar las fechas seleccionadas
        const selectedDateIds = reunion.participantes.flatMap(participant =>
          participant.fechasSeleccionadas?.map(fs => fs.id) || []
        );

        // Mapeamos las fechas seleccionadas basándonos en las IDs
        this.selectedDates = this.tentativeDates.filter(fecha =>
          selectedDateIds.includes(fecha.id)
        );
      }
    } catch (error) {
      console.error('Error loading meeting details:', error);
    }
  }

  toggleNoneOfTheDatesWork(checked: boolean) {
    this.noneOfTheDatesWork = checked;

    if (checked) {
      this.selectedDates = [];
    } else {
      this.selectedDates = this.tentativeDates.filter(d =>
        this.selectedDates.some(selectedDate => selectedDate.id === d.id)
      );
    }

    this.updateSubmitButtonStatus();
  }

  updateSubmitButtonStatus() {
    this.submitButtonDisabled = this.selectedDates.length === 0 && !this.noneOfTheDatesWork;
  }

  toggleSelectedDate(fecha: FechaReunion) {
    if (this.noneOfTheDatesWork) {
      return;
    }

    const index = this.selectedDates.findIndex(d => d.id === fecha.id);
    if (index === -1) {
      this.selectedDates.push(fecha);
    } else {
      this.selectedDates.splice(index, 1);
    }

    this.updateSubmitButtonStatus();
  }

  isSelectedDate(fecha: FechaReunion): boolean {
    return this.selectedDates.some(d => d.id === fecha.id);
  }

  formatDate(date: string): string {
    // Crear un objeto Date con la fecha original
    const originalDate = new Date(date);
  
    // Sumar 4 horas a la fecha
    const adjustedDate = this.addHours(originalDate, 4);
  
    // Formatear la fecha ajustada
    const formattedDate = formatDate(adjustedDate, 'EEEE d \'de\' MMMM \'de\' yyyy', 'es');
    
    // Capitalizar la primera letra
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  async presentConfirmationAlert() {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de tu selección?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Aceptar',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  async presentThankYouToast() {
    const toast = await this.toastController.create({
      message: 'Gracias por tu selección. Te redirigiremos en 3 segundos...',
      duration: 3000,
      position: 'middle'
    });
    await toast.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Debes seleccionar al menos una fecha.',
      duration: 3000,
      position: 'middle'
    });
    await toast.present();
  }

  async submitVote() {
    try {
      if (this.noneOfTheDatesWork) {
        const confirmed = await this.presentConfirmationAlert();
        if (confirmed) {
          // Enviar solo el ID del participante y un arreglo vacío de fechas seleccionadas
          await this.reunionesService.actualizarParticipacion((await this.reunionesService.obtenerParticipantePorIDReunionYIdUsuario2(this.reunionId,this.usuarioActualId)).id, []);
          await this.presentThankYouToast();
          setTimeout(() => {
            this.router.navigateByUrl('/home'); // O a la página de inicio según el usuario
          }, 3000);
        }
      } else {
        if (this.selectedDates.length === 0) {
          await this.presentErrorToast();
          return;
        }
        const confirmed = await this.presentConfirmationAlert();
        if (confirmed) {
          // Extraer solo los IDs de las fechas seleccionadas
          const selectedDateIds = this.selectedDates.map(d => d.id);
  
          // Enviar solo el ID del participante y un arreglo vacío de fechas seleccionadas
          await this.reunionesService.actualizarParticipacion((await this.reunionesService.obtenerParticipantePorIDReunionYIdUsuario2(this.reunionId,this.usuarioActualId)).id, this.selectedDates);
          await this.presentThankYouToast();
          setTimeout(() => {
            this.router.navigateByUrl('/home'); // O a la página de inicio según el usuario
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      await this.presentErrorToast();
    }
  }
}
