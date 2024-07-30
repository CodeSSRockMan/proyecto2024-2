import { Component, Input, OnInit } from '@angular/core';
import { FechaReunion, Reunion } from '../services/reuniones.service'; // Asegúrate de importar desde el servicio correcto

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() upcomingActivityDates: FechaReunion[] = [];
  @Input() allowSelection: boolean = true;
  @Input() reuniones: Reunion[] = [];
  selectedDates: string[] = [];
  showCalendar: boolean = true;
  currentMonth: string = '';
  selectedDateFormatted: string = '';
  days: any[] = [];

  constructor() { }

  ngOnInit() {
    console.log(this.reuniones);
    if (this.reuniones && this.reuniones.length > 0) {
      this.selectedDates = this.reuniones.reduce((dates: string[], reunion: Reunion) => {
        return dates.concat(reunion.fechas_reunion.map(date => this.normalizeDate(date)));
      }, []);
    } else if (this.upcomingActivityDates && this.upcomingActivityDates.length > 0) {
      this.selectedDates = this.upcomingActivityDates.map(date => this.normalizeDate(date));
    } else {
      const today = new Date();
      const normalizedToday = this.normalizeDate({
        id:0,
        fecha: today.toISOString().split('T')[0],
        hora_inicio: '00:00:00',
        hora_fin: '23:59:59'
      });
      this.selectedDates.push(normalizedToday);
    }
    this.updateCalendar();
    this.updateSelectedDateFormatted();
  }

  updateCalendar() {
    this.updateMonth();
    this.days = this.getDaysInMonth();
  }

  removeCurrentDateFromSelectedDates() {
    const currentDateISO = new Date().toISOString().split('T')[0];
    this.selectedDates = this.selectedDates.filter(date => date !== currentDateISO);
  }

  getDaysInMonth() {
    const days = [];
    const firstDayOfMonth = new Date(this.selectedDates[0]);
    const year = firstDayOfMonth.getFullYear();
    const month = firstDayOfMonth.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = new Date(year, month, 1).getDay();

    if (firstDayOfWeek !== 1) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      const firstDayOfWeekIndex = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
      let daysToAdd = firstDayOfWeekIndex === 0 ? 6 : firstDayOfWeekIndex - 1;
      for (let i = prevMonthLastDay - daysToAdd; i <= prevMonthLastDay; i++) {
        const prevMonthDate = new Date(year, month - 1, i);
        const normalizedPrevMonthDate = this.normalizeDate({
          id:0,
          fecha: prevMonthDate.toISOString().split('T')[0],
          hora_inicio: '00:00:00',
          hora_fin: '23:59:59'
        });
        const isSelected = this.selectedDates.includes(normalizedPrevMonthDate);
        days.push({
          day: i,
          date: normalizedPrevMonthDate,
          isCurrentMonth: false,
          isToday: this.isToday(normalizedPrevMonthDate),
          isSelected: isSelected,
          isSelectable: false
        });
      }
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
      const currentMonthDate = new Date(year, month, i);
      const normalizedCurrentMonthDate = this.normalizeDate({
        id:0,
        fecha: currentMonthDate.toISOString().split('T')[0],
        hora_inicio: '00:00:00',
        hora_fin: '23:59:59'
      });
      const isSelected = this.selectedDates.includes(normalizedCurrentMonthDate);
      days.push({
        day: i,
        date: normalizedCurrentMonthDate,
        isCurrentMonth: true,
        isToday: this.isToday(normalizedCurrentMonthDate),
        isSelected: isSelected,
        isSelectable: true
      });
    }

    const lastDayOfWeek = new Date(year, month, numDaysInMonth).getDay();
    if (lastDayOfWeek !== 0) {
      const nextMonthFirstDay = new Date(year, month + 1, 1);
      const nextMonthFirstDayOfWeek = nextMonthFirstDay.getDay();
      const daysToAdd = 7 - days.length % 7;
      for (let i = 1; i <= daysToAdd; i++) {
        const nextMonthDate = new Date(year, month + 1, i);
        const normalizedNextMonthDate = this.normalizeDate({
          id:0,
          fecha: nextMonthDate.toISOString().split('T')[0],
          hora_inicio: '00:00:00',
          hora_fin: '23:59:59'
        });
        const isSelected = this.selectedDates.includes(normalizedNextMonthDate);
        days.push({
          day: i,
          date: normalizedNextMonthDate,
          isCurrentMonth: false,
          isToday: this.isToday(normalizedNextMonthDate),
          isSelected: isSelected,
          isSelectable: false
        });
      }
    }

    return days;
  }

  normalizeDate(date: FechaReunion): string {
    return `${date.fecha}T${date.hora_inicio}`;
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  updateMonth() {
    const firstDayOfMonth = new Date(this.selectedDates[0]);
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    this.currentMonth = monthNames[firstDayOfMonth.getMonth()] + ' ' + firstDayOfMonth.getFullYear();
  }

  updateSelectedDateFormatted() {
    const today = new Date();
    const dayOfWeekNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayOfWeek = dayOfWeekNames[today.getDay()];
    const dayOfMonth = today.getDate();
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    
    this.selectedDateFormatted = `${dayOfWeek} ${dayOfMonth} de ${month} de ${year}`;
  }

  selectDay(day: any) {
    if (this.allowSelection) {
      if (day.isSelected) {
        day.isSelected = false;
        this.selectedDates = this.selectedDates.filter(date => date !== day.date);
      } else {
        day.isSelected = true;
        this.selectedDates.push(day.date);
      }
      this.updateSelectedDateFormatted();
    }
  }

  prevMonth() {
    const firstDayOfMonth = new Date(this.selectedDates[0]);
    firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() - 1);
    this.selectedDates[0] = this.normalizeDate({
      id:0,
      fecha: firstDayOfMonth.toISOString().split('T')[0],
      hora_inicio: '00:00:00',
      hora_fin: '23:59:59'
    });
    this.updateCalendar();
  }

  nextMonth() {
    const firstDayOfMonth = new Date(this.selectedDates[0]);
    firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
    this.selectedDates[0] = this.normalizeDate({
      id:0,
      fecha: firstDayOfMonth.toISOString().split('T')[0],
      hora_inicio: '00:00:00',
      hora_fin: '23:59:59'
    });
    this.updateCalendar();
  }

  monthHasSelectedDates(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    for (const selectedDate of this.selectedDates) {
      const currentDate = new Date(selectedDate);
      if (currentDate >= firstDayOfMonth && currentDate <= lastDayOfMonth) {
        return true;
      }
    }
    return false;
  }

  isToday(date: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }
  capitalizeFirstLetter(text: string): string {
    if (text && text.length > 0) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    return '';
  }
}
