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
  tentativeDates: { startDate: Date, endDate: Date ,selected: boolean}[] = []; // Aquí debes cargar las fechas disponibles
  showThankYouMessage: boolean = false;
  groupCreatorName: string = 'Juan Pérez'; // Nombre por defecto
  meetingName: string = 'Nombre de la Reunión'; // Nombre de la reunión
  meetingPurpose: string = 'Motivo de la Reunión'; // Motivo de la reunión
  noneOfTheDatesWork: boolean = false;
  submitButtonDisabled: boolean = true;

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
      { startDate: new Date(now), endDate: new Date(now.setHours(now.getHours() + 2)),selected:false },
      { startDate: new Date(tomorrow), endDate: new Date(tomorrow.setHours(tomorrow.getHours() + 2)),selected:false },
      { startDate: new Date(dayAfterTomorrow), endDate: new Date(dayAfterTomorrow.setHours(dayAfterTomorrow.getHours() + 2)),selected:false }
    ];
    this.selectedDates = []; // o cualquier valor inicial deseado
  }

  ngOnInit() {
    
  }

  toggleNoneOfTheDatesWork(checked: boolean) {

    this.noneOfTheDatesWork = checked;
  
    // Deseleccionar automáticamente las otras opciones si esta está seleccionada
    if (checked) {
      // Desactiva la selección de todas las fechas tentativas
      this.tentativeDates.forEach(date => {
        date.selected = false;
      });
    } else {
      // Si la opción "No puedo asistir en ninguna de estas fechas" no está seleccionada,
      // restablece el estado de selección de las fechas tentativas según la selección actual de fechas.
      const selectedDatesTimestamps = this.selectedDates.map(d => d.getTime());
      this.tentativeDates.forEach(date => {
        date.selected = selectedDatesTimestamps.includes(date.startDate.getTime());
      });
    }
  
    // Deshabilitar el botón de enviar si ninguna fecha está seleccionada
    this.updateSubmitButtonStatus();
  }
  
  updateSubmitButtonStatus() {
    this.selectedDates.length === 0 && !this.noneOfTheDatesWork ? this.submitButtonDisabled = true : this.submitButtonDisabled = false;
  }
  
  toggleSelectedDate(date: Date) {
    if (this.noneOfTheDatesWork) {
      // Si la opción "No puedo asistir en ninguna de estas fechas" está seleccionada, no permitas la selección de otras fechas
      return;
    }
  
    const index = this.selectedDates.findIndex(d => d.getTime() === date.getTime());
    if (index === -1) {
      // Si la fecha no está seleccionada, agrégala al arreglo
      this.selectedDates.push(date);
    } else {
      // Si la fecha ya está seleccionada, elimínala del arreglo
      this.selectedDates.splice(index, 1);
    }
  
    // Actualiza el estado de selección de las fechas tentativas
    this.tentativeDates.forEach(d => {
      d.selected = this.selectedDates.some(selectedDate => selectedDate.getTime() === d.startDate.getTime());
    });
  
    // Deshabilitar el botón de enviar si ninguna fecha está seleccionada
    this.updateSubmitButtonStatus();
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
    if (this.noneOfTheDatesWork) {
      console.log("Nada a enviar");
      // Permite enviar la selección si se ha marcado que ninguna de las fechas es adecuada
      const confirmed = await this.presentConfirmationAlert();
      if (confirmed) {
        await this.presentThankYouToast();
        setTimeout(() => {
          // Redirige después de 3 segundos
          this.router.navigateByUrl('/login'); // O a la página de inicio según el usuario
        }, 3000);
      }
    } else {
      // Si no se ha marcado que ninguna de las fechas es adecuada, requerimos que al menos una fecha sea seleccionada
      if (this.selectedDates.length === 0) {
        // Muestra un mensaje de error si ninguna fecha está seleccionada
        await this.presentErrorToast();
        return;
      }
      console.log("Fechas seleccionadas:", this.selectedDates);
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

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Debes seleccionar al menos una fecha.',
      duration: 3000,
      position: 'middle'
    });
    await toast.present();
}

}
