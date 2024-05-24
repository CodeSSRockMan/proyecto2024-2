import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  @Input() upcomingActivityDate!: Date;

  selectedDate: string = new Date().toISOString();
  showCalendar: boolean = true;
  currentMonth: string = '';
  selectedDateFormatted: string = '';
  days: any[] = []; // Arreglo para almacenar los días del mes

  constructor() { }

  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    this.updateMonth();
    this.updateSelectedDateFormatted();
    this.days = this.getDaysInMonth();
  }

  getDaysInMonth() {
    const days = [];
    const currentDate = new Date();
    const selectedDate = new Date(this.selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay(); // Obtener el primer día de la semana del mes

    // Rellenar los días anteriores al primer día del mes
    const prevMonth = new Date(year, month, 0);
    for (let i = prevMonth.getDate() - firstDayOfWeek + 1; i <= prevMonth.getDate(); i++) {
      const currentDate = new Date(year, month - 1, i);
      days.push({
        day: i,
        date: currentDate.toISOString(),
        isCurrentMonth: false,
        isToday: this.isSameDay(currentDate, new Date()),
        isSelected: this.isSameDay(currentDate, selectedDate),
        isSelectable: false // Los días anteriores no son seleccionables
      });
    }

    // Rellenar los días del mes
    for (let i = 1; i <= numDaysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        day: i,
        date: currentDate.toISOString(),
        isCurrentMonth: true,
        isToday: this.isSameDay(currentDate, new Date()),
        isSelected: this.isSameDay(currentDate, selectedDate),
        isSelectable: true // Los días del mes son seleccionables
      });
    }

    // Rellenar los días siguientes al último día del mes
    const nextMonth = new Date(year, month + 1, 1);
    const daysLeft = 7 - (days.length % 7); // Calcular cuántos días faltan para completar la semana
    for (let i = 1; i <= daysLeft; i++) {
      const currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      days.push({
        day: i,
        date: currentDate.toISOString(),
        isCurrentMonth: false,
        isToday: this.isSameDay(currentDate, new Date()),
        isSelected: this.isSameDay(currentDate, selectedDate),
        isSelectable: false // Los días siguientes no son seleccionables
      });
    }

    return days;
}

  
  

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  updateMonth() {
    const date = new Date(this.selectedDate);
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    this.currentMonth = monthNames[date.getMonth()] + ' ' + date.getFullYear();
  }

  updateSelectedDateFormatted() {
    const date = new Date(this.selectedDate);
    const dayOfWeekNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dayOfWeek = dayOfWeekNames[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    this.selectedDateFormatted = `${dayOfWeek} ${dayOfMonth} de ${month} de ${year}`;
  }
  

  selectDay(day: any) {
    // Invertir el estado de selección del día clickeado
    day.isSelected = !day.isSelected;
  
    // Actualizar la fecha seleccionada solo si el día no es el actual
      const selectedDate = new Date(day.date);
      this.selectedDate = selectedDate.toISOString();
  
    // Actualizar el calendario después de seleccionar/deseleccionar un día
    this.updateCalendar();
  }
  prevMonth() {
    const date = new Date(this.selectedDate);
    date.setMonth(date.getMonth() - 1);
    this.selectedDate = date.toISOString();
    this.updateCalendar();
  }
  
  nextMonth() {
    const date = new Date(this.selectedDate);
    date.setMonth(date.getMonth() + 1);
    this.selectedDate = date.toISOString();
    this.updateCalendar();
  }
  
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  selectable(day: any): boolean {
    const currentDate = new Date();
    const selectedDate = new Date(day.date);
    return (
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
    );
}

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
