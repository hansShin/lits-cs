import moment from 'moment';
import {fetchGCalEvents} from '../../../services/fetchGCalEvents';

function fetchLabSchedule(calendarId, callback) {
  const promise = fetchGCalEvents(calendarId, (err, res) => {
    JSON.parse(res.text).items.forEach((event) => {
    });
  });
}

export default fetchLabSchedule;
