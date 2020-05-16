import React from 'react';
import './styles.css';

export default function FilteredPrinterList(props) {
  const filteredPrinters = filterPrinters(props.printers, props.type);

  const printerEntries = filteredPrinters.map((printer, index) => {
    return (
      <PrinterEntry printer={printer} key={index} />
    );
  });

  if (printerEntries.length) {
    return (
      <div className='filtered-printer-list'>
        <h2 className='filtered-printer-list-title'>{props.type}</h2>
        <ul className='filtered-printers'>
          {printerEntries}
        </ul>
      </div>
    );
  } else {
    return (
      <div className='filtered-printer-list'>
        <h2 className='filtered-printer-list-title'>{props.type}</h2>
        <div className='no-results'>
          <p>Nothing to report :]</p>
        </div>
      </div>
    );
  }
}

function PrinterEntry(props) {
  return (
    <li className='filtered-printer'>
      <h3 className='printer-name'>{props.printer.name}</h3>
      <p className='printer-status'>{props.printer.status}</p>
    </li>
  );
}

function filterPrinters(printerList, type) {
  switch (type) {
    case 'service_urgent':
      return printerList.filter(printer => printer.serviceValue === 3);
    case 'service_soon':
      return printerList.filter(printer => printer.serviceValue === 2);
    case 'no_response':
      return printerList.filter(printer => printer.serviceValue === 1);
    default:
      return [];
  }
}

