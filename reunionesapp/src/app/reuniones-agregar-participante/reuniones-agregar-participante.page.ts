import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  selector: 'app-reuniones-agregar-participante',
  templateUrl: './reuniones-agregar-participante.page.html',
  styleUrls: ['./reuniones-agregar-participante.page.scss'],
})
export class ReunionesAgregarParticipantePage implements OnInit {

  reunion!: Reunion;

  openWhatsApp() {
    // Lógica para abrir WhatsApp
  }

  openContacts() {
    // Lógica para abrir la lista de contactos
  }

  openManualEntry() {
    this.router.navigate(['/manual-entry']); // Redirigir a la página de ingreso manual
  }

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(history.state)
    this.reunion = history.state.reunion;
    console.log('Reunión:', this.reunion);
    if (this.reunion && this.reunion.participantes) {
      console.log('Participantes de la reuniónn:', this.reunion.participantes);
    } else {
      console.log('No se encontraron participantes para la reunión.');
    }
  }
  addViaWhatsApp() {
    // Implementa la lógica para agregar participante a través de WhatsApp
    console.log('Agregar participante via WhatsApp');
  }

  addViaContacts() {
    // Redirige al usuario a la pantalla de contactos
    this.router.navigate(['/contacts']); // Asegúrate de tener la ruta adecuada configurada para la pantalla de contactos
  }

  addManually() {
    // Redirige al usuario a la pantalla de ingreso manual
    this.router.navigate(['/agregar-participante-manual'], { state: { reunion: this.reunion } }); // Asegúrate de tener la ruta adecuada configurada para la pantalla de ingreso manual
  }

}
