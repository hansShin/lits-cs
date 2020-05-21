import moment from 'moment';
import { fetchGCalEvents, getStartTime, getEndTime }
  from '../../../../../services/fetchGCalEvents';

export default function fetchShifts(calendarId, coverageId, current, callback) {
  let shifts = [];

  fetchGCalEvents(calendarId, (error, response) => {
    if (error) {
      return;
    }

    shifts = JSON.parse(response.text).items.map(createShiftObject);
    shifts = shifts.filter((shift) => !isPast(shift));

    fetchGCalEvents(coverageId, (err, res) => {
      if (!err) {
        JSON.parse(res.text).items.forEach((event) => {
          const coverage = createCoverageObject(event);
          handleCoverage(shifts, coverage);
        });
      }

      shifts = filterShifts(shifts, current);
      shifts.sort(compareShifts);
      shifts = shifts.map(formatShiftObject);
      callback(shifts);
    });
  });
}

function handleCoverage(shifts, coverage) {
  if (!coverage) return;

  let i = 0;
  for ( ; i < shifts.length; i++)
    if (isMatchingCoverage(shifts[i], coverage)) break;
  if (i === shifts.length) return;

  const coveredShift = createCoveredShiftObject(shifts[i], coverage);

  if (isFullCoverage(shifts[i], coverage)) {
    shifts[i] = coveredShift;
  } else {
    shifts.push(coveredShift);

    if (isPartialCoverageStartToMiddle(shifts[i], coverage)) {
      shifts[i].start = coverage.end;
    } else if (isPartialCoverageMiddleToEnd(shifts[i], coverage)) {
      shifts[i].end = coverage.start;
    } else if (isPartialCoverageMiddleToMiddle(shifts[i], coverage)) {
      shifts.push({ name: shifts[i].name,
                    netId: normalize(shifts[i].netId),
                    coverageNetId: null,
                    start: coverage.end,
                    end: shifts[i].end,
                    key: shifts[i].key + coverage.key,
                    status: "attending" });
      shifts[i].end = coverage.start;
    }
  }
}


/*
 * Creates a shift object given a Google Calendar event object
 */
function createShiftObject(event, key=event.id) {
  let status = "attending";
  const start = getStartTime(event);
  const end = getEndTime(event);

  return { name: event.summary,
           netId: (event.description) ? normalize(event.description) : "",
           coverageNetId: null,
           start: start,
           end: end,
           key: key,
           status: status };
}

function createCoveredShiftObject(shift, coverage, key=coverage.key) {
  const coverageNeeded = coverage.coverageNetId === "cover"
                       || coverage.coverageNetId === "coverage";

  const name = coverageNeeded ? shift.name : coverage.name;
  const coverageNetId = coverageNeeded ? null : coverage.coverageNetId;

  let status = coverageNeeded ? "coverage-needed" : "coverage-provided";

  if (coverage.coverageNetId === null)
    status = "sick-leave";

  return {
    name: name,
    netId: shift.netId,
    coverageNetId: coverageNetId,
    start: coverage.start,
    end: coverage.end,
    key: key,
    status: status
  };
}

function createCoverageObject(event) {
  const names = stringToArray(event.summary, false);
  const ids = stringToArray(event.description);
  const sickTime = isSickTime(event);
  const start = getStartTime(event);
  const end = getEndTime(event);

  if (sickTime) {
    return {
      name: names[0],
      netId: ids[0],
      coverageNetId: null,
      start: start,
      end: end,
      key: event.id
    };
  }

  return {
    name: names[0],
    netId: isOpenCoverage(event) ? ids[2] + " " + ids[3] : ids[2],
    coverageNetId: ids[0],
    start: start,
    end: end,
    key: event.id
  };
}

/*
 * Replace moment.js objects in shift object with formatted times
 */
function formatShiftObject(shift) {
  shift.start = shift.start.format("hh:mma");
  shift.end = shift.end.format("hh:mma");

  return shift;
}


function filterShifts(shifts, current) {
  if (current) {
    shifts = shifts.filter(isNow);
  } else {
    shifts = shifts.filter((event) => {
      return !isNow(event) && !isPast(event);
    });
  }
  shifts.splice(3);

  return shifts;
}


function isMatchingCoverage(shift, coverage) {
  return shift.netId.indexOf(coverage.netId) === 0;
}

function isFullCoverage(shift, coverage) {
  return shift.start.isSame(coverage.start)
      && shift.end.isSame(coverage.end);
}

function isPartialCoverageStartToMiddle(shift, coverage) {
  return shift.start.isSame(coverage.start)
      && shift.end.isAfter(coverage.end);
}

function isPartialCoverageMiddleToMiddle(shift, coverage) {
  return shift.start.isBefore(coverage.start)
      && shift.end.isAfter(coverage.end);
}

function isPartialCoverageMiddleToEnd(shift, coverage) {
  return shift.start.isBefore(coverage.start)
      && shift.end.isSame(coverage.end);
}

function isOpenCoverage(event) {
  if (event.description)
    return stringToArray(event.description)[2] === 'open';

  return false;
}

function isSickTime(event) {
  return normalize(event.summary).indexOf('sick leave') !== -1;
}

function isNow(shift) {
  const now = moment();
  return now.isSameOrAfter(shift.start) && now.isBefore(shift.end);
}

function isPast(shift) {
  const now = moment();
  return now.isAfter(shift.end);
}

function compareShifts(s1, s2) {
  if (s1.start.isSame(s2.start)) {
    if (s1.end.isSame(s2.end))
      return normalize(s1.name).localeCompare(normalize(s2.name));
    else
      return s1.end.isBefore(s2.end) ? -1 : 1;
  } else {
    return s1.start.isBefore(s2.start) ? -1 : 1;
  }
}

function normalize(string) {
  return string.trim().toLowerCase();
}


function stringToArray(string, lower=true) {
  let result = (!string) ? []
    : string.split(/\s+/)
        .filter((elem) => { return elem !== null && elem !== "" });

  if (lower)
    result = result.map(normalize);

  return result;
}

