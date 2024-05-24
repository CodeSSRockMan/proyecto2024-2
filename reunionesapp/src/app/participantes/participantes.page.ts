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
  showEditDeleteButtons: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  
  llamar(telefono: string) {
    window.open('tel:' + telefono);
  }

  enviarWhatsapp(telefono: string) {
    window.open('https://wa.me/' + telefono);
  }

  // Función para editar un participante
  editarParticipante(participante: any) {
    // Lógica para editar el participante
    console.log('Editar participante:', participante);
  }

  // Función para eliminar un participante
  eliminarParticipante(participante: any) {
    // Lógica para eliminar el participante
    console.log('Eliminar participante:', participante);
  }
  onScroll(event:any) {
    const scrollDirection = event.detail.deltaX > 0 ? 'right' : 'left';
    if (scrollDirection === 'right') {
      this.showEditDeleteButtons = true;
    } else {
      this.showEditDeleteButtons = false;
    }
  }
}
