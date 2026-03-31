// src/components/PlannerView.js
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
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
  SHOW_PRINT_BUTTON,
  dayOffsets
} from '../config';
import { generateCSV } from '../utils/csvExporter';
import { buildShareURL } from '../utils/shareUtils';
import { detectConflicts, getSelectionKey } from '../utils/conflictUtils';

const TYPE_ORDER = ['Centeroo', 'Outeroo'];
const DAY_ORDER = Object.keys(dayOffsets);
const ORANGE = [242, 105, 34];
const PDF_WHITE = [255, 255, 255];
const PDF_LIGHT_ROW = [247, 247, 247];
const PDF_TIME_BG = [255, 237, 220];
const PDF_DARK_TEXT = [30, 30, 30];
const PDF_TIME_TEXT = [160, 60, 0];
const PDF_EVENT_BG = [255, 237, 209];
const PDF_EVENT_TEXT = [120, 40, 0];

export default function PlannerView({ selections, year, onRestart, onBack, onSave }) {
  const [viewMode, setViewMode] = useState('table');
  const [sharePopoverVisible, setSharePopoverVisible] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareURL, setShareURL] = useState('');
  const shareWrapperRef = useRef(null);
  const shareInputRef = useRef(null);
  const sharePopoverRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!sharePopoverVisible) return;
    function handleClickOutside(e) {
      if (shareWrapperRef.current && !shareWrapperRef.current.contains(e.target)) {
        setSharePopoverVisible(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSharePopoverVisible(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sharePopoverVisible]);

  useLayoutEffect(() => {
    if (!sharePopoverVisible || !sharePopoverRef.current) return;
    const el = sharePopoverRef.current;
    el.style.transform = '';
    const rect = el.getBoundingClientRect();
    if (rect.left < 8) {
      el.style.transform = `translateX(${8 - rect.left}px)`;
    }
  }, [sharePopoverVisible]);

  const conflictKeys = useMemo(() => detectConflicts(selections), [selections]);
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

    const sorted = [...typeSelections].sort((a, b) => {
      const dA = DAY_ORDER.indexOf(a.day);
      const dB = DAY_ORDER.indexOf(b.day);
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
                key={key}
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

  function buildPDFTableData(type, day) {
    if (!grouped[type] || !grouped[type][day]) return null;

    const locations = grouped[type][day];
    const stageNames = Object.keys(locations);

    let minTime = 1440;
    let maxTime = 0;
    Object.values(locations).forEach(events => {
      events.forEach(ev => {
        minTime = Math.min(minTime, timeToMinutes(ev.start));
        maxTime = Math.max(maxTime, timeToMinutes(ev.end));
      });
    });
    minTime = Math.floor(minTime / 15) * 15;
    maxTime = Math.ceil(maxTime / 15) * 15;

    const stageEventsMap = {};
    stageNames.forEach(stg => {
      stageEventsMap[stg] = mergeOverlapsWithDetail(locations[stg]);
    });

    const timeSlots = (maxTime - minTime) / 15;

    // Per-stage, per-slot state: 'start' | 'continue' | 'empty'
    const stageCells = stageNames.map(stg => {
      const evList = stageEventsMap[stg];
      return Array.from({ length: timeSlots }, (_, i) => {
        const tm = minTime + i * 15;
        const startEv = evList.find(e => timeToMinutes(e.start) === tm);
        if (startEv) {
          const cleanName = startEv.name
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?small>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
          return { state: 'start', content: cleanName };
        }
        const activeEv = evList.find(
          e => timeToMinutes(e.start) < tm && timeToMinutes(e.end) > tm
        );
        return activeEv
          ? { state: 'continue', content: '' }
          : { state: 'empty', content: '' };
      });
    });

    const columns = ['Time', ...stageNames];
    const body = [];
    const cellStateMap = [];

    for (let rowIdx = 0; rowIdx < timeSlots; rowIdx++) {
      const row = [{ content: minutesToTime(minTime + rowIdx * 15) }];
      const rowStates = [null];
      stageNames.forEach((_, sIdx) => {
        const c = stageCells[sIdx][rowIdx];
        row.push({ content: c.content });
        rowStates.push(c.state);
      });
      body.push(row);
      cellStateMap.push(rowStates);
    }

    return { columns, body, cellStateMap };
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
    let pageIdx = 0;

    typesPresent.forEach(type => {
      if (!grouped[type]) return;
      Object.keys(grouped[type]).forEach(day => {
        if (pageIdx > 0) doc.addPage();
        pageIdx++;

        const tableData = buildPDFTableData(type, day);
        if (!tableData) return;

        const { columns, body, cellStateMap } = tableData;
        const firstPage = doc.internal.getNumberOfPages();

        autoTable(doc, {
          columns,
          body,
          pageBreak: 'auto',
          rowPageBreak: 'avoid',
          startY: TABLE_MARGIN,
          margin: { top: TABLE_MARGIN },
          theme: 'grid',
          headStyles: {
            fillColor: ORANGE,
            textColor: PDF_WHITE,
            fontStyle: 'bold'
          },
          alternateRowStyles: { fillColor: PDF_LIGHT_ROW },
          styles: {
            font: 'helvetica',
            fontSize: 9,
            halign: 'center',
            valign: 'middle',
            fillColor: PDF_WHITE,
            textColor: PDF_DARK_TEXT
          },
          columnStyles: {
            0: {
              fillColor: PDF_TIME_BG,
              textColor: PDF_TIME_TEXT,
              fontStyle: 'bold',
              cellWidth: 50
            }
          },
          didParseCell: (data) => {
            if (data.section !== 'body' || data.column.index === 0) return;
            const state = cellStateMap[data.row.index]?.[data.column.index];
            if (state === 'start' || state === 'continue') {
              data.cell.styles.fillColor = PDF_EVENT_BG;
              data.cell.styles.textColor = PDF_EVENT_TEXT;
              data.cell.styles.valign = 'middle';
            }
            if (state === 'start') {
              data.cell.styles.overflow = 'linebreak';
              data.cell.styles.fontSize = 8;
              data.cell.styles.cellPadding = 3;
            }
          },
          didDrawCell: (data) => {
            if (data.section !== 'body' || data.column.index === 0) return;
            const state = cellStateMap[data.row.index]?.[data.column.index];
            if (state === 'continue') {
              // Overdraw the top border with the event bg color to visually
              // merge this cell with the event cell above it.
              data.doc.setDrawColor(...PDF_EVENT_BG);
              data.doc.setLineWidth(1.0);
              data.doc.line(
                data.cell.x,
                data.cell.y,
                data.cell.x + data.cell.width,
                data.cell.y
              );
            }
          },
          didDrawPage: () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageInfo = doc.internal.getCurrentPageInfo();
            doc.setFontSize(12);
            doc.setTextColor(...ORANGE);
            doc.text(plannerTitle, pageWidth / 2, 26, { align: 'center' });
            doc.setFontSize(16);
            doc.setTextColor(...PDF_DARK_TEXT);
            const dayLabel =
              pageInfo.pageNumber === firstPage
                ? `${type} \u2014 ${day}`
                : `${type} \u2014 ${day} (Continued)`;
            doc.text(dayLabel, 40, 52);
            doc.setDrawColor(...ORANGE);
            doc.setLineWidth(1.5);
            doc.line(40, 58, pageWidth - 40, 58);
          }
        });
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
    const csvData = generateCSV(selections);
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
    setShareURL(url);
    setShareCopied(false);
    setSharePopoverVisible(prev => !prev);
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(shareURL).then(() => {
      setShareCopied(true);
    }).catch(() => {
      if (shareInputRef.current) {
        shareInputRef.current.select();
      }
    });
  }

  return (
    <>
      <div className="builder-toolbar no-print">
        <div className="builder-toolbar-left" style={{ flexWrap: 'nowrap' }}>
          <button type="button" className="btn btn-back" onClick={onBack}>
            &larr; Edit Selections
          </button>
          <button type="button" className="btn btn-start-over" onClick={onRestart}>
            Start Over
          </button>
        </div>
        <div className="builder-toolbar-right">
          <button
            type="button"
            className="btn btn-save has-tooltip"
            onClick={onSave}
            data-tooltip="Saves your plan to a file on your device so you can pick up right where you left off. Next time you visit, hit &ldquo;Load Plan&rdquo; to bring your whole lineup back instantly."
          >
            Save Plan
          </button>
          <div className="share-popover-wrapper" ref={shareWrapperRef}>
            <button type="button" className="btn btn-share-link" onClick={handleShare}>
              Share Link
            </button>
            {sharePopoverVisible && (
              <div className="share-popover" role="dialog" aria-label="Share link" ref={sharePopoverRef}>
                <div className="share-popover-row">
                  <input
                    ref={shareInputRef}
                    type="text"
                    className="share-url-input"
                    value={shareURL}
                    readOnly
                    onFocus={e => e.target.select()}
                    aria-label="Share URL"
                  />
                  <button
                    type="button"
                    className={`btn-icon btn-copy${shareCopied ? ' copied' : ''}`}
                    onClick={handleCopyToClipboard}
                    aria-label={shareCopied ? 'Copied!' : 'Copy to clipboard'}
                    title={shareCopied ? 'Copied!' : 'Copy to clipboard'}
                  >
                    {shareCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                {shareCopied && (
                  <p className="share-copied-msg">Copied to clipboard!</p>
                )}
              </div>
            )}
          </div>
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


    </>
  );
}

