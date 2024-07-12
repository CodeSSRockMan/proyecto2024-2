import { Component, Input, OnInit } from '@angular/core';

interface Reunion {
  motivo: string;
  comentarios: string;
  estado: string;
  fechas: Date[];
  participantes: Participante[];
  createdByUser: boolean;
}
interface Participante {
  nombre: string;
  telefono: string;
}

enum EstadoReunion {
  Planificacion = 'Planificacion',
  Coordinacion = 'Coordinacion',
  Activa = 'Activa',
  Finalizada = 'Finalizada'
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() upcomingActivityDates: Date[] = [];
  @Input() allowSelection: boolean = true;
  @Input() reuniones: Reunion[] = [];
  selectedDates: string[] = [];
  showCalendar: boolean = true;
  currentMonth: string = '';
  selectedDateFormatted: string = '';
  days: any[] = [];
  fechasNormalizadas: string[] = [];

  constructor() { }

  ngOnInit() {
    if (this.reuniones && this.reuniones.length > 0) {
      this.selectedDates = this.reuniones.reduce((dates: string[], reunion: Reunion) => {
        return dates.concat(reunion.fechas.map(date => this.normalizeDate(date)));
      }, []);
    } else if (this.upcomingActivityDates && this.upcomingActivityDates.length > 0) {
      this.selectedDates = this.upcomingActivityDates.map(date => this.normalizeDate(date));
      console.log('Fechas recibidas:', this.upcomingActivityDates);
    } else {
      const today = new Date();
      const normalizedToday = this.normalizeDate(today);
      this.selectedDates.push(normalizedToday);
      console.log('Fecha actual:', normalizedToday);
    }
    this.updateCalendar();
    this.updateSelectedDateFormatted();
  }

  updateCalendar() {
    this.updateMonth();
    this.days = this.getDaysInMonth();
  }

  removeCurrentDateFromSelectedDates() {
    const currentDateISO = new Date().toISOString();
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
        const normalizedPrevMonthDate = this.normalizeDate(prevMonthDate);
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
      const normalizedCurrentMonthDate = this.normalizeDate(currentMonthDate);
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
        const normalizedNextMonthDate = this.normalizeDate(nextMonthDate);
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

  normalizeDate(dateOrDates: Date | Date[]): string {
    if (Array.isArray(dateOrDates)) {
      const fechaParte1 = dateOrDates[0].toISOString().split('T')[0]; // Obtiene año-mes-día de la primera fecha
      const fechaParte2 = dateOrDates[1]?.toISOString().split('T')[1] || '00:00:00.000Z'; // Obtiene hora-minuto-segundo de la segunda fecha o asigna valor por defecto
      return `${fechaParte1}T${fechaParte2}`;
    } else {
      console.log(dateOrDates);
      return dateOrDates.toISOString().split('T')[0]; // Retorna año-mes-día si es una fecha individual
    }
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
    this.selectedDates[0] = firstDayOfMonth.toISOString().split('T')[0];
    console.log('Fecha seleccionada después de retroceder un mes:', this.selectedDates);
    this.updateCalendar();
  }

  nextMonth() {
    const firstDayOfMonth = new Date(this.selectedDates[0]);
    firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
    this.selectedDates[0] = firstDayOfMonth.toISOString().split('T')[0];
    console.log('Fecha seleccionada después de avanzar un mes:', this.selectedDates);
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

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  isToday(date: string): boolean {
    const today = new Date();
    const selectedDate = new Date(date);
    const normalizedToday = this.normalizeDate(today);
    const normalizedSelectedDate = this.normalizeDate(selectedDate);
    
    console.log('Fecha actual normalizada:', normalizedToday);
    console.log('Fecha seleccionada normalizada:', normalizedSelectedDate);
  
    return normalizedToday === normalizedSelectedDate;
  }

  selectable(day: any): boolean {
    const selectedDate = new Date(day.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
  
    if (selectedMonth === currentMonth && selectedYear === currentYear) {
      return this.selectedDates.some(date => this.isSameDay(new Date(date), selectedDate));
    } else {
      return false;
    }
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  calculateTimeLeft(meeting: Reunion): string {
    const now = new Date();
    let closestTimeDifference = Infinity;

    for (const date of meeting.fechas) {
      const timeDifference = date.getTime() - now.getTime();
      if (timeDifference >= 0 && timeDifference < closestTimeDifference) {
        closestTimeDifference = timeDifference;
      }
    }

    const daysLeft = Math.floor(closestTimeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((closestTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((closestTimeDifference % (1000 * 60 * 60)) / (1000 * 60));

    let timeLeftMessage = "";
    if (daysLeft > 0) {
      timeLeftMessage += `${daysLeft} día${daysLeft > 1 ? "s" : ""}`;
    }
    if (hoursLeft > 0) {
      timeLeftMessage += ` ${hoursLeft} hora${hoursLeft > 1 ? "s" : ""}`;
    }
    if (minutesLeft > 0) {
      timeLeftMessage += ` ${minutesLeft} minuto${minutesLeft > 1 ? "s" : ""}`;
    }

    return timeLeftMessage.trim() || "Hoy";
  }
}
