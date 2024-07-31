import { Component, Input, OnInit } from '@angular/core';
import { FechaReunion, Reunion } from '../services/reuniones.service';
import { ReunionesService } from '../services/reuniones.service';
import { AuthService } from '../services/auth.service';

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
  emptyCells: number[] = [];
  days: any[] = [];
  loading: boolean = false;
  userId: string = "";
  dayNames: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  constructor(private reunionesService: ReunionesService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID in date-picker component:', this.userId);
        this.loadReuniones();
      } else {
        console.log('User ID not found');
      }
    });
  }

  getMonthFromDate(dateStr: string): string {
    if (dateStr === '') return '';
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const [day, month] = dateStr.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return months[monthIndex];
    } else {
      throw new Error('Mes inválido');
    }
  }

  getCurrentMonth(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    return months[monthIndex];
  }

  private async loadReuniones() {
    this.loading = true;
    try {
      console.log('User ID:', this.userId);
      if (this.userId !== "") {
        this.reuniones = await this.reunionesService.obtenerReunionesPorParticipante(this.userId);
        console.log('Reuniones obtenidas:', this.reuniones);
        const fechasReunion = this.reuniones.flatMap(reunion => 
          reunion.fechas_reunion.map(fechaReunion => this.normalizeDate(fechaReunion))
        );
        const hoy = new Date();
        const hoyISO = hoy.toISOString().split('T')[0];
        this.selectedDates = [hoyISO, ...fechasReunion];
        this.updateCalendar();
      } else {
        console.error('User ID not found');
      }
    } catch (error) {
      console.error('Error al cargar las reuniones:', error);
    } finally {
      this.loading = false;
    }
  }

  updateCalendar() {
    this.updateMonth();
    this.days = this.getDaysInMonth();
  }

  removeCurrentDateFromSelectedDates() {
    const currentDateISO = new Date().toISOString().split('T')[0];
    this.selectedDates = this.selectedDates.filter(date => date !== currentDateISO);
  }

  private getDaysInMonth(): any[] {
    console.log('Calculando días del mes con:', this.currentMonth); // Log el valor actual del mes
    
    const days = [];
    const [year, month] = this.currentMonth.split('-').map(Number); // Asegúrate de que el split y parseo se realicen correctamente
    console.log('Año:', year, 'Mes:', month);
    
    if (!year || !month) {
      console.error('Valor inválido para año o mes:', year, month);
      return [];
    }
    
    const startDate = new Date(year, month - 1, 1);
    console.log('Start Date:', startDate);
    
    if (isNaN(startDate.getTime())) {
      console.error('Fecha de inicio inválida:', startDate);
      return [];
    }
    
    const endDate = new Date(year, month, 0);
    console.log('End Date:', endDate);
    
    if (isNaN(endDate.getTime())) {
      console.error('Fecha de fin inválida:', endDate);
      return [];
    }
  
    // Obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const startDayOfWeek = startDate.getDay();
    console.log('Día de la semana del primer día del mes:', startDayOfWeek);
    
    // Ajustar el día de la semana para que la semana comience en lunes
    const adjustedStartDayOfWeek = (startDayOfWeek + 6) % 7; // Convertir Domingo (0) a Lunes (0)
    console.log('Día ajustado para inicio del mes:', adjustedStartDayOfWeek);
    
    // Agregar celdas vacías para los días anteriores al primer día del mes
    for (let i = 0; i < adjustedStartDayOfWeek; i++) {
      days.push({ day: '', date: null, isActive: false, isToday: false }); // Celdas vacías
    }
  
    // Obtener la fecha actual
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    const formattedToday = `${todayYear}-${todayMonth < 10 ? '0' : ''}${todayMonth}-${todayDate < 10 ? '0' : ''}${todayDate}`;
    
    // Recoger todas las fechas de reuniones del mes actual
    const meetingDatesInMonth = this.reuniones.flatMap(reunion => 
      reunion.estado === 'activa' ? reunion.fechas_reunion
        .filter(fecha => {
          const fechaDate = new Date(fecha.fecha);
          return fechaDate.getFullYear() === year && fechaDate.getMonth() === month - 1;
        })
        .map(fecha => fecha.fecha) : []
    );
  
    console.log('Fechas de reuniones en el mes actual:', meetingDatesInMonth);
  
    // Agregar los días del mes
    for (let i = 1; i <= endDate.getDate(); i++) {
      const dayDate = new Date(year, month - 1, i);
      const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${i < 10 ? '0' : ''}${i}`;
      const isActive = meetingDatesInMonth.includes(formattedDate);
      const isToday = formattedDate === formattedToday;
      
      console.log('Día:', dayDate, 'Activo:', isActive, 'Hoy:', isToday);
      days.push({ day: i, date: dayDate, isActive: isActive, isToday: isToday });
    }
    
    return days;
  }
  
  
  
  
  
  

  private normalizeDate(date: FechaReunion): string {
    const fecha = new Date(`${date.fecha}T${date.hora_inicio}`);
    fecha.setHours(fecha.getHours() + 4);
    return fecha.toISOString().split('T')[0];
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  updateMonth() {
    console.log('Actualizando mes');
  
    let año: number;
    let mes: number;
  
    // Verificar si currentMonth es válido
    if (this.currentMonth && this.currentMonth.split('-').length === 2) {
      [año, mes] = this.currentMonth.split('-').map(Number);
      
      // Validar que año y mes sean válidos
      if (isNaN(año) || isNaN(mes) || mes < 1 || mes > 12) {
        console.error('Valor inválido para año o mes:', año, mes);
        // Usar la fecha actual si currentMonth no es válido
        const fechaActual = new Date();
        año = fechaActual.getFullYear();
        mes = fechaActual.getMonth() + 1;
      }
    } else {
      // Usar la fecha actual si currentMonth no está definido
      const fechaActual = new Date();
      año = fechaActual.getFullYear();
      mes = fechaActual.getMonth() + 1;
    }
  
    // Formatear mes para que tenga dos dígitos
    this.currentMonth = `${año}-${mes < 10 ? '0' : ''}${mes}`;
    console.log('Mes Actual:', this.currentMonth);
  
    // Actualiza la fecha seleccionada formateada
    if (this.selectedDates.length > 0) {
      this.updateSelectedDateFormatted(this.selectedDates[0]);
    }
  }
  
  

  updateSelectedDateFormatted(selectedDate: string) {
    const fecha = new Date(selectedDate);
    fecha.setHours(fecha.getHours() + 4);
    const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diaSemana = nombresDias[fecha.getDay()];
    const diaDelMes = fecha.getDate();
    const mes = nombresMeses[fecha.getMonth()];
    const año = fecha.getFullYear();
    this.selectedDateFormatted = `${diaSemana}, ${diaDelMes} de ${mes} de ${año}`;
  }

  selectDay(day: any) {
    console.log('Before selectDay', this.selectedDates);
    if (this.allowSelection) {
      if (day.isSelected) {
        day.isSelected = false;
        this.selectedDates = this.selectedDates.filter(date => date !== day.date);
      } else {
        day.isSelected = true;
        this.selectedDates.push(day.date);
      }
      this.updateSelectedDateFormatted(day.date);
    }
    console.log('After selectDay', this.selectedDates);
  }

  prevMonth() {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() - 1);
    this.currentMonth = `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth() + 1 < 10 ? '0' : ''}${firstDayOfMonth.getMonth() + 1}`;
    this.updateCalendar();
  }

  nextMonth() {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
    this.currentMonth = `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth() + 1 < 10 ? '0' : ''}${firstDayOfMonth.getMonth() + 1}`;
    this.updateCalendar();
  }

  monthHasSelectedDates(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    for (const selectedDate of this.selectedDates) {
      const dateObject = new Date(selectedDate);
      if (dateObject >= firstDayOfMonth && dateObject <= lastDayOfMonth) {
        return true;
      }
    }
    return false;
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
