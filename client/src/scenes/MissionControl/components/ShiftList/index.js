import React from 'react';
import useTimer from '../../../../services/timers';
import fetchShifts from './services/fetchShifts';
import './styles.css';

function Avatar(props) {
  if (props.coverageNetId === null) {
    return (
      <div className="profiles">
        <span className="avatar">
          <img src={`/profiles/${props.netId}.jpg`} alt="" />
        </span>
      </div>
    );
  } else {
    return (
      <div className="profiles">
        <span className="avatar">
          <img src={`/profiles/${props.coverageNetId}.jpg`} alt="" />
        </span>
        <span className="covered-avatar">
          <img src={`/profiles/${props.netId}.jpg`} alt="" />
        </span>
      </div>
    );
  }
}

function Shift(props) {
  return (
    <li className="flex-row">
      <div className={`${props.status} vertical-center`}></div>
      <Avatar netId={props.netId} coverageNetId={props.coverageNetId} />
      <h3 className="shift-name vertical-center text-center">{props.name}</h3>
      <p className="vertical-center text-center">
        {`${props.start} - ${props.end}`}
      </p>
    </li>
  );
}

export default function ShiftList(props) {
  const shiftEvents = useTimer([], 60000, (setState) => {
    fetchShifts(props.calendarId, props.coverageId, props.current, setState);
  });

  const shifts = shiftEvents.map((event) => {
    return (
      <Shift key={event.key}
             name={event.name}
             netId={event.netId}
             coverageNetId={event.coverageNetId}
             start={event.start}
             end={event.end}
             status={event.status} />
    );
  });

  if (shifts.length) {
    return (
      <div className="shift-list">
        <h2 className="section-title">{props.title}</h2>
        <ul className="flex-col">
          {shifts}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="shift-list">
        <h2 className="section-title">{props.title}</h2>
        <div className="no-events">
          <div className="vert-bar"></div>
          <p>No shifts scheduled.</p>
        </div>
      </div>
    );
  }
}

