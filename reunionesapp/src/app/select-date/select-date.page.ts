import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.page.html',
  styleUrls: ['./select-date.page.scss'],
})
export class SelectDatePage implements OnInit {
  selectedDate!: string;
  availableDates: string[] = ['Fecha 1', 'Fecha 2', 'Fecha 3']; // Aquí debes cargar las fechas disponibles

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  submitVote() {
    if (this.selectedDate) {
      // Aquí podrías enviar la votación del usuario al servidor
      console.log('Fecha seleccionada:', this.selectedDate);
      // Por simplicidad, aquí se navega de vuelta a la vista de inicio
      this.navCtrl.navigateBack('/login');
    } else {
      console.error('Debes seleccionar una fecha.');
    }
  }
}
