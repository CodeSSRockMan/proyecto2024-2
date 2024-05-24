import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-guest-code-popover',
  templateUrl: './guest-code-popover.component.html',
  styleUrls: ['./guest-code-popover.component.scss']
})
export class GuestCodePopoverComponent  implements OnInit {

  guestCode: string = '';


  constructor(private popoverController: PopoverController) { }
  
  closePopover() {
    this.popoverController.dismiss(); // Emitir evento cuando se cierra el popover
  }

  submitCode() {
    console.log(this.guestCode);
    this.popoverController.dismiss(this.guestCode); // Aquí se envían los datos al cerrar el popover
  }

  ngOnInit() {}

}
