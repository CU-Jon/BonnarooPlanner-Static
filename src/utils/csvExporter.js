import { timeToMinutes } from './timeUtils';
import { dayOffsets } from '../config';

const DAY_ORDER = Object.keys(dayOffsets);

export function generateCSV(selections, year) {
  const rows = [
    ['Artist/Event', 'Location', 'Sublocation', 'Day', 'Start', 'End']
  ];

  // Sort by day, then by event start time (ignoring sublocation)
  const sorted = [...selections].sort((a, b) => {
    const dayA = DAY_ORDER.indexOf(a.day);
    const dayB = DAY_ORDER.indexOf(b.day);
    if (dayA !== dayB) {
      return dayA - dayB;
    }
    return timeToMinutes(a.event.start) - timeToMinutes(b.event.start);
  });

  sorted.forEach(sel => {
    rows.push([
      sel.event.name,
      sel.type,
      sel.location,
      sel.day,
      sel.event.start,
      sel.event.end
    ]);
  });

  return rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n');
}