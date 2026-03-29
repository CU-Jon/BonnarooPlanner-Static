// src/components/PlannerView.js
import React, { useState, useEffect } from 'react';
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
  SHOW_PRINT_BUTTON
} from '../config';
import { generateCSV } from '../utils/csvExporter';
import { buildShareURL } from '../utils/shareUtils';
import { detectConflicts, getSelectionKey } from '../utils/conflictUtils';

const TYPE_ORDER = ['Centeroo', 'Outeroo'];
const ORANGE = [242, 105, 34];
const DARK_BG = [30, 30, 30];
const CREAM = [248, 241, 212];
const BRONZE = [239, 227, 175];

export default function PlannerView({ selections, year, onRestart, onBack, onSave }) {
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const conflictKeys = detectConflicts(selections);
  const typesPresent = TYPE_ORDER.filter(t => selections.some(s => s.type === t));
  const typeLabel =
    typesPresent.length === 0
      ? 'Planner'
      : typesPresent.length === 1
        ? typesPresent[0]
        : 'Full';

  // Group selections by type → day → location
  const grouped = {};
  selections.forEach(sel => {
    grouped[sel.type] = grouped[sel.type] || {};
    grouped[sel.type][sel.day] = grouped[sel.type][sel.day] || {};
    grouped[sel.type][sel.day][sel.location] =
      grouped[sel.type][sel.day][sel.location] || [];
    grouped[sel.type][sel.day][sel.location].push(sel.event);
  });

  function buildTableForType(type) {
    if (!grouped[type]) return null;
    return Object.entries(grouped[type]).map(([day, locations]) => {
      const stageNames = Object.keys(locations);
      const timeGrid = { start: 1440, end: 0 };

      Object.entries(locations).forEach(([, events]) => {
        events.forEach(ev => {
          const s = timeToMinutes(ev.start);
          const e = timeToMinutes(ev.end);
          timeGrid.start = Math.min(timeGrid.start, s);
          timeGrid.end = Math.max(timeGrid.end, e);
        });
      });

      timeGrid.start = Math.floor(timeGrid.start / 15) * 15;
      timeGrid.end = Math.ceil(timeGrid.end / 15) * 15;

      return (
        <React.Fragment key={`${type}-${day}`}>
          <div className="day-heading-row">
            <span className="day-heading-screen">{day}</span>
          </div>
          <table className="day-section" data-day={day} data-type={type}>
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

                for (let tm = timeGrid.start; tm < timeGrid.end; tm += 15) {
                  const cells = [];
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
                        (timeToMinutes(found.end) - timeToMinutes(found.start)) / 15;
                      cells.push(
                        <td
                          key={`${day}-${stg}-${tm}`}
                          rowSpan={span}
                          dangerouslySetInnerHTML={{ __html: found.name }}
                        />
                      );
                      rowSpanTracker[stg] = span - 1;
                    } else {
                      cells.push(<td key={`${day}-${stg}-${tm}`} />);
                    }
                  });

                  rows.push(<tr key={`${day}-row-${tm}`}>{cells}</tr>);
                }
                return rows;
              })()}
            </tbody>
          </table>
        </React.Fragment>
      );
    });
  }

  function buildCompactForType(type) {
    if (!grouped[type]) return null;
    const typeSelections = selections.filter(s => s.type === type);
    const dayOrder = Object.keys(grouped[type]);

    const sorted = [...typeSelections].sort((a, b) => {
      const dA = dayOrder.indexOf(a.day);
      const dB = dayOrder.indexOf(b.day);
      if (dA !== dB) return dA - dB;
      return timeToMinutes(a.event.start) - timeToMinutes(b.event.start);
    });

    const byDay = {};
    sorted.forEach(sel => {
      byDay[sel.day] = byDay[sel.day] || [];
      byDay[sel.day].push(sel);
    });

    return Object.entries(byDay).map(([day, daySelections]) => (
      <React.Fragment key={`compact-${type}-${day}`}>
        <div className="day-heading-row">
          <span className="day-heading-screen">{day}</span>
          <span className="day-select-badge">{daySelections.length} selected</span>
        </div>
        <div className="compact-view-list">
          {daySelections.map((sel, idx) => {
            const key = getSelectionKey(sel);
            const isConflict = conflictKeys.has(key);
            return (
              <div
                key={idx}
                className="compact-event-card"
                style={isConflict ? { borderLeftColor: 'var(--roo-pink)' } : {}}
              >
                <span className="compact-event-name">
                  {sel.event.name}
                  {isConflict && (
                    <span className="conflict-badge" title="Scheduling conflict">
                      &nbsp;⚠
                    </span>
                  )}
                </span>
                <span className="compact-event-meta">
                  <span className="meta-time">
                    {sel.event.start} – {sel.event.end}
                  </span>
                  <span className="meta-loc">{sel.location}</span>
                </span>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    ));
  }

  function downloadPDF(orientation = 'portrait') {
    const TABLE_MARGIN = 70;
    const FOOTER_MARGIN_BOTTOM = 20;

    const fileName = PDF_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{label}', typeLabel)
      .replace('{orientation}', orientation);

    const plannerTitle = `Bonnaroo ${year} Planner \u2014 ${typeLabel}`;

    const doc = new jsPDF({ orientation, unit: 'pt', format: 'letter' });
    const tables = document.querySelectorAll('.day-section');

    tables.forEach((table, idx) => {
      if (idx > 0) doc.addPage();
      const day = table.dataset.day;
      const tableType = table.dataset.type || typeLabel;
      const firstPage = doc.internal.getNumberOfPages();

      autoTable(doc, {
        html: table,
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        startY: TABLE_MARGIN,
        margin: { top: TABLE_MARGIN },
        theme: 'grid',
        headStyles: {
          fillColor: ORANGE,
          textColor: DARK_BG,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [32, 32, 32] },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          halign: 'center',
          valign: 'middle',
          fillColor: DARK_BG,
          textColor: CREAM
        },
        columnStyles: {
          0: {
            fillColor: [20, 20, 20],
            textColor: BRONZE,
            fontStyle: 'bold',
            cellWidth: 50
          }
        },
        didDrawPage: () => {
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageInfo = doc.internal.getCurrentPageInfo();
          doc.setFontSize(12);
          doc.setTextColor(...ORANGE);
          doc.text(plannerTitle, pageWidth / 2, 26, { align: 'center' });
          doc.setFontSize(16);
          doc.setTextColor(...CREAM);
          const dayLabel =
            pageInfo.pageNumber === firstPage
              ? `${tableType} \u2014 ${day}`
              : `${tableType} \u2014 ${day} (Continued)`;
          doc.text(dayLabel, 40, 52);
          doc.setDrawColor(...ORANGE);
          doc.setLineWidth(1.5);
          doc.line(40, 58, pageWidth - 40, 58);
        }
      });
    });

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(150);
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
    const icsLabel =
      typesPresent.length === 1 ? typesPresent[0] : 'Centeroo & Outeroo';
    const fileName = ICS_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{tab}', typeLabel);
    const icsData = generateICS(selections, year, icsLabel);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function exportCSV() {
    const fileName = CSV_FILENAME_TEMPLATE
      .replace('{year}', year)
      .replace('{tab}', typeLabel);
    const csvData = generateCSV(selections, year);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function handleShare() {
    const url = buildShareURL(selections, year);
    navigator.clipboard.writeText(url).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this share link:', url);
    });
  }

  return (
    <>
      <div className="builder-toolbar no-print">
        <div className="builder-toolbar-left">
          <button type="button" className="btn btn-back" onClick={onBack}>
            &larr; Edit Selections
          </button>
        </div>
        <div className="builder-toolbar-right">
          <button type="button" className="btn btn-save" onClick={onSave}>
            Save Plan
          </button>
          <button type="button" className="btn btn-share" onClick={handleShare}>
            Share Link
          </button>
        </div>
      </div>

      <div className="view-mode-toggle no-print">
        <button
          type="button"
          className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
        >
          Table View
        </button>
        <button
          type="button"
          className={`view-mode-btn ${viewMode === 'compact' ? 'active' : ''}`}
          onClick={() => setViewMode('compact')}
        >
          Compact View
        </button>
      </div>

      {typesPresent.map(type => (
        <React.Fragment key={type}>
          {typesPresent.length > 1 && (
            <h2 className="planner-type-header">{type}</h2>
          )}
          {viewMode === 'table'
            ? buildTableForType(type)
            : buildCompactForType(type)}
        </React.Fragment>
      ))}

      <div className="planner-actions no-print">
        {SHOW_PRINT_BUTTON && (
          <button
            type="button"
            className="btn btn-print"
            onClick={() => window.print()}
          >
            Print
          </button>
        )}
        <button
          type="button"
          className="btn btn-pdf"
          onClick={() => downloadPDF('portrait')}
        >
          PDF (Portrait)
        </button>
        <button
          type="button"
          className="btn btn-pdf"
          onClick={() => downloadPDF('landscape')}
        >
          PDF (Landscape)
        </button>
        <button type="button" className="btn btn-ics" onClick={exportICS}>
          Export to Calendar (.ics)
        </button>
        <button type="button" className="btn btn-csv" onClick={exportCSV}>
          Export to CSV
        </button>
        <button type="button" className="btn btn-start-over" onClick={onRestart}>
          Start Over
        </button>
      </div>
    </>
  );
}

