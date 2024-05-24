import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { GuestCodeModalComponent } from '../guest-code-modal/guest-code-modal.component';
import { PopoverController } from '@ionic/angular';
import { GuestCodePopoverComponent } from '../guest-code-popover/guest-code-popover.component';
import { OverlayEventDetail } from '@ionic/core';


interface ToastData {
  value: string; // Supongamos que 'value' es el nombre de la propiedad que contiene el código de invitación
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  correoElectronico: string='';
  contrasena: string='';
  mostrarModal: boolean = false; // Definir la propiedad mostrarModal
  constructor(private router: Router,private popoverController: PopoverController, private modalController: ModalController,private toastController: ToastController) { }

  iniciarSesion() {
    // Aquí puedes agregar la lógica para iniciar sesión con el correo electrónico y la contraseña
    console.log('Iniciar sesión con correo electrónico:', this.correoElectronico, 'y contraseña:', this.contrasena);

    // Después de iniciar sesión, puedes redirigir a la página de inicio o a otra página necesaria
    this.router.navigate(['/home']);
  }

  async registrarse() {
    // Aquí puedes agregar la lógica para abrir la página de registro en un modal o como una página nueva
    // En este ejemplo, se abrirá en una página nueva (navegación normal)
    await this.router.navigate(['/register']);
  }

  async ingresarCodigoInvitado() {
    const popover = await this.popoverController.create({
      component: GuestCodePopoverComponent,
      translucent: true
    });

    popover.onDidDismiss().then(data => {
      const codigoInvitacion = data.data;
      if (codigoInvitacion) {
        console.log('Código de invitación recibido:', codigoInvitacion);
        this.router.navigate(['/home']); // Puedes realizar otras acciones aquí, como navegar a otra página
      }
    });

    return await popover.present();
  }
  
  async onPopoverClosed(codigoInvitacion: string) {
    if (codigoInvitacion) {
      console.log('Código de invitación recibido:', codigoInvitacion);
      await this.router.navigate(['/home']);
    } else {
      console.log('No se recibió ningún código de invitación');
    }
  }

  
  async onModalDismissed(event: CustomEvent<OverlayEventDetail<any>>) { //THIS ONE
    const data: string = event.detail.data;
    console.log('Datos recibidos:', data);
    await this.router.navigate(['/home']);
    // Aquí puedes realizar cualquier lógica basada en el valor de 'data'
  }

 async onCodeSubmitted(code: string) {
    console.log('Código de invitado recibido:', code);
    await this.router.navigate(['/home']);
    // Aquí puedes agregar lógica adicional para manejar el código de invitado
  }
  async closeModal() {
    await this.modalController.dismiss(); // Cerrar el modal
  }

  ngOnInit() {
  }

}
