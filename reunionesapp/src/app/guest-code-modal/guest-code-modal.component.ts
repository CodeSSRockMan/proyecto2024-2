import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-guest-code-modal',
  templateUrl: './guest-code-modal.component.html',
  styleUrls: ['./guest-code-modal.component.scss'],
})
export class GuestCodeModalComponent  implements OnInit {

  guestCode: string = '';
  @Output() codeSubmitted = new EventEmitter<string>();

  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  closeModal() {
    this.modalController.dismiss();
  }

  submitCode() {
    this.codeSubmitted.emit(this.guestCode); // Asegúrate de emitir el código como un string
  }
}
