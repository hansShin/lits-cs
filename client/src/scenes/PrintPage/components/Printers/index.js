import React from 'react';
import useTimer from '../../../../services/timers';
import {getInitialPrinter, fetchPrinter} from '../../services/fetchPrinters';
import './styles.css';
import Dials from './components/Dials/index';
import Trays from './components/Trays/index';

export default function Printers(props) {
  const printers = props.printerList.map((printerInfo, index) => {
    return (
      <Printer printerInfo={printerInfo} key={index} />
    );
  });

  return (
    <ul id='printers'>
      {printers}
    </ul>
  );
}

function Printer(props) {
  const initial = getInitialPrinter(props.printerInfo);
  const printer = useTimer(initial, 60000, (callback) => {
    fetchPrinter(props.printerInfo, callback);
  });
  const style = getBGStyle(printer.statusType);

  return (
    <li className='printer'>
      <a href={`http://${printer.ip}/hp/device/DeviceStatus/Index`} target="_blank" rel="noopener noreferrer">
        <h2 className='printer-name'>{printer.name}</h2>
        <h4 className='printer-status' style={style}>{printer.status}</h4>
        <Dials dialList={printer.dialList} />
        <Trays trayList={printer.trayList} />
      </a>
    </li>
  );
}

function getBGStyle(statusType) {
  switch (statusType) {
    case 0:
      return { backgroundColor: '#e8ffd4' };
    case 1:
      return { backgroundColor: 'transparent' };
    case 2:
      return { backgroundColor: '#fff1d4' };
    case 3:
      return { backgroundColor: '#ffd4d8' };
    default:
      return { backgroundColor: 'transparent' };
  }
}
