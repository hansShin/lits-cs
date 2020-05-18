import moment from 'moment';
import { fetchGCalEvents, getStartTime, getEndTime }
  from '../../../../../services/fetchGCalEvents';

export default function fetchAppointments(calendarId, setState) {
  /* One hour buffer in case we miss an appointment and so
     don't want it to immediately disappear from the display */
  const timeMin = moment().subtract(1, 'hours');
  const timeMax = moment().endOf('day');

  const handleResponse = (error, response) => {
    let appointments = [];

    if (!error) {
      JSON.parse(response.text).items.forEach((event) => {
        appointments.push(createAppointmentObject(event));
      });
    }

    appointments = appointments.slice(0,
      appointments.length < 7 ? appointments.length : 7);

    setState(appointments);
  };

  fetchGCalEvents(calendarId, handleResponse, timeMin, timeMax);
}


function createAppointmentObject(event) {
  return { title: event.summary,
           description: (event.description) ? event.description : 'n/a',
           start: getStartTime(event).format('hh:mma'),
           end: getEndTime(event).format('hh:mma'),
           key: event.id };
}

