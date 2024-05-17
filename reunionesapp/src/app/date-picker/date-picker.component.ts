import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  selectedDate: string = new Date().toISOString();
  showCalendar: boolean = true;
  currentMonth: string = '';
  selectedDateFormatted: string = '';

  constructor() { }

  ngOnInit() {
    this.updateMonth();
    this.updateSelectedDateFormatted();
  }

  getDaysInMonth() {
    const days = [];
    const currentDate = new Date(); // Obtener la fecha actual
    const date = new Date(this.selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
  
    // Rellenar los días del mes en el array
    for (let i = 1; i <= numDaysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === new Date().toDateString(); // Compara solo la parte de la fecha sin la hora
  
      days.push({
        day: i,
        date: currentDate.toISOString(),
        isCurrentMonth,
        isToday: isToday, // Marcar el día actual
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
    this.selectedDate = day.date;
    this.updateSelectedDateFormatted();
    this.showCalendar = false;
  }

  prevMonth() {
    const date = new Date(this.selectedDate);
    date.setMonth(date.getMonth() - 1);
    this.selectedDate = date.toISOString();
    this.updateMonth();
    this.updateSelectedDateFormatted();
  }

  nextMonth() {
    const date = new Date(this.selectedDate);
    date.setMonth(date.getMonth() + 1);
    this.selectedDate = date.toISOString();
    this.updateMonth();
    this.updateSelectedDateFormatted();
  }
  selectable(day: any): boolean {
    const currentDate = new Date();
    const selectedDate = new Date(day.date);
    return selectedDate.getMonth() === currentDate.getMonth();
  }
  
}
