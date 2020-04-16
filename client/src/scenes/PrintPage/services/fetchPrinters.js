const request = require('superagent');
const cheerio = require('cheerio');

export function getInitialPrinters(printerList) {
  return printerList.map(getInitialPrinter);
}

export function getInitialPrinter(printerInfo) {
  return {
      name : printerInfo.name,
      ip : printerInfo.ip,
      status: 'connecting...',
      statusType: 1,
      dialList: initializeDialList(printerInfo.type),
      trayList: initializeTrayList(printerInfo.type),
      serviceValue : 0
  }
}

export function fetchPrinters(printerList, callback) {
  const promises = printerList.map(printerInfo => fetchPrinter(printerInfo, null));

  Promise.all(promises).then(callback);
}

export function fetchPrinter(printerInfo, callback) {
  const uri = '/api';
  const body = { ip: printerInfo.ip };

  return httpPostRequest(uri, body, (response) => {
    const html = JSON.parse(response.text).html;
    const printer = {
              name : printerInfo.name,
                ip : printerInfo.ip,
      serviceValue : 0
    };

    if (response === null) {
      printer.status = 'no connection';
      printer.statusType = 2;
      printer.dialList = initializeDialList(printerInfo.type);
      printer.trayList = initializeTrayList(printerInfo.type);
      printer.serviceValue = 1;
    } else {
      const $ = cheerio.load(html);

      printer.status = normalize($('#MachineStatus'));
      printer.statusType = getStatusType(printer.status);
      printer.dialList = getDialList($, printerInfo.type);
      printer.trayList = getTrayList($, printerInfo.type);
      printer.serviceValue = getServiceValue(printer);
    }

    if (callback) {
      callback(printer);
    } else {
      return printer;
    }
  }, (error) => {
    const printer = {
      name: printerInfo.name,
      ip: printerInfo.ip,
      status: 'no connection',
      statusType: 2,
      dialList: initializeDialList(printerInfo.type),
      trayList: initializeTrayList(printerInfo.type),
      serviceValue: 1
    };

    if (callback) {
      callback(printer);
    } else {
      return printer;
    }
  });
}

function httpPostRequest(uri, body, onResponse, onError) {
  return request.post(uri).set('Cache-Control', 'no-cache').send(body)
    .then(onResponse)
    .catch(onError);
}

function getStatusType(status) {
  const statusOkay = new RegExp('ready|processing', 'i');
  const statusUrgent = new RegExp('(jam)|(load tray 1)|(open)|' +
                                  '(size mismatch)|(error)|(close right)|' +
                                  '(close front)|(unexpected)|' +
                                  '(close left)|(very low)', 'i');

  if (status.match(statusOkay)) {
    return 0;
  } else if (status.match(statusUrgent)) {
    return 3;
  } else {
    return 2;
  }
}

function getServiceValue(printer) {
  const minReducer = (acc, cur) => Math.min(acc, parseInt(cur.supply));
  const sumReducer = (acc, cur) => acc + parseInt(cur.supply);

  const minDialSupply = printer.dialList.reduce(minReducer, 100);
  const totalTraySupply = printer.trayList.reduce(sumReducer, 0);

  let serviceValue = printer.statusType === 3 ? 3 : 0;

  if (minDialSupply === 0 || totalTraySupply === 0) {
    serviceValue = 3;
  } else if (minDialSupply <= 5 || totalTraySupply <= 20) {
    serviceValue = Math.max(serviceValue, 2);
  }

  return serviceValue;
}

function getDialList($, printerType) {
  const dialList = initializeDialList(printerType);

  for (let i = 0; i < dialList.length; i++) {
    const dialName = $('#SupplyName' + i).text().trim().toLowerCase();
    const supplyText = $('#SupplyPLR' + i).text().replace('*', '').trim();

    const index = getDialIndex(dialName, printerType);
    if (index === -1) continue;

    dialList[index].supply = normalizeSupplyText(supplyText);
  }

  return dialList;
}

function getTrayList($, printerType) {
  const trayList = initializeTrayList(printerType);

  for (let i = 1; i <= trayList.length; i++) {
    const supplyText = $('#TrayBinStatus_' + i).text().replace('*', '').trim();
    trayList[i - 1].supply = normalizeSupplyText(supplyText);
  }

  return trayList;
}

function getDialIndex(dialName, printerType) {
  const black = new RegExp('(black cartridge)', 'i');
  const cyan = new RegExp('(cyan cartridge)', 'i');
  const magenta = new RegExp('(magenta cartridge)', 'i');
  const yellow = new RegExp('(yellow cartridge)', 'i');
  const mKit = new RegExp('(maintenance)', 'i');
  const fuser = new RegExp('(fuser)', 'i');
  const transfer = new RegExp('(transfer)', 'i');

  switch (true) {
    case black.test(dialName):
      return printerType === 'HPM651' ? 3 : 0;
    case cyan.test(dialName):
      return 0;
    case magenta.test(dialName):
      return 1;
    case yellow.test(dialName):
      return 2;
    case mKit.test(dialName):
      return 1;
    case fuser.test(dialName):
      return 4;
    case transfer.test(dialName):
      return 5;
    default:
      return -1;
  }
}

function initializeDialList(printerType) {
  if (printerType === 'HPM806') {
    return [
      {label: 'b', supply: '?'},
      {label: 'm_kit', supply: '?'}
    ];
  } else if (printerType === 'HPM651') {
    return [
      {label: 'c', supply: '?'},
      {label: 'm', supply: '?'},
      {label: 'y', supply: '?'},
      {label: 'b', supply: '?'},
      {label: 'm_kit', supply: '?'},
      {label: 't_kit', supply: '?'}
    ];
  }
}

function initializeTrayList(printerType) {
  if (printerType === 'HPM806') {
    return [
      {label: 'tray 1:', supply: '?'},
      {label: 'tray 2:', supply: '?'},
      {label: 'tray 3:', supply: '?'},
      {label: 'tray 4:', supply: '?'},
      {label: 'tray 5:', supply: '?'},
    ];
  } else if (printerType === 'HPM651') {
    return [
      {label: 'tray 1:', supply: '?'},
      {label: 'tray 2:', supply: '?'}
    ];
  }
}

function normalize(html) {
  return html.text().replace('*', '').trim().toLowerCase();
}

function normalizeSupplyText(text) {
  switch (text.toLowerCase()) {
    case 'empty':
    case '--%':
    case '0':
    case '0%':
      return '0%';
    case '<10%':
    case '< 10%':
      return '5%';
    case '10%':
      return '10%'
    case '10 - 20%':
    case '20%':
      return '20%';
    case '30%':
      return '30%';
    case '20 - 40%':
    case '40%':
      return '40%';
    case '50%':
      return '50%';
    case '60%':
      return '60%';
    case '70%':
      return '70%';
    case '80%':
      return '80%';
    case '90%':
      return '90%';
    case '40 - 100%':
    case '100%':
    case 'ok':
      return '100%';
    default:
      return '?';
  }
}

