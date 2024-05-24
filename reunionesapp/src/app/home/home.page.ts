import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {
  
  upcomingActivityDate!: Date;
  upcomingActivities: { date: Date, description: string, lugar:string }[] = []; // Arreglo para almacenar las actividades próximas
  upcomingDates: Date[] = [];
  constructor() { 

    
  }

  ngOnInit() {
    this.generateUpcomingActivityDate();
    this.generateUpcomingDates();
    this.generateUpcomingActivities();

 // @ts-ignore
// Agregar un manejador de eventos para el movimiento del mouse
document.addEventListener("mousemove", () => {
  const descriptionContainer = document.querySelector(".description-container");
  if (descriptionContainer) {
    (descriptionContainer as HTMLElement).style.overflowX = "scroll"; // Mostrar la barra de desplazamiento horizontal
  }
});
  }

  generateUpcomingActivityDate() {
    // Crear una nueva fecha para el viernes 24 de junio de 2024
    const upcomingDate = new Date(2024, 4, 24); // El mes se indica con 5 porque en JavaScript los meses se cuentan desde 0 (enero es 0, febrero es 1, etc.)

    // Establecer la hora en 12:00
    upcomingDate.setHours(12, 0, 0, 0);

    // Asignar la fecha de la actividad próxima
    this.upcomingActivityDate = upcomingDate;
}

calculateProgress(description: string): number {
  // Aquí puedes implementar la lógica para calcular el valor de progreso
  // Por ejemplo, podrías calcular el progreso en función de la longitud de la descripción
  // y devolver un valor entre 0 y 1
  return description.length / 100; // Ejemplo simple: divide la longitud por 100
}


  generateUpcomingDates() {
    // Agregar la fecha de la actividad próxima al arreglo de fechas próximas
    this.upcomingDates.push(this.upcomingActivityDate);
  }

  // generateUpcomingActivityDate() {
  //   // Obtener la fecha actual
  //   const today = new Date();

  //   // Calcular la fecha en dos días
  //   const twoDaysLater = new Date(today);
  //   twoDaysLater.setDate(today.getDate() + 2);

  //   // Establecer la hora en 12:00
  //   twoDaysLater.setHours(12, 0, 0, 0);

  //   // Asignar la fecha de la actividad próxima
  //   this.upcomingActivityDate = twoDaysLater;
  // }

  generateUpcomingActivities() {
    // Crear un objeto que represente la actividad próxima
    const upcomingActivity = {
      date: this.upcomingActivityDate,
      description: "Reunión proyecto de título",
      lugar: "Universidad del Bío-Bío Campus Fernando May"
    };

    // Agregar la actividad próxima al arreglo de actividades próximas
    this.upcomingActivities.push(upcomingActivity);
  }
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }


}
