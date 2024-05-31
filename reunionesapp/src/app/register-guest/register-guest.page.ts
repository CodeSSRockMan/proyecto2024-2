import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register-guest',
  templateUrl: './register-guest.page.html',
  styleUrls: ['./register-guest.page.scss'],
})
export class RegisterGuestPage implements OnInit {
  guestName: string = '';
  guestPhone: string = '';

  guestForm!: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.guestForm = this.formBuilder.group({
      guestName: ['', [Validators.required]],
      guestPhone: ['', [Validators.required, this.phoneNumberValidator()]]
    });
  }

  async registerGuest() {
    const confirmed = await this.presentConfirmationAlert();
    if (confirmed) {
      // Aquí deberías agregar la lógica para registrar al invitado

      // Luego de registrar al invitado, lo rediriges a la página para seleccionar la fecha
      this.router.navigateByUrl('/select-date');
    }
  }

  async presentConfirmationAlert() {
    const guestName = this.guestForm.get('guestName')?.value;
    const guestPhone = this.guestForm.get('guestPhone')?.value;

    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmar Datos',
        message: `Nombre:
          ${guestName}
          Teléfono:
          ${guestPhone}
      `,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false) // No confirmado
          },
          {
            text: 'Confirmar',
            handler: () => resolve(true) // Confirmado
          }
        ]
      });

      await alert.present();
    });
  }

  iniciarSesion() {
    // Redirige a la página de inicio de sesión cuando se hace clic en "Iniciar sesión"
    this.router.navigateByUrl('/login');
  }

  // Método para la validación del número de teléfono
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
