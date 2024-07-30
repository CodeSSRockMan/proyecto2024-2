import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { register } from 'swiper/element/bundle';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AuthService } from './services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; // Asegúrate de importar Router

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    //{ title: 'Login', url: '/login', icon: 'home' },
    { title: 'Vista general', url: '/home', icon: 'home' },
    { title: 'Crear reunión', url: '/reuniones', icon: 'mail' },
    // { title: 'Mis grupos', url: '/grupos', icon: 'grid' },
    { title: 'Mis reuniones', url: '/reuniones-lista', icon: 'briefcase' },
    //{ title: 'Estado de mi reunión', url: '/estado-reunion', icon: 'briefcase' },
    //{ title: 'Participantes', url: '/participantes', icon: 'people' },
    { title: 'Seleccionar Fecha', url: '/select-date', icon: 'calendar' },
  ];

  public labels = [
    // 'Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };

  user$: Observable<any>;  // Observable para los datos del usuario
  userEmail: string = '';
  userName: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router // Asegúrate de inyectar Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // Carga los detalles del usuario al iniciar el componente
    this.authService.loadUser();
  
    // Suscribirse a los cambios del usuario
    this.user$.pipe(
      tap(user => {
        if (user) {
          this.userEmail = user.email;
          this.userName = user.username;
        } else {
          this.userEmail = '';
          this.userName = '';
        }
      })
    ).subscribe();
  }

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmación de cierre de sesión cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            try {
              await this.authService.signOut();
              const toast = await this.toastController.create({
                message: 'Sesión cerrada con éxito.',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              const toast = await this.toastController.create({
                message: 'Hubo un error al cerrar sesión. Por favor, inténtelo de nuevo.',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
