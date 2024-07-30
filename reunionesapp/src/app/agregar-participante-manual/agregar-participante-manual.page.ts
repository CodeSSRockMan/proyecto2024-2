import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ReunionesService, Reunion, Participante } from '../services/reuniones.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-agregar-participante-manual',
  templateUrl: './agregar-participante-manual.page.html',
  styleUrls: ['./agregar-participante-manual.page.scss'],
})
export class AgregarParticipanteManualPage {

  formulario: FormGroup;
  nuevoParticipante: Participante = {
    id: 0, // Inicializar con una cadena vacía o con un valor generado
    usuario_id: '', // Inicializar con el valor correspondiente del usuario
    reunion_id: 0, // Inicializar con el valor correspondiente de la reunión
    nombre: '',
    telefono: ''
  };
  reunion?: Reunion;
  currentUserId: string;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private reunionesService: ReunionesService
  ) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, this.phoneNumberValidator()]]
    });

    // Obtener el ID del usuario actual desde el servicio de autenticación
    this.currentUserId = this.authService.getCurrentUserId();
  }

  async agregarParticipante() {
    if (this.formulario.invalid) {
        const alert = await this.alertController.create({
            header: 'Error',
            message: 'Por favor, completa todos los campos correctamente.',
            buttons: ['Aceptar']
        });
        await alert.present();
        return;
    }

    const nombre = this.formulario.get('nombre')?.value;
    const correo = this.formulario.get('correo')?.value;
    const telefono = this.formulario.get('telefono')?.value;

    // Obtener los detalles del usuario actual
    let userDetails = null;
    try {
        userDetails = await this.authService.getUserDetails();
    } catch (error) {
        console.error('Error fetching user details:', error);
        const alert = await this.alertController.create({
            header: 'Error',
            message: 'No se pudo obtener la información del usuario.',
            buttons: ['Aceptar']
        });
        await alert.present();
        return;
    }

    if (userDetails) {
        const currentUserEmail = userDetails.email;
        const currentUserPhone = userDetails.phone;

        // Comprobar si el correo o teléfono coinciden con los del creador
        if (correo === currentUserEmail || telefono === currentUserPhone) {
            const alert = await this.alertController.create({
                header: 'Error',
                message: 'No puedes agregarte a ti mismo como participante.',
                buttons: ['Aceptar']
            });
            await alert.present();
            return;
        }
    }

    // Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await this.authService.buscarUsuarioPorCorreoOTelefono(correo, telefono);
    console.log(usuarioExistente);

    if (usuarioExistente) {
        const confirmAlert = await this.alertController.create({
            header: 'Usuario encontrado',
            message: `Hemos encontrado a ${usuarioExistente.username} en nuestro sistema con los siguientes detalles:\n\nNombre: ${usuarioExistente.username}\nCorreo: ${usuarioExistente.email}\nTeléfono: ${usuarioExistente.phone}\n\n¿Deseas confirmarlo y añadirlo como participante?`,
            buttons: [
                {
                    text: 'Confirmar',
                    handler: async () => {
                        await this.agregarParticipanteAReunion(usuarioExistente.username, usuarioExistente.email, usuarioExistente.phone, usuarioExistente.id);
                        this.router.navigate(['/participantes'], { state: { reunionId: history.state.reunion.id } });
                        this.mostrarToast('Participante agregado correctamente.');
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        await confirmAlert.present();
    } else {
        const alert = await this.alertController.create({
            header: 'Usuario no encontrado',
            message: `No encontramos a ${nombre} en nuestro sistema. Vuelve a revisar el estado de la reunión y comparte el código de invitación.`,
            buttons: [
                {
                    text: 'Aceptar',
                    handler: async () => {
                        await this.agregarParticipanteAReunion(nombre, correo, telefono);
                        this.router.navigate(['/participantes'], { state: { reunionId: history.state.reunion.id } });
                        this.mostrarToast('Participante agregado correctamente.');

                        const reunion: Reunion = history.state.reunion;
                        if (reunion && reunion.codigo_invitacion) {
                            const codigoAlert = await this.alertController.create({
                                header: 'Código de invitación',
                                message: `Este es tu código de invitación: ${reunion.codigo_invitacion}. Puedes copiarlo.`,
                                buttons: [
                                    {
                                        text: 'Copiar',
                                        handler: async () => {
                                            await Clipboard.write({ string: reunion.codigo_invitacion ?? '' });
                                            const toast = await this.toastController.create({
                                                message: 'Código de invitación copiado al portapapeles.',
                                                duration: 2000
                                            });
                                            toast.present();
                                        }
                                    },
                                    {
                                        text: 'Continuar',
                                        role: 'cancel'
                                    }
                                ]
                            });
                            await codigoAlert.present();
                        } else {
                            const codigoAlert = await this.alertController.create({
                                header: 'Código de invitación',
                                message: 'Puedes encontrar el código de invitación en los detalles de la reunión.',
                                buttons: ['Aceptar']
                            });
                            await codigoAlert.present();
                        }
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        await alert.present();
    }

    // Limpiar el formulario después de agregar el participante
    this.formulario.reset();
}



  

async agregarParticipanteAReunion(nombre: string, correo: string, telefono: string, usuarioId?: string) {
  const reunion: Reunion = history.state.reunion;

  if (reunion) {
      // Crear el nuevo participante con los datos proporcionados
      const nuevoParticipante: Participante = {
          id: 0,  // ID temporal hasta que la base de datos lo asigne
          nombre,
          correo,
          telefono,
          usuario_id: usuarioId,
          reunion_id: reunion.id
      };

      // Agregar el nuevo participante a la base de datos
      try {
          await this.reunionesService.agregarParticipante(nuevoParticipante);
      } catch (error) {
          console.error('Error adding participant:', error);
          const alert = await this.alertController.create({
              header: 'Error',
              message: 'No se pudo agregar el participante. Inténtalo de nuevo.',
              buttons: ['Aceptar']
          });
          await alert.present();
      }
  } else {
      const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo encontrar la reunión.',
          buttons: ['Aceptar']
      });
      await alert.present();
  }
}



  
  
  async mostrarCodigoInvitacion(codigo: string) {
    if (codigo) {
      const alert = await this.alertController.create({
        header: 'Código de Invitación',
        message: `Este es tu código de invitación: ${codigo}.`,
        buttons: [
          {
            text: 'Copiar',
            handler: async () => {
              await Clipboard.write({
                string: codigo
              });
              this.mostrarToast('Código de invitación copiado al portapapeles.');
            }
          },
          {
            text: 'Continuar',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Código de Invitación',
        message: 'No se ha generado un código de invitación. Puedes obtenerlo desde la página de detalles de la reunión.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
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

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
