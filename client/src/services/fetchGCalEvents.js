import request from 'superagent';

const API_KEY = process.env.REACT_APP_API_KEY;

function fetchGCalEvents(calendarId, timeMin, timeMax, callback) {
  const calendarUrl = getCalendarUrl(calendarId, timeMin, timeMax);

  return httpGetRequest(calendarUrl, (res) => {
    callback(null, res);
  }, (err) => {
    callback(err, null);
  });
}

function getCalendarUrl(calendarId, timeMin, timeMax) {
  return (
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
    `singleEvents=true&orderBy=startTime&maxResults=81&timeMin=` +
    `${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&key=${API_KEY}`
  );
}

function httpGetRequest(calendarUrl, onResponse, onError) {
  request.get(calendarUrl).then(onResponse).catch(onError);
}

export default fetchGCalEvents;
