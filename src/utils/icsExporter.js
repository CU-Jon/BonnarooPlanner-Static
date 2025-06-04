import {
  bonnarooStartMonday,
  dayOffsets,
  LATE_NIGHT_CUTOFF,
  ICS_CALENDARNAME_TEMPLATE
} from '../config';
import { timeToMinutes } from './timeUtils';

/**
 * Converts “Day” + “hh:mm AM/PM” into an ICS datetime string.
 */
export function formatICSDate(day, time, year) {
  const dayName = day.match(/^([A-Za-z]+)/)[1];
  const baseDateStr = bonnarooStartMonday[year];
  const baseDate = new Date(`${baseDateStr}T00:00:00`);
  const eventDate = new Date(baseDate);
  eventDate.setDate(baseDate.getDate() + dayOffsets[dayName]);
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3];
  if (/PM/i.test(ampm) && h !== 12) h += 12;
  if (/AM/i.test(ampm) && h === 12) h = 0;
  // If before cutoff (7:00 AM), bump to next day:
  if ((h * 60 + m) < LATE_NIGHT_CUTOFF) {
    eventDate.setDate(eventDate.getDate() + 1);
  }
  const pad = n => n.toString().padStart(2, '0');
  return `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(
    eventDate.getDate()
  )}T${pad(h)}${pad(m)}00`;
}

/**
 * @param {Array<{ type, day, location, event: {name,start,end} }>} selections
 * @param {number} year
 * @param {string} activeTab  // "Centeroo" or "Outeroo"
 */
export function generateICS(selections, year, activeTab) {
  const calendarName = ICS_CALENDARNAME_TEMPLATE
    .replace('{year}', year)
    .replace('{tab}', activeTab);

  const lines = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push(`X-WR-CALNAME:${calendarName}`);
  lines.push(`NAME:${calendarName}`);
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Bonnaroo Planner//EN');

  // VTIMEZONE block for America/Chicago (identical to your original)
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

  // For each selected event, create a VEVENT with LOCATION + DESCRIPTION
  selections.forEach(sel => {
    const { type, day, location, event } = sel;
    const dtstart = formatICSDate(day, event.start, year);
    const dtend = formatICSDate(day, event.end, year);
    if (!dtstart || !dtend) return;

    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTAMP:${dtstart}`);
    lines.push(`DTSTART;TZID=America/Chicago:${dtstart}`);
    lines.push(`DTEND;TZID=America/Chicago:${dtend}`);
    lines.push(`SUMMARY:${event.name}`);
    lines.push(`LOCATION:${location} (${type})`);
    // DESCRIPTION matches your original formatting (escaped newline as \n):
    lines.push(
      `DESCRIPTION:Bonnaroo ${year}\\nArtist/Event: ${event.name}\\nLocation: ${type}\\nSublocation: ${location}\\nStart: ${event.start}\\nEnd: ${event.end}`
    );
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
