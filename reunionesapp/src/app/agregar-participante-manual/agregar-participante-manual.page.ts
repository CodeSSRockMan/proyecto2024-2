import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fecha: Date[];
  participantes: Participante[];
  createdByUser: boolean; // Indica si la reunión fue creada por el usuario
}

interface Participante {
  nombre: string;
  telefono: string;
}

@Component({
  selector: 'app-agregar-participante-manual',
  templateUrl: './agregar-participante-manual.page.html',
  styleUrls: ['./agregar-participante-manual.page.scss'],
})
export class AgregarParticipanteManualPage {

  formulario: FormGroup;
  nuevoParticipante: Participante = {
    nombre: '',
    telefono: ''
  };
  reunion?:Reunion;

  constructor(private formBuilder: FormBuilder, private alertController: AlertController,private router: Router,private route: ActivatedRoute) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, this.phoneNumberValidator()]]
    });
    
  }

  async agregarParticipante() {
    if (this.formulario.invalid) {
      // Mostrar alerta si el formulario es inválido
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    this.nuevoParticipante = {
      nombre: this.formulario.get('nombre')?.value,
      telefono: this.formulario.get('telefono')?.value
    };

    // Si el formulario es válido, obtener los valores y realizar acciones
    const nombre = this.formulario.get('nombre')?.value;
    const correo = this.formulario.get('correo')?.value;
    const telefono = this.formulario.get('telefono')?.value;

    // Aquí puedes realizar acciones con los datos obtenidos, como enviarlos a un servicio, por ejemplo.
    const reunion: Reunion = history.state.reunion;
    // Agrega el nuevo participante a la lista de participantes de la reunión
    if (reunion) {
      // Agregar el nuevo participante a la lista de participantes de la reunión
      reunion.participantes.push(this.nuevoParticipante);
      console.log('Reunión después de agregar participante:', reunion);
      // Navegar al componente de la página de inicio (Home) y pasar la reunión como parámetro
      this.router.navigate(['/participantes'], { state: { reunion } });
    } else {
      // Manejar el caso en que no haya una reunión en el estado de la historia
    }

    // Mostrar alerta de éxito
    const successAlert = await this.alertController.create({
      header: 'Éxito',
      message: 'El participante se ha agregado correctamente.',
      buttons: ['Aceptar']
    });
    await successAlert.present();

    // Limpiar el formulario después de agregar el participante
    this.formulario.reset();
  }

  phoneNumberValidator(): ValidatorFn {
    return (control) => {
      const phoneNumber = control.value;
      if (phoneNumber && /^\+56\d{9}$/.test(phoneNumber)) {
        return null; // Válido
      } else {
        return { 'invalidPhoneNumber': true }; // Inválido
      }
    };
  }
}
