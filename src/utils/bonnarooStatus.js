import {
  dayOffsets,
  BONNAROO_STATUS_ENDED_TEMPLATE,
  BONNAROO_STATUS_NOT_STARTED_TEMPLATE,
  BONNAROO_STATUS_STARTED_TEMPLATE
} from '../config';
import { getFestivalMonday } from './timeUtils';

export function getBonnarooEventDates(year, scheduleData) {
  if (!scheduleData) return {};

  // Gather all unique days with events from both Centeroo and Outeroo
  const allDays = new Set();
  ['Centeroo', 'Outeroo'].forEach(tab => {
    const tabData = scheduleData[tab];
    if (tabData) {
      Object.keys(tabData).forEach(day => allDays.add(day));
    }
  });

  if (!allDays.size) return {};

  // Map day names to actual dates
  const baseDateStr = getFestivalMonday(year);
  const baseDate = new Date(`${baseDateStr}T00:00:00`);
  const dayDates = Array.from(allDays).map(day => {
    const offset = dayOffsets[day];
    if (typeof offset !== 'number') return null;
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + offset);
    return d;
  }).filter(Boolean);

  if (!dayDates.length) return {};

  // Find earliest and latest dates
  const minDate = new Date(Math.min(...dayDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dayDates.map(d => d.getTime())));
  return { start: minDate, end: maxDate };
}

export function getBonnarooStatus(year, scheduleData) {
  const { start, end } = getBonnarooEventDates(year, scheduleData);
  if (!start || !end) return null;

  let now = new Date();
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('now')) {
      const spoof = new Date(params.get('now'));
      if (!isNaN(spoof)) now = spoof;
    }
  }

  if (now > end) {
    return BONNAROO_STATUS_ENDED_TEMPLATE.replace('{year}', year);
  }
  if (now < start) {
    const dateStr = start.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    return BONNAROO_STATUS_NOT_STARTED_TEMPLATE
      .replace('{year}', year)
      .replace('{date}', dateStr);
  }
  return BONNAROO_STATUS_STARTED_TEMPLATE.replace('{year}', year);
}