import { jsPDF } from 'jspdf';
import { timeToMinutes, minutesToTime, mergeOverlapsWithDetail } from '../utils/timeUtils';
import { APP_TITLE_PLANNER, PDF_FILENAME_TEMPLATE } from '../config';

export function exportPlannerPDF({ selections, year, activeTab, grouped }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const type = activeTab;
  const days = Object.entries(grouped[type]);
  days.forEach(([day, locations], idx) => {
    if (idx > 0) doc.addPage();

    const stageNames = Object.keys(locations);
    // Build time grid
    let minTime = 1440, maxTime = 0;
    Object.values(locations).forEach(events => {
      events.forEach(ev => {
        const s = timeToMinutes(ev.start);
        const e = timeToMinutes(ev.end);
        minTime = Math.min(minTime, s);
        maxTime = Math.max(maxTime, e);
      });
    });
    minTime = Math.floor(minTime / 15) * 15;
    maxTime = Math.ceil(maxTime / 15) * 15;

    // Prepare event matrix for rowspans
    const matrix = [];
    const eventMatrix = [];
    for (let tm = minTime; tm < maxTime; tm += 15) {
      const row = [];
      const eventRow = [];
      stageNames.forEach(stg => {
        const events = mergeOverlapsWithDetail(locations[stg] || []);
        const found = events.find(ev =>
          timeToMinutes(ev.start) <= tm && timeToMinutes(ev.end) > tm
        );
        row.push(found ? found : null);
        eventRow.push(found ? `${found.name} (${evTimeRange(found)})` : '');
      });
      matrix.push(row);
      eventMatrix.push(eventRow);
    }

    // Draw header
    let x = 40, y = 70;
    const cellHeight = 20;
    const cellWidth = 100;
    doc.setFontSize(16);
    doc.text(APP_TITLE_PLANNER.replace('{year}', year).replace('{tab}', activeTab), 300, 40, { align: 'center' });
    doc.setFontSize(14);
    doc.text(day, x, y - 20);

    // Draw table header
    doc.setFontSize(10);
    doc.text('Time', x, y);
    stageNames.forEach((stg, i) => {
      doc.text(stg, x + cellWidth * (i + 1), y);
    });

    // Track rowspans
    const rowSpanTrack = Array(stageNames.length).fill(0);

    // Draw table body
    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      const tm = minTime + rowIdx * 15;
      y += cellHeight;
      doc.setFontSize(10);
      doc.text(minutesToTime(tm), x, y + cellHeight / 2 - 5);

      stageNames.forEach((stg, colIdx) => {
        if (rowSpanTrack[colIdx] > 0) {
          rowSpanTrack[colIdx]--;
          return;
        }
        const ev = matrix[rowIdx][colIdx];
        if (ev) {
          // Only draw if this is the first row for this event
          if (timeToMinutes(ev.start) === tm) {
            const span = (timeToMinutes(ev.end) - timeToMinutes(ev.start)) / 15;
            doc.rect(x + cellWidth * (colIdx + 1), y, cellWidth, cellHeight * span);
            doc.text(`${ev.name} (${ev.start}–${ev.end})`, x + cellWidth * (colIdx + 1) + 2, y + 12, { maxWidth: cellWidth - 4 });
            rowSpanTrack[colIdx] = span - 1;
          }
        } else {
          // Draw empty cell
          doc.rect(x + cellWidth * (colIdx + 1), y, cellWidth, cellHeight);
        }
      });
    }
  });

  const fileName = PDF_FILENAME_TEMPLATE
    .replace('{year}', year)
    .replace('{tab}', activeTab);

  doc.save(fileName);

  function evTimeRange(ev) {
    return `${ev.start} – ${ev.end}`;
  }
}