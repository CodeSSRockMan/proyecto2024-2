import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-guest',
  templateUrl: './register-guest.page.html',
  styleUrls: ['./register-guest.page.scss'],
})
export class RegisterGuestPage implements OnInit {
  guestName: string = '';
  guestPhone: string = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  registerGuest() {
    // Aquí deberías agregar la lógica para registrar al invitado

    // Luego de registrar al invitado, lo rediriges a la página para seleccionar la fecha
    this.router.navigateByUrl('/select-date');
  }

  iniciarSesion() {
    // Redirige a la página de inicio de sesión cuando se hace clic en "Iniciar sesión"
    this.router.navigateByUrl('/login');
  }

}
