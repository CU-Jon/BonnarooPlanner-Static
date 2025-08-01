// src/components/PlannerView.js
import React, { useEffect } from 'react';
import {
  timeToMinutes,
  mergeOverlapsWithDetail,
  minutesToTime
} from '../utils/timeUtils';
import { generateICS } from '../utils/icsExporter';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PDF_FILENAME_TEMPLATE,
  CSV_FILENAME_TEMPLATE,
  ICS_FILENAME_TEMPLATE,
  APP_TITLE_PLANNER,
  SHOW_PRINT_BUTTON
} from '../config';
import { generateCSV } from '../utils/csvExporter';

export default function PlannerView({ selections, year, activeTab, onRestart }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Group selections by type → day → location
  const grouped = {};
  selections.forEach(sel => {
    grouped[sel.type] = grouped[sel.type] || {};
    grouped[sel.type][sel.day] = grouped[sel.type][sel.day] || {};
    grouped[sel.type][sel.day][sel.location] =
      grouped[sel.type][sel.day][sel.location] || [];
    grouped[sel.type][sel.day][sel.location].push(sel.event);
  });

  function buildTable(type) {
    return Object.entries(grouped[type]).map(([day, locations]) => {
      const stageNames = Object.keys(locations);
      const timeGrid = {};

      Object.entries(locations).forEach(([loc, events]) => {
        events.forEach(ev => {
          const s = timeToMinutes(ev.start);
          const e = timeToMinutes(ev.end);
          timeGrid[day] = timeGrid[day] || { start: 1440, end: 0 };
          timeGrid[day].start = Math.min(timeGrid[day].start, s);
          timeGrid[day].end = Math.max(timeGrid[day].end, e);
        });
      });

      // Round to nearest 15-minute increments
      timeGrid[day].start = Math.floor(timeGrid[day].start / 15) * 15;
      timeGrid[day].end = Math.ceil(timeGrid[day].end / 15) * 15;

      return (
        <React.Fragment key={`${type}-${day}`}>
          <h2 className="day-heading-screen">{day}</h2>
          <table className="day-section" data-day={day}>
            <thead>
              <tr className="day-heading-print">
                <th colSpan={stageNames.length + 1}>{day}</th>
              </tr>
              <tr>
                <th>Time</th>
                {stageNames.map(stg => (
                  <th key={stg}>{stg}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = [];
                const stageEvents = {};
                stageNames.forEach(stg => {
                  stageEvents[stg] = mergeOverlapsWithDetail(locations[stg]);
                });
                const rowSpanTracker = {};

                for (
                  let tm = timeGrid[day].start;
                  tm < timeGrid[day].end;
                  tm += 15
                ) {
                  const cells = [];
                  // Left-most time label
                  cells.push(
                    <td className="left-time-col" key={`${day}-time-${tm}`}>
                      {minutesToTime(tm)}
                    </td>
                  );

                  stageNames.forEach(stg => {
                    if (rowSpanTracker[stg] > 0) {
                      rowSpanTracker[stg]--;
                      return;
                    }
                    const found = stageEvents[stg].find(
                      ev => timeToMinutes(ev.start) === tm
                    );
                    if (found) {
                      const span =
                        (timeToMinutes(found.end) -
                          timeToMinutes(found.start)) /
                        15;
                      cells.push(
                        <td
                          key={`${day}-${stg}-${tm}`}
                          rowSpan={span}
                          dangerouslySetInnerHTML={{ __html: found.name }}
                        ></td>
                      );
                      rowSpanTracker[stg] = span - 1;
                    } else {
                      cells.push(<td key={`${day}-${stg}-${tm}`}></td>);
                    }
                  });

                  rows.push(<tr key={`${day}-row-${tm}`}>{cells}</tr>);
                }
                return rows;
              })()}
            </tbody>
          </table>
          <br />
        </React.Fragment>
      );
    });
  }

  function downloadPDF(orientation = 'portrait') {
    const TABLE_MARGIN = 70; // Single source of truth for margin
    const FOOTER_MARGIN_BOTTOM = 20;

    const fileName = PDF_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{tab}', activeTab)
      .replace('{orientation}', orientation);

    const plannerTitle = APP_TITLE_PLANNER
      .replace('{year}', year)
      .replace('{tab}', activeTab);

    const doc = new jsPDF({
      orientation,
      unit: 'pt',
      format: 'letter'
    });

    const tables = document.querySelectorAll('.day-section');
    tables.forEach((table, idx) => {
      if (idx > 0) doc.addPage();
      const day = table.dataset.day;
      const firstPage = doc.internal.getNumberOfPages();
      autoTable(doc, {
        html: table,
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        startY: TABLE_MARGIN,
        margin: { top: TABLE_MARGIN },
        theme: 'grid',
        headStyles: { fillColor: [106, 13, 173], fontStyle: 'bold' },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          halign: 'center',
          valign: 'middle'
        },
        didDrawPage: data => {
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageInfo = doc.internal.getCurrentPageInfo();
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text(plannerTitle, pageWidth / 2, 30, { align: 'center' });
          doc.setFontSize(18);
          if (pageInfo.pageNumber === firstPage) {
            doc.text(day, 40, 50);
          } else {
            doc.text(`${day} (Continued)`, 40, 50);
          }
        }
      });
    });

    // --- Add Page X of Y footer after all pages are generated ---
    const pageCount = doc.internal.getNumberOfPages();

    // Set footer style once
    doc.setFontSize(10);
    doc.setTextColor(100);

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - TABLE_MARGIN,
        pageHeight - FOOTER_MARGIN_BOTTOM,
        { align: 'right' }
      );
    }

    doc.save(fileName);
  }

  function exportICS() {
    const fileName = ICS_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{tab}', activeTab);

    const icsData = generateICS(selections, year, activeTab);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportCSV() {
    const fileName = CSV_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{tab}', activeTab);
    
    const csvData = generateCSV(selections, year, activeTab);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container" id="plannerView">
      <h3 className="print-instructions">
        Scroll down to save to PDF, CSV, or export to your calendar!
      </h3>

      {buildTable(activeTab)}

      <div>
        {SHOW_PRINT_BUTTON && (
          <button id="printButton" onClick={() => window.print()}>
            Print
          </button>
        )}
        <button id="pdfButtonPortrait" onClick={() => downloadPDF('portrait')}>
          Download as PDF (Portrait)
        </button>
        <button id="pdfButtonLandscape" onClick={() => downloadPDF('landscape')}>
          Download as PDF (Landscape)
        </button>
        <button id="icsButton" onClick={exportICS}>
          Export to Calendar (.ics)
        </button>
        <button id="csvButton" onClick={exportCSV}>
          Export to CSV
        </button>
        {/* Ensure type="button" so CSS styling applies */}
        <button id="startOver" type="button" onClick={onRestart}>
          Start Over
        </button>
      </div>
    </div>
  );
}
