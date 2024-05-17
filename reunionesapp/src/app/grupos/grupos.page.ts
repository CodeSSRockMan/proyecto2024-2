import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos = [
    { nombre: 'Grupo 1', descripcion: 'Descripción del grupo 1' },
    { nombre: 'Grupo 2', descripcion: 'Descripción del grupo 2' },
    { nombre: 'Grupo 3', descripcion: 'Descripción del grupo 3' },
    // Agrega más grupos según sea necesario
  ];
  constructor() { }

  ngOnInit() {
  }

}
