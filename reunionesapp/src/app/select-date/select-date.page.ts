import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Router } from '@angular/router';

// Importa los módulos de internacionalización
registerLocaleData(localeEs);

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.page.html',
  styleUrls: ['./select-date.page.scss'],
})
export class SelectDatePage implements OnInit {
  selectedDates: Date[] = [];
  tentativeDates: { startDate: Date, endDate: Date }[] = []; // Aquí debes cargar las fechas disponibles
  showThankYouMessage: boolean = false;
  groupCreatorName: string = 'Juan Pérez'; // Nombre por defecto
  meetingName: string = 'Nombre de la Reunión'; // Nombre de la reunión
  meetingPurpose: string = 'Motivo de la Reunión'; // Motivo de la reunión

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    // Datos de prueba para mostrar en la página
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    this.tentativeDates = [
      { startDate: new Date(now), endDate: new Date(now.setHours(now.getHours() + 2)) },
      { startDate: new Date(tomorrow), endDate: new Date(tomorrow.setHours(tomorrow.getHours() + 2)) },
      { startDate: new Date(dayAfterTomorrow), endDate: new Date(dayAfterTomorrow.setHours(dayAfterTomorrow.getHours() + 2)) }
    ];
    this.selectedDates = [this.tentativeDates[0].startDate]; // o cualquier valor inicial deseado
  }

  ngOnInit() {
  }

  toggleSelectedDate(date: Date) {
    const index = this.selectedDates.findIndex(d => d.getTime() === date.getTime());
    if (index === -1) {
      this.selectedDates.push(date);
    } else {
      this.selectedDates.splice(index, 1);
    }
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDates.findIndex(d => d.getTime() === date.getTime()) !== -1;
  }

  formatDate(date: Date): string {
    const formattedDate = formatDate(date, 'EEEE d \'de\' MMMM \'de\' yyy', 'es');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
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

  async submitVote() {
    const confirmed = await this.presentConfirmationAlert();
    if (confirmed) {
      await this.presentThankYouToast();
      setTimeout(() => {
        // Redirige después de 3 segundos
        this.router.navigateByUrl('/login'); // O a la página de inicio según el usuario
      }, 3000);
    }
  }
}
