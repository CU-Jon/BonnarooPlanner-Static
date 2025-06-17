// src/components/PlannerBuilder.js
import React, { useState, useEffect } from 'react';
import YearSelector from './YearSelector';
import TabContainer from './TabContainer';
import SelectionGrid from './SelectionGrid';
import { getBonnarooStatus } from '../utils/bonnarooStatus';
import { SCHEDULE_NOT_AVAILABLE_TEMPLATE } from '../config';

function getStatusClass(roostatus, scheduleMissing) {
  if (scheduleMissing) return 'bonnaroo-status bonnaroo-status--not-available';
  if (!roostatus) return 'bonnaroo-status';
  if (roostatus.includes('has ended')) return 'bonnaroo-status bonnaroo-status--ended';
  if (roostatus.includes('has begun')) return 'bonnaroo-status bonnaroo-status--started';
  if (roostatus.includes('begins on')) return 'bonnaroo-status bonnaroo-status--not-started';
  return 'bonnaroo-status';
}

export default function PlannerBuilder({ year, setYear, onBuild, initialSchedule, lastModified }) {
  if (!initialSchedule) {
    return null;
  }

  const [scheduleData, setScheduleData] = useState({ Centeroo: null, Outeroo: null });
  const [activeTab, setActiveTab] = useState('Centeroo');
  const [currentSelections, setCurrentSelections] = useState([]);

  useEffect(() => {
    setScheduleData(initialSchedule || { Centeroo: null, Outeroo: null });
    setActiveTab('Centeroo');
    setCurrentSelections([]);
  }, [initialSchedule]);

  function toggleSelection(payload) {
    setCurrentSelections(prev => {
      const exists = prev.some(
        sel =>
          sel.type === payload.type &&
          sel.day === payload.day &&
          sel.location === payload.location &&
          sel.event.name === payload.event.name &&
          sel.event.start === payload.event.start &&
          sel.event.end === payload.event.end
      );
      if (exists) {
        return prev.filter(
          sel =>
            !(
              sel.type === payload.type &&
              sel.day === payload.day &&
              sel.location === payload.location &&
              sel.event.name === payload.event.name &&
              sel.event.start === payload.event.start &&
              sel.event.end === payload.event.end
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
        events.forEach(ev => all.push({ type: activeTab, day, location: loc, event: ev }));
      });
    });
    setCurrentSelections(prev => {
      const filteredOutside = prev.filter(sel => sel.type !== activeTab);
      return [...filteredOutside, ...all];
    });
  }

  function deselectAll() {
    setCurrentSelections(prev => prev.filter(sel => sel.type !== activeTab));
  }

  function handleBuild() {
    const filteredSelections = currentSelections.filter(
      sel => sel.type === activeTab
    );
    if (!filteredSelections.length) {
      alert(`Please pick at least one event from ${activeTab}!`);
      return;
    }
    onBuild(filteredSelections, year, activeTab);
  }

  // Check if schedule is missing or empty
  const scheduleMissing =
    !scheduleData.Centeroo ||
    !scheduleData.Outeroo ||
    Object.keys(scheduleData.Centeroo).length === 0 ||
    Object.keys(scheduleData.Outeroo).length === 0;

  // Show "schedule not available" message if missing
  if (scheduleMissing) {
    if (currentSelections.length > 0) setCurrentSelections([]);
    return (
      <div className="container" id="app">
        <YearSelector onYearChange={setYear} defaultYear={year} />
        <p className="bonnaroo-status bonnaroo-status--not-available">
          {SCHEDULE_NOT_AVAILABLE_TEMPLATE.replace('{year}', year)}
        </p>
      </div>
    );
  }

  // Get Bonnaroo status message (only if schedule is available)
  const roostatus = getBonnarooStatus(year, scheduleData);
  const statusClass = getStatusClass(roostatus, scheduleMissing);

  return (
    <div className="container" id="app">
      <YearSelector onYearChange={setYear} defaultYear={year} />

      {lastModified && (
        <p className="last-updated">Schedules last updated: {lastModified}</p>
      )}

      {roostatus && (
        <div className={statusClass}>{roostatus}</div>
      )}

      <TabContainer activeTab={activeTab} onTabClick={setActiveTab} />

      <div style={{ margin: '15px 0' }}>
        <button type="button" onClick={selectAll}>
          Select all
        </button>
        <button type="button" onClick={deselectAll}>
          Deselect all
        </button>
      </div>

      {scheduleData[activeTab] && (
        <SelectionGrid
          data={scheduleData[activeTab]}
          type={activeTab}
          currentSelections={currentSelections}
          onToggleSelection={toggleSelection}
        />
      )}

      <button id="buildBtn" type="button" onClick={handleBuild}>
        Build My Planner!
      </button>
    </div>
  );
}
