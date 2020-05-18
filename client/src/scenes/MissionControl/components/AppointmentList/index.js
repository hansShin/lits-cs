import React from 'react';
import useTimer from '../../../../services/timers';
import fetchAppointments from './services/fetchAppointments';
import './styles.css';

function Appointment(props) {
  return (
    <li className="appointment">
      <div>
        <p>{props.title}</p>
        <h4>{props.description}</h4>
      </div>
      <p>{props.start}</p>
    </li>
  );
}

export default function AppointmentList(props) {
  const appointmentEvents = useTimer([], 60000, (setState) => {
    fetchAppointments(props.calendarId, setState);
  });

  const appointments = appointmentEvents.map((event) => {
    return (
      <Appointment key={event.key}
                   title={event.title}
                   description={event.description}
                   start={event.start} />
    );
  });

  if (appointments.length) {
    return (
      <div className="appointments">
        <h2 className="section-title">appointments</h2>
        <ul>
          {appointments}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="appointments">
        <h2 className="section-title">appointments</h2>
        <div className="no-events">
          <div className="vert-bar"></div>
          <p>No appointments scheduled.</p>
        </div>
      </div>
    );
  }
}

