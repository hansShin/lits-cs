import React from 'react';
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import './styles.css';

export default function Dials(props) {
  const dials = props.dialList.map((dial, index) => {
    return <Dial dial={dial} key={index} />;
  });

  return (
    <ul className='dials'>
      {dials}
    </ul>
  );
}

function Dial(props) {
  const supply = props.dial.supply === '?' ? 0 : parseInt(props.dial.supply)
  let pathColor = '';
  switch (props.dial.label) {
    case 'b':
      pathColor = '#000000';
      break;
    case 'c':
      pathColor = '#00ffff';
      break;
    case 'm':
      pathColor = '#ff00ff';
      break;
    case 'y':
      pathColor = '#ffff00';
      break;
    default:
      pathColor = '#4c566a';
  }

  let bgColor = '#ffffff';
  if (props.dial.supply !== '?') {
    if (supply === 0) {
      bgColor = '#ffd4d8'
    } else if (supply === 5) {
      bgColor = '#fff1d4'
    }
  }
  

  return (
    <li className='dial'>
      <CircularProgressbarWithChildren
        value={supply}
        strokeWidth={5}
        background
        styles={buildStyles({
          strokeLinecap: 'butt',
          textColor: '#4c566a',
          trailColor: '#d8dee9',
          pathColor: pathColor,
          backgroundColor: bgColor,
          textSize: 30})}>
        <p className='supply-level'>{props.dial.supply}</p>
      </CircularProgressbarWithChildren>
      <p className='dial-label'>{props.dial.label}</p>
    </li>
  );
}

