import request from 'superagent';
import moment from 'moment';

const API_KEY = process.env.REACT_APP_API_KEY;

function fetchGCalEvents(calendarId, callback, timeMin=moment().startOf('day'),
                         timeMax=moment().endOf('day')) {
  const calendarUrl = getCalendarUrl(calendarId, timeMin, timeMax);

  httpGetRequest(calendarUrl, callback);
}

function getStartTime(event) {
  return moment(event.start.dateTime || event.start.date);
}

function getEndTime(event) {
  return moment(event.end.dateTime || event.end.date);
}

function getCalendarUrl(calendarId, timeMin, timeMax) {
  return (
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
    `singleEvents=true&orderBy=startTime&maxResults=81&timeMin=` +
    `${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&key=${API_KEY}`
  );
}

function httpGetRequest(calendarUrl, callback) {
  request.get(calendarUrl).end(callback);
}

export { fetchGCalEvents, getStartTime, getEndTime };
