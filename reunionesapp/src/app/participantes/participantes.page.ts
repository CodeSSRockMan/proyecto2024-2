import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

interface Participante {
  nombre: string;
  telefono: string;
  fechasElegidas?: boolean;
  editando?: boolean;
  // Agrega la propiedad 'valoresOriginales' para guardar los valores originales
  valoresOriginales?: Partial<Participante>;
}

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.page.html',
  styleUrls: ['./participantes.page.scss'],
})
export class ParticipantesPage implements OnInit, AfterViewInit {
  participantes: Participante[] = [
    { nombre: 'Juan', telefono: '+56 934567890' },
    { nombre: 'María', telefono: '+56 987654321', fechasElegidas: true }
    // Agrega más participantes según sea necesario
  ];
  

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.detectOverflowAndAnimate();
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

  editarParticipante(participante: Participante) {
    participante.editando = true;
    // Guarda los valores originales antes de la edición
    participante.valoresOriginales = { ...participante };
  }

  async confirmarEdicion(participante: Participante) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.cancelarEdicion(participante);
          }
        },
        {
          text: 'Guardar',
          handler: () => {
            this.guardarCambios(participante);
          }
        }
      ]
    });
    await alert.present();
  }

  async guardarCambios(participante: Participante) {
    if (true) { // Verifica si el formulario es válido
      await this.presentToast('Cambios guardados exitosamente.');
      participante.editando = false;
      // Puedes agregar la lógica para guardar los cambios en el servidor si es necesario
    } else {
      await this.presentToast('Por favor, corrige los errores en el formulario.');
    }
  }

  cancelarEdicion(participante: Participante) {
    participante.editando = false;
    // Restaura los valores originales en caso de cancelación
    if (participante.valoresOriginales) {
      Object.assign(participante, participante.valoresOriginales);
    }
  }

  async confirmarEliminacion(participante: Participante) {
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
            this.eliminarParticipante(participante);
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarParticipante(participante: Participante) {
    const index = this.participantes.indexOf(participante);
    if (index !== -1) {
      this.participantes.splice(index, 1);
      await this.presentToast('Participante eliminado exitosamente.');
    }
  }

  agregarParticipante() {
    this.router.navigateByUrl('/reuniones-agregar-participante');
  }

  toggleEdicion(participante: Participante) {
    participante.editando = !participante.editando;
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

   // Define el validador phoneNumberValidator
   phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      if (phoneNumber && /^\+56\d{9}$/.test(phoneNumber)) {
        return null; // Válido
      } else {
        return { 'invalidPhoneNumber': true, 'invalidLength': true }; // Inválido
      }
    };
  }
}
