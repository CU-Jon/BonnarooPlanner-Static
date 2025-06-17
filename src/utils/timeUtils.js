import { LATE_NIGHT_CUTOFF, bonnarooMondayOverrides } from '../config';

export function timeToMinutes(time) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];
  if (/PM/i.test(ampm) && hours !== 12) hours += 12;
  if (/AM/i.test(ampm) && hours === 12) hours = 0;
  let total = hours * 60 + minutes;
  if (total <= LATE_NIGHT_CUTOFF) total += 1440;
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

export function mergeOverlapsWithDetail(events) {
  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
  );
  const buckets = [];
  sorted.forEach(ev => {
    const s = timeToMinutes(ev.start);
    const e = timeToMinutes(ev.end);
    if (!buckets.length || s >= buckets[buckets.length - 1].end) {
      buckets.push({
        start: s,
        end: e,
        lines: [`${ev.name}<br><small>${ev.start} – ${ev.end}</small>`]
      });
    } else {
      const b = buckets[buckets.length - 1];
      b.end = Math.max(b.end, e);
      b.lines.push(`${ev.name}<br><small>${ev.start} – ${ev.end}</small>`);
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
