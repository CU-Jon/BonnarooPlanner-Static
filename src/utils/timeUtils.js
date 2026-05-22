import { lateNightCutoffs, bonnarooMondayOverrides } from '../config';

export function timeToMinutes(time, year) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];
  if (/PM/i.test(ampm) && hours !== 12) hours += 12;
  if (/AM/i.test(ampm) && hours === 12) hours = 0;
  let total = hours * 60 + minutes;
  const cutoff = lateNightCutoffs[year] || (7 * 60);
  if (total <= cutoff) total += 1440;
  return total;
}

export function minutesToTime(mins) {
  if (mins >= 1440) mins -= 1440;
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function mergeOverlapsWithDetail(events, year) {
  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.start, year) - timeToMinutes(b.start, year)
  );
  const buckets = [];
  sorted.forEach(ev => {
    const s = timeToMinutes(ev.start, year);
    const e = timeToMinutes(ev.end, year);
    if (!buckets.length || s >= buckets[buckets.length - 1].end) {
      buckets.push({
        start: s,
        end: e,
        lines: [`${escapeHTML(ev.name)}<br><small>${escapeHTML(ev.start)} – ${escapeHTML(ev.end)}</small>`]
      });
    } else {
      const b = buckets[buckets.length - 1];
      b.end = Math.max(b.end, e);
      b.lines.push(`${escapeHTML(ev.name)}<br><small>${escapeHTML(ev.start)} – ${escapeHTML(ev.end)}</small>`);
    }
  });
  return buckets.map(b => ({
    name: b.lines.join('<br><br>'),
    start: minutesToTime(b.start),
    end: minutesToTime(b.end)
  }));
}

export function getFestivalMonday(year) {
  if (bonnarooMondayOverrides[year]) {
    return bonnarooMondayOverrides[year];
  }
  let sundayCount = 0;
  for (let day = 1; day <= 30; day++) {
    const d = new Date(year, 5, day); // June is month 5 (0-based)
    if (d.getMonth() !== 5) break;
    if (d.getDay() === 0) { // Sunday
      sundayCount++;
      if (sundayCount === 3) {
        const monday = new Date(d);
        monday.setDate(d.getDate() - 6);
        return monday.toISOString().slice(0, 10);
      }
    }
  }
  return null;
}
