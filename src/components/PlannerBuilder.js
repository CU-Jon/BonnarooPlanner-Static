import React, { useState, useEffect } from 'react';
import YearSelector from './YearSelector';
import TabContainer from './TabContainer';
import SelectionGrid from './SelectionGrid';

export default function PlannerBuilder({ onBuild }) {
  const [currentYear, setCurrentYear] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    Centeroo: null,
    Outeroo: null
  });
  const [activeTab, setActiveTab] = useState('Centeroo');
  const [currentSelections, setCurrentSelections] = useState([]);
  const [lastModified, setLastModified] = useState(null);

  useEffect(() => {
    if (currentYear) loadYear(currentYear);
  }, [currentYear]);

  async function loadYear(y) {
    setScheduleData({ Centeroo: null, Outeroo: null });
    try {
      const [respCent, respOut] = await Promise.all([
        fetch(`assets/schedules/centeroo_${y}.json`),
        fetch(`assets/schedules/outeroo_${y}.json`)
      ]);
      const lmCent = respCent.headers.get('Last-Modified');
      const lmOut = respOut.headers.get('Last-Modified');
      if (lmCent || lmOut) {
        const dCent = lmCent ? new Date(lmCent) : null;
        const dOut = lmOut ? new Date(lmOut) : null;
        let latest = dCent;
        if (!latest || (dOut && dOut > latest)) latest = dOut;
        if (latest) setLastModified(latest.toLocaleString());
      }
      const [centeroo, outeroo] = await Promise.all([
        respCent.json(),
        respOut.json()
      ]);
      setScheduleData({ Centeroo: centeroo, Outeroo: outeroo });
    } catch {
      alert(`Could not load schedule data for year ${y}`);
    }
  }

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
        events.forEach(ev =>
          all.push({ type: activeTab, day, location: loc, event: ev })
        );
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
    onBuild(filteredSelections, currentYear, activeTab);
  }

  return (
    <div className="container" id="app">
      {lastModified && (
        <p className="last-updated">Schedules last updated: {lastModified}</p>
      )}

      <YearSelector onYearChange={setCurrentYear} defaultYear={currentYear} />
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
