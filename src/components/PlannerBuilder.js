// src/components/PlannerBuilder.js
import React, { useState, useEffect, useMemo } from 'react';
import YearSelector from './YearSelector';
import TabContainer from './TabContainer';
import SelectionGrid from './SelectionGrid';
import { getBonnarooStatus } from '../utils/bonnarooStatus';
import { SCHEDULE_NOT_AVAILABLE_TEMPLATE } from '../config';
import { detectConflicts } from '../utils/conflictUtils';
import { buildShareURL } from '../utils/shareUtils';

function getStatusClass(roostatus, scheduleMissing) {
  if (scheduleMissing) return 'bonnaroo-status bonnaroo-status--not-available';
  if (!roostatus) return 'bonnaroo-status';
  if (roostatus.includes('has ended')) return 'bonnaroo-status bonnaroo-status--ended';
  if (roostatus.includes('has begun')) return 'bonnaroo-status bonnaroo-status--started';
  if (roostatus.includes('begins on')) return 'bonnaroo-status bonnaroo-status--not-started';
  return 'bonnaroo-status';
}

export default function PlannerBuilder({
  year,
  setYear,
  onBuild,
  initialSchedule,
  lastModified,
  onSave,
  onLoad
}) {
  const [scheduleData, setScheduleData] = useState({ Centeroo: null, Outeroo: null });
  const [activeTab, setActiveTab] = useState('Centeroo');
  const [currentSelections, setCurrentSelections] = useState([]);

  useEffect(() => {
    setScheduleData(initialSchedule || { Centeroo: null, Outeroo: null });
    setActiveTab('Centeroo');
    setCurrentSelections([]);
  }, [initialSchedule]);

  const conflictKeys = useMemo(
    () => detectConflicts(currentSelections),
    [currentSelections]
  );

  const selectionCounts = useMemo(
    () => ({
      Centeroo: currentSelections.filter(s => s.type === 'Centeroo').length,
      Outeroo: currentSelections.filter(s => s.type === 'Outeroo').length
    }),
    [currentSelections]
  );

  function toggleSelection(payload) {
    setCurrentSelections(prev => {
      const exists = prev.some(
        sel =>
          sel.type === payload.type &&
          sel.day === payload.day &&
          sel.location === payload.location &&
          sel.event.name === payload.event.name &&
          sel.event.start === payload.event.start
      );
      if (exists) {
        return prev.filter(
          sel =>
            !(
              sel.type === payload.type &&
              sel.day === payload.day &&
              sel.location === payload.location &&
              sel.event.name === payload.event.name &&
              sel.event.start === payload.event.start
            )
        );
      }
      return [...prev, payload];
    });
  }

  function selectAll() {
    if (!scheduleData[activeTab]) return;
    const all = [];
    const data = scheduleData[activeTab];
    Object.entries(data).forEach(([day, locations]) => {
      Object.entries(locations).forEach(([loc, events]) => {
        events.forEach(ev =>
          all.push({ type: activeTab, day, location: loc, event: ev })
        );
      });
    });
    setCurrentSelections(prev => {
      const outside = prev.filter(sel => sel.type !== activeTab);
      return [...outside, ...all];
    });
  }

  function deselectAll() {
    setCurrentSelections(prev => prev.filter(sel => sel.type !== activeTab));
  }

  function handleBuild() {
    if (!currentSelections.length) {
      alert('Please pick at least one event!');
      return;
    }
    onBuild(currentSelections, year);
  }

  function handleShare() {
    if (!currentSelections.length) {
      alert('Select at least one event to share.');
      return;
    }
    const url = buildShareURL(currentSelections, year);
    navigator.clipboard.writeText(url).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this share link:', url);
    });
  }

  if (!initialSchedule) {
    return null;
  }

  const scheduleMissing =
    !scheduleData.Centeroo ||
    !scheduleData.Outeroo ||
    Object.keys(scheduleData.Centeroo).length === 0 ||
    Object.keys(scheduleData.Outeroo).length === 0;

  if (scheduleMissing) {
    return (
      <>
        <div className="builder-toolbar">
          <div className="builder-toolbar-left">
            <YearSelector onYearChange={setYear} defaultYear={year} />
          </div>
        </div>
        <p className="bonnaroo-status bonnaroo-status--not-available">
          {SCHEDULE_NOT_AVAILABLE_TEMPLATE.replace('{year}', year)}
        </p>
      </>
    );
  }

  const roostatus = getBonnarooStatus(year, scheduleData);
  const statusClass = getStatusClass(roostatus, scheduleMissing);
  const totalCount = currentSelections.length;
  const conflictCount = conflictKeys.size;

  return (
    <>
      <div className="builder-toolbar">
        <div className="builder-toolbar-left">
          <YearSelector onYearChange={setYear} defaultYear={year} />
          {lastModified && (
            <span className="last-updated">Updated: {lastModified}</span>
          )}
        </div>
        <div className="builder-toolbar-right">
          <button
            type="button"
            className="btn btn-save"
            onClick={onSave}
            disabled={!totalCount}
          >
            Save Plan
          </button>
          <button type="button" className="btn btn-load" onClick={onLoad}>
            Load Plan
          </button>
          <button
            type="button"
            className="btn btn-share"
            onClick={handleShare}
            disabled={!totalCount}
          >
            Share Link
          </button>
        </div>
      </div>

      {roostatus && (
        <div className={statusClass}>{roostatus}</div>
      )}

      {conflictCount > 0 && (
        <div className="conflict-warning-box">
          ⚠ {conflictCount} event{conflictCount !== 1 ? 's' : ''} have scheduling conflicts
        </div>
      )}

      <TabContainer
        activeTab={activeTab}
        onTabClick={setActiveTab}
        selectionCounts={selectionCounts}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" className="btn btn-select-all" onClick={selectAll}>
          Select All
        </button>
        <button type="button" className="btn btn-deselect-all" onClick={deselectAll}>
          Deselect All
        </button>
      </div>

      {scheduleData[activeTab] && (
        <SelectionGrid
          data={scheduleData[activeTab]}
          type={activeTab}
          currentSelections={currentSelections}
          onToggleSelection={toggleSelection}
          conflictKeys={conflictKeys}
        />
      )}

      <div className="builder-bottom-padding" />

      <div className="selection-summary-bar">
        <span className="summary-text">
          {totalCount} event{totalCount !== 1 ? 's' : ''} selected
          {conflictCount > 0 && (
            <span className="conflict-count">
              &nbsp;&nbsp;⚠ {conflictCount} conflict{conflictCount !== 1 ? 's' : ''}
            </span>
          )}
        </span>
        <button
          type="button"
          className="btn btn-build"
          onClick={handleBuild}
          disabled={!totalCount}
        >
          Build My Planner →
        </button>
      </div>
    </>
  );
}
