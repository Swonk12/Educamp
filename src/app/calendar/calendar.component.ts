import {Component, ViewEncapsulation} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // IMPORTAMOS EL PLUGIN

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None, // Permite modificar estilos del fullcalendar
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'es', // Configuramos en español
    nowIndicator: true,
    firstDay: 1,  // Configuramos para que la semana empiece en Lunes
    headerToolbar: false, // Deshabilitamos la barra de encabezado original
    datesSet: this.onDatesSet.bind(this),
    dayHeaderFormat: { weekday: 'short' },  // Abreviaturas de los días de la semana
  };

  currentTitle = '';
  calendarApi!: any;

  onDatesSet(arg: any) {
    this.currentTitle = arg.view.title;
    this.calendarApi = arg.view.calendar;
  }

  handlePrev() {
    this.calendarApi.prev();
  }

  handleNext() {
    this.calendarApi.next();
  }
}
