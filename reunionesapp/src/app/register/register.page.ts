import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombreUsuario: string='';
  correoElectronico: string='';
  telefono: string='';
  contrasena: string='';

  registrar() {
    // Aquí puedes implementar la lógica para enviar los datos del registro al servidor
    console.log('Nombre de usuario:', this.nombreUsuario);
    console.log('Correo electrónico:', this.correoElectronico);
    console.log('Teléfono:', this.telefono);
    console.log('Contraseña:', this.contrasena);

    // Redireccionar a la página de inicio de sesión después del registro exitoso
    this.navCtrl.navigateForward('/login');
  }

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
  }

  irAInicioSesion() {
    // Redireccionar a la página de inicio de sesión
    this.navCtrl.navigateForward('/login');
  }

}
