import {
  dayOffsets,
  ICS_CALENDARNAME_TEMPLATE
} from '../config';
import { getFestivalMonday, timeToMinutes } from './timeUtils';

/**
 * Converts “Day” + “hh:mm AM/PM” into an ICS datetime string.
 */
export function formatICSDate(day, time, year) {
  const dayName = day.match(/^([A-Za-z]+)/)[1];
  const baseDateStr = getFestivalMonday(year);
  const baseDate = new Date(`${baseDateStr}T00:00:00`);
  const eventDate = new Date(baseDate);
  eventDate.setDate(baseDate.getDate() + dayOffsets[dayName]);

  // Use timeToMinutes for parsing and late-night logic
  const mins = timeToMinutes(time);
  let h = Math.floor(mins / 60) % 24;
  const m = mins % 60;

  // If time is after midnight but before cutoff, move to next day
  if (mins >= 1440) {
    eventDate.setDate(eventDate.getDate() + 1);
  }

  const pad = n => n.toString().padStart(2, '0');
  return `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(
    eventDate.getDate()
  )}T${pad(h)}${pad(m)}00`;
}

/**
 * @param {Array<{ type, day, location, event: { name, start, end } }>} selections
 * @param {number} year
 * @param {string} activeTab  // "Centeroo" or "Outeroo"
 */
export function generateICS(selections, year, activeTab) {
  const calendarName = ICS_CALENDARNAME_TEMPLATE
    .replace('{year}', year)
    .replace('{tab}', activeTab);

  const lines = [];

  // VCALENDAR header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push(`X-WR-CALNAME:${calendarName}`);
  lines.push(`NAME:${calendarName}`);
  lines.push('PRODID:-//Bonnaroo Planner//EN');

  // VTIMEZONE for America/Chicago
  lines.push('BEGIN:VTIMEZONE');
  lines.push('TZID:America/Chicago');
  lines.push('BEGIN:STANDARD');
  lines.push('DTSTART:19701101T020000');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU');
  lines.push('TZOFFSETFROM:-0500');
  lines.push('TZOFFSETTO:-0600');
  lines.push('TZNAME:CST');
  lines.push('END:STANDARD');
  lines.push('BEGIN:DAYLIGHT');
  lines.push('DTSTART:19700308T020000');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU');
  lines.push('TZOFFSETFROM:-0600');
  lines.push('TZOFFSETTO:-0500');
  lines.push('TZNAME:CDT');
  lines.push('END:DAYLIGHT');
  lines.push('END:VTIMEZONE');

  // Each selected event → VEVENT
  selections.forEach(sel => {
    const { type, day, location, event } = sel;
    const dtstart = formatICSDate(day, event.start, year);
    const dtend = formatICSDate(day, event.end, year);
    if (!dtstart || !dtend) return;

    // Build a simple UID: dtstart‐location‐name@bonnaroo
    const safeName = event.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const safeLoc = location.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const uid = `${dtstart}-${safeLoc}-${safeName}@bonnaroo`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstart}`);
    lines.push(`DTSTART;TZID=America/Chicago:${dtstart}`);
    lines.push(`DTEND;TZID=America/Chicago:${dtend}`);
    lines.push(`SUMMARY:${event.name}`);
    lines.push(`LOCATION:${location} (${type})`);
    lines.push(
      `DESCRIPTION:Bonnaroo ${year}\\n` +
        `Artist/Event: ${event.name}\\n` +
        `Location: ${type}\\n` +
        `Sublocation: ${location}\\n` +
        `Start: ${event.start}\\n` +
        `End: ${event.end}`
    );
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
