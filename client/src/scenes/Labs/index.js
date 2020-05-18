import React from 'react';
import moment from 'moment';
import useTimer from '../../services/timers';
import fetchLabSchedule from './services/fetchLabSchedule';

export default function Labs(props) {
  const name = getLabName(props.type);

  const now = useTimer(moment(), 60000, (setState) => { setState(moment()); });
  const date = now.format('dddd - MMM M, YYYY');
  const time = now.format('hh:mm A');

  return (
    <div>
      <div id='schedule'>
        <div className='lab-name'>
          <h1>{name}</h1>
        </div>
        <div className='date'>
          <h2>{date}</h2>
        </div>
      </div>
      <div id='footer'>
        <div className='time'>
          <h2>{time}</h2>
        </div>
      </div>
    </div>
  );
  /*return (
    <div>
      <div id='schedule'>
        <div className='lab-name'>
          <h1>{name}</h1>
        </div>
        <div className='date'>
          <h2>{date}</h2>
        </div>
        {events}
      </div>
      <div id='footer'>
        <div className='time'>
          <h2>{time}</h2>
        </div>
        <div className='status'>
          <h2>{status}</h2>
        </div>
      </div>
    </div>
  );*/
}

function getLabName(labType) {
  switch (labType) {
    case "maclab":
      return "MAC CLASSROOM";
    case "pclab1":
      return "PC CLASSROOM 1";
    case "pclab2":
      return "PC CLASSROOM 2";
    default:
      return "Error: invalid lab"
  }
}
