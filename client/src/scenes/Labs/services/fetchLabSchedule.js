import moment from 'moment';
import {fetchGCalEvents} from '../../../services/fetchGCalEvents';

function fetchLabSchedule(calendarId, callback) {
  const timeMin = moment().startOf('day');
  const timeMax = moment().endOf('day');

  const promise = fetchGCalEvents(calendarId, timeMin, timeMax, (err, res) => {
    JSON.parse(res.text).items.forEach((event) => {
    });
  });
}

export default fetchLabSchedule;
