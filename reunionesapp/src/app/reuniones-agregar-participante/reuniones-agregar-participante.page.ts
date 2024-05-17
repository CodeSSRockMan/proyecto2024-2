import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reuniones-agregar-participante',
  templateUrl: './reuniones-agregar-participante.page.html',
  styleUrls: ['./reuniones-agregar-participante.page.scss'],
})
export class ReunionesAgregarParticipantePage implements OnInit {

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
  }

}
