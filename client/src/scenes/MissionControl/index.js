import React from 'react';
import Clock from './components/Clock/index';
import Legend from './components/Legend/index';
import AppointmentList from './components/AppointmentList/index';
import ShiftList from './components/ShiftList/index';
import './styles.css';

const APPOINTMENT_CALENDAR_ID = process.env.REACT_APP_APPOINTMENTS_ID;
const HELPDESK_CALENDAR_ID = process.env.REACT_APP_HELPDESK_ID;
const HELPDESK_COVERAGE_ID = process.env.REACT_APP_HELPDESK_COVERAGE_ID;
const BLCC_CALENDAR_ID = process.env.REACT_APP_BLCC_ID;
const BLCC_COVERAGE_ID = process.env.REACT_APP_BLCC_COVERAGE_ID;
const PRINT_CALENDAR_ID = process.env.REACT_APP_PRINT_ID;
const PRINT_COVERAGE_ID = process.env.REACT_APP_PRINT_COVERAGE_ID;

export default function MissionControl() {
  return (
    <div className='container'>
      <div className='sidebar'>
        <h1 id="page-title">MISSION CONTROL</h1>
        <Clock />
        <AppointmentList calendarId={APPOINTMENT_CALENDAR_ID} />
        <Legend />
      </div>
      <div className='main flex-row'>
        <ShiftList calendarId={HELPDESK_CALENDAR_ID}
                   coverageId={HELPDESK_COVERAGE_ID}
                   name="helpdesk" />
        <ShiftList calendarId={BLCC_CALENDAR_ID}
                   coverageId={BLCC_COVERAGE_ID}
                   name="blcc" />
        <ShiftList calendarId={PRINT_CALENDAR_ID}
                   coverageId={PRINT_COVERAGE_ID}
                   name="print" />
      </div>
    </div>
  );
}

