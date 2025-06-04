import { bonnarooStartMonday, dayOffsets } from '../config';
import { timeToMinutes } from './timeUtils';

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
  if ((h * 60 + m) < 7 * 60) eventDate.setDate(eventDate.getDate() + 1);
  const pad = n => n.toString().padStart(2, '0');
  return `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}T${pad(h)}${pad(m)}00`;
}

export function generateICS(events, year) {
  const lines = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Bonnaroo Planner//EN');
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

  events.forEach(ev => {
    const dtstart = formatICSDate(ev.day, ev.start, ev.year);
    const dtend = formatICSDate(ev.day, ev.end, ev.year);
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTAMP:${dtstart}`);
    lines.push(`DTSTART;TZID=America/Chicago:${dtstart}`);
    lines.push(`DTEND;TZID=America/Chicago:${dtend}`);
    lines.push(`SUMMARY:${ev.name}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}