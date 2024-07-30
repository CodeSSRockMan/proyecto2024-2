import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { GuestCodePopoverComponent } from '../guest-code-popover/guest-code-popover.component';
import { OverlayEventDetail } from '@ionic/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correoElectronico: string = '';
  contrasena: string = '';
  mostrarModal: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  async iniciarSesion() {
    try {
      // Iniciar sesión con Supabase
      await this.authService.signIn(this.correoElectronico, this.contrasena);
      
      // Obtener datos adicionales del usuario
      const user = await this.authService.getUserDetails();
      
      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/home']);
      
      // Mostrar un mensaje de éxito
      const toast = await this.toastController.create({
        message: 'Inicio de sesión exitoso.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } catch (error: unknown) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      const toast = await this.toastController.create({
        message: `Error al iniciar sesión: ${errorMessage}`,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  async registrarse() {
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
        this.router.navigate(['/register-guest']);
      }
    });

    return await popover.present();
  }

  async onPopoverClosed(codigoInvitacion: string) {
    if (codigoInvitacion) {
      console.log('Código de invitación recibido:', codigoInvitacion);
      await this.router.navigate(['/register-guest']);
    } else {
      console.log('No se recibió ningún código de invitación');
    }
  }

  async onModalDismissed(event: CustomEvent<OverlayEventDetail<any>>) {
    const data: string = event.detail.data;
    console.log('Datos recibidos:', data);
    await this.router.navigate(['/register-guest']);
  }

  async onCodeSubmitted(code: string) {
    console.log('Código de invitado recibido:', code);
    await this.router.navigate(['/register-guest']);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
  }
}
