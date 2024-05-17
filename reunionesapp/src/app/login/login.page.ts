import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correoElectronico: string='';
  contrasena: string='';

  constructor(private router: Router) { }

  iniciarSesion() {
    // Aquí puedes agregar la lógica para iniciar sesión con el correo electrónico y la contraseña
    console.log('Iniciar sesión con correo electrónico:', this.correoElectronico, 'y contraseña:', this.contrasena);

    // Después de iniciar sesión, puedes redirigir a la página de inicio o a otra página necesaria
    this.router.navigate(['/home']);
  }
  registrarse() {
    // Aquí puedes agregar la lógica para redirigir a la página de registro
    this.router.navigate(['/register']);
  }

  ingresarCodigoInvitado() {
    // Aquí puedes agregar la lógica para redirigir a la página de ingreso de código de invitado
    this.router.navigate(['/codigo-invitado']);
  }
  ngOnInit() {
  }

}
