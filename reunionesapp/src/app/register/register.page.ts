import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombreUsuario: string = '';
  correoElectronico: string = '';
  telefono: string = '';
  contrasena: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async registrar() {
    // Validación del número de teléfono
    if (!this.validarTelefono(this.telefono)) {
      await this.mostrarToast('El número de teléfono debe tener 9 dígitos.');
      return;
    }

    const telefonoConCodigo = `+56${this.telefono.replace(/\D/g, '')}`;

    try {
      await this.authService.register(this.correoElectronico, this.contrasena, this.nombreUsuario, telefonoConCodigo);
      await this.mostrarToast('Registro exitoso.');
      // Redirigir al usuario a la página de inicio de sesión
      this.irAInicioSesion();
    } catch (error: unknown) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await this.mostrarToast(`Error al registrar: ${errorMessage}`);
    }
  }

  validarTelefono(telefono: string): boolean {
    // Verifica que el número de teléfono tenga exactamente 9 dígitos
    const telefonoLimpio = telefono.replace(/\D/g, ''); // Elimina caracteres no numéricos
    return telefonoLimpio.length === 9;
  }

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  irAInicioSesion() {
    // Redireccionar a la página de inicio de sesión
    this.navCtrl.navigateForward('/login');
  }
}
