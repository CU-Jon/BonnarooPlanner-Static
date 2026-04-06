// src/components/PlannerBuilder.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import YearSelector from './YearSelector';
import TabContainer from './TabContainer';
import SelectionGrid from './SelectionGrid';
import { getBonnarooStatus } from '../utils/bonnarooStatus';
import { SCHEDULE_NOT_AVAILABLE_TEMPLATE, PARTIAL_SCHEDULE_NOT_AVAILABLE_TEMPLATE } from '../config';
import { detectConflicts } from '../utils/conflictUtils';

function getStatusClass(roostatus) {
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
  initialSelections,
  lastModified,
  onLoad
}) {
  const [scheduleData, setScheduleData] = useState(() => initialSchedule || { Centeroo: null, Outeroo: null });
  const [activeTab, setActiveTab] = useState(() => {
    const data = initialSchedule || { Centeroo: null, Outeroo: null };
    const centerooAvail = data.Centeroo && Object.keys(data.Centeroo).length > 0;
    return centerooAvail ? 'Centeroo' : 'Outeroo';
  });
  const [currentSelections, setCurrentSelections] = useState(() => initialSelections || []);
  const hasInitializedSchedule = useRef(false);

  useEffect(() => {
    const newData = initialSchedule || { Centeroo: null, Outeroo: null };
    setScheduleData(newData);
    const centerooAvail = newData.Centeroo && Object.keys(newData.Centeroo).length > 0;
    setActiveTab(centerooAvail ? 'Centeroo' : 'Outeroo');
    if (hasInitializedSchedule.current) {
      // Year changed after initial mount — clear selections for the new year
      setCurrentSelections([]);
    }
    hasInitializedSchedule.current = true;
  }, [initialSchedule]);

  useEffect(() => {
    setCurrentSelections(initialSelections || []);
  }, [initialSelections]);

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

  const centerooAvailable =
    !!scheduleData.Centeroo && Object.keys(scheduleData.Centeroo).length > 0;
  const outerooAvailable =
    !!scheduleData.Outeroo && Object.keys(scheduleData.Outeroo).length > 0;

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
    const isAvail = activeTab === 'Centeroo' ? centerooAvailable : outerooAvailable;
    if (!isAvail) return;
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

  if (!initialSchedule) {
    return null;
  }

  const bothMissing = !centerooAvailable && !outerooAvailable;

  if (bothMissing) {
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
  const statusClass = getStatusClass(roostatus);
  const totalCount = currentSelections.length;
  const conflictCount = conflictKeys.size;
  const activeTabAvailable = activeTab === 'Centeroo' ? centerooAvailable : outerooAvailable;
  const inactiveTab = activeTab === 'Centeroo' ? 'Outeroo' : 'Centeroo';

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
          <button type="button" className="btn btn-load" onClick={onLoad}>
            Load Plan
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

      {activeTabAvailable ? (
        <SelectionGrid
          data={scheduleData[activeTab]}
          type={activeTab}
          currentSelections={currentSelections}
          onToggleSelection={toggleSelection}
          conflictKeys={conflictKeys}
        />
      ) : (
        <p className="bonnaroo-status bonnaroo-status--not-available">
          {PARTIAL_SCHEDULE_NOT_AVAILABLE_TEMPLATE
            .replace('{missing}', activeTab)
            .replace('{year}', year)
            .replace(/\{available\}/g, inactiveTab)}
        </p>
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
          Build My Planner
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </>
  );
}
