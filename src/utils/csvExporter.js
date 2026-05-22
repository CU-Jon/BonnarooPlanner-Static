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
    return timeToMinutes(a.event.start, year) - timeToMinutes(b.event.start, year);
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

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n');
  return '\uFEFF' + csv;
}

export function generatePackingCSV(selectedCategories) {
  if (!selectedCategories.length) return '\uFEFF';

  const headers = selectedCategories.map(cat => cat.name);
  const maxItems = Math.max(...selectedCategories.map(cat => cat.items.length));

  const rows = [headers];
  for (let i = 0; i < maxItems; i++) {
    rows.push(selectedCategories.map(cat => cat.items[i]?.name ?? ''));
  }

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n');
  return '\uFEFF' + csv;
}