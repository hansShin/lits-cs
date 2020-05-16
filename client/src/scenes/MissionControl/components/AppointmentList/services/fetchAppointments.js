import moment from 'moment';
import { fetchGCalEvents, getStartTime, getEndTime }
  from '../../../../../services/fetchGCalEvents';

export default function fetchAppointments(calendarId, setState) {
  /* One hour buffer in case we miss an appointment
     and don't want it to disappear from the display */
  const timeMin = moment().subtract(1, 'hours');
  const timeMax = moment().endOf('day');

  const handleResponse = (error, response) => {
    const appointments = []

    if (!error) {
      JSON.parse(response.text).items.forEach((event) => {
        appointments.push(createAppointmentObject(event));
      });
    }

    setState(appointments);
  };

  fetchGCalEvents(calendarId, timeMin, timeMax, handleResponse);
}


function createAppointmentObject(event) {
  return { title: event.summary,
           description: (event.description) ? event.description : 'n/a',
           start: getStartTime(event),
           end: getEndTime(event),
           key: event.id };
}

