import { Component, OnInit } from '@angular/core';
interface Participante {
  nombre: string;
  telefono: string;
}

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.page.html',
  styleUrls: ['./participantes.page.scss'],
})
export class ParticipantesPage implements OnInit {
  participantes: Participante[] = [
    { nombre: 'Juan', telefono: '+56 934567890' },
    { nombre: 'María', telefono: '+56 987654321' }
    // Agrega más participantes según sea necesario
  ];
  constructor() { }

  ngOnInit() {
  }
  llamar(telefono: string) {
    window.open('tel:' + telefono);
  }

  enviarWhatsapp(telefono: string) {
    window.open('https://wa.me/' + telefono);
  }
}
