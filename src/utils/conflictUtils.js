import { timeToMinutes } from './timeUtils';

export function getSelectionKey(sel) {
  return `${sel.type}|${sel.day}|${sel.location}|${sel.event.name}|${sel.event.start}`;
}

export function detectConflicts(selections, year) {
  const conflictKeys = new Set();

  // Group by day only so cross-stage (Centeroo vs Outeroo) overlaps are also detected
  const groups = {};
  selections.forEach(sel => {
    const key = sel.day;
    groups[key] = groups[key] || [];
    groups[key].push(sel);
  });

  Object.values(groups).forEach(group => {
    const sorted = [...group].sort(
      (a, b) => timeToMinutes(a.event.start, year) - timeToMinutes(b.event.start, year)
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const aEnd = timeToMinutes(a.event.end, year);

      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j];
        const bStart = timeToMinutes(b.event.start, year);

        if (bStart >= aEnd) break;

        conflictKeys.add(getSelectionKey(a));
        conflictKeys.add(getSelectionKey(b));
      }
    }
  });

  return conflictKeys;
}
