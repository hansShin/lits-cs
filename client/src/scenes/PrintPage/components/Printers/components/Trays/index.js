import React from 'react';
import './styles.css';

export default function Trays(props) {
  const trays = props.trayList.map((tray, index) => {
    return <Tray tray={tray} key={index}/>
  });

  return (
    <ul className='trays'>
      {trays}
    </ul>
  );
}

function Tray(props) {
  const supply = props.tray.supply === '?' ? 0 : parseInt(props.tray.supply);

  let bgColor = 'transparent';

  if (props.tray.supply !== '?' && props.tray.label !== 'tray 1:') {
    if (supply === 0) {
      bgColor = '#ffd4d8';
    } else if (supply <= 10) {
      bgColor = '#fff1d4';
    }
  }

  const style = {
    backgroundColor: bgColor
  };

  return (
    <li className='tray' style={style}>
      <p className='tray-label'>{props.tray.label}</p>
      <p className='tray-supply'>{props.tray.supply}</p>
    </li>
  );
}
