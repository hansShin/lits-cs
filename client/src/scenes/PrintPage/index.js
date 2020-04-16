import React from 'react';
import useTimer from '../../services/timers';
import printerList from './printerList.json';
import Printers from './components/Printers/index';
import FilteredPrinterList from './components/FilteredPrinterList/index';
import {fetchPrinters, getInitialPrinters} from './services/fetchPrinters';
import './styles.css';

export default function PrintPage() {
  const initialPrinters = getInitialPrinters(printerList);
  const printers = useTimer(initialPrinters, 60000, (callback) => {
    fetchPrinters(printerList, callback);
  });

  return (
    <div className='container'>
      <div className='sidebar'>
        <h1 id='page-title'>printers@bobst</h1>
        <FilteredPrinterList printers={printers} type='service_urgent' />
        <FilteredPrinterList printers={printers} type='service_soon' />
        <FilteredPrinterList printers={printers} type='no_response' />
      </div>
      <div className='main'>
        <Printers printerList={printerList} />
      </div>
    </div>
  );
}

