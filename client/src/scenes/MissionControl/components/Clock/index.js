import React from 'react';
import moment from 'moment';
import useTimer from '../../../../services/timers';
import './styles.css';

export default function Clock() {
  const timer = useTimer(moment(), 1000, ((setState) => {
    setState(moment());
  }));

  const time = timer.format('hh:mm A');
  const calendar = timer.format('ddd, MMM D');

  return (
    <div>
      <h2 className="time">{time}</h2>
      <h2 className="date">{calendar}</h2>
    </div>
  );
}
