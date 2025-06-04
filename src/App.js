// src/App.js
import React, { useState, useEffect } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import {
  BUILDER_TITLE_TEMPLATE,
  HTML_TITLE_FALLBACK,
  HTML_TITLE_TEMPLATE,
  APP_TITLE_PLANNER
} from './config';

export default function App() {
  // Move `year` into App so we can update the title as soon as JSON loads:
  const [view, setView] = useState('builder');
  const [selections, setSelections] = useState([]);
  const [year, setYear] = useState(null);
  const [activeTab, setActiveTab] = useState('Centeroo');

  function handleBuild(selected, selectedYear, tabName) {
    setSelections(selected);
    // At this point, App.year is already set by YearSelector,
    // so we don’t need to setYear(selectedYear) again.
    setActiveTab(tabName);
    setView('planner');
  }

  function handleRestart() {
    setSelections([]);
    setYear(null);
    setActiveTab('Centeroo');
    setView('builder');
  }

  // As soon as `year` becomes non-null, update the <title>:
  useEffect(() => {
    if (!year) {
      document.title = HTML_TITLE_FALLBACK;
    } else {
      const tabPart = view === 'planner' ? ` - ${activeTab}` : '';
      document.title = HTML_TITLE_TEMPLATE
        .replace('{year}', year)
        .replace('{tabPart}', tabPart);
    }
  }, [view, year, activeTab]);

  return (
    <>
      {view === 'builder' && (
        <>
          {/* Builder heading now uses App.year via BUILDER_TITLE_TEMPLATE */}
          <h1>
            {BUILDER_TITLE_TEMPLATE.replace(
              '{yearPart}',
              year ? ` ${year}` : ''
            )}
          </h1>
          {/* Pass `year` and `setYear` down so that YearSelector can lift state */}
          <PlannerBuilder
            year={year}
            setYear={setYear}
            onBuild={handleBuild}
          />
        </>
      )}

      {view === 'planner' && (
        <>
          <h1>
            {APP_TITLE_PLANNER
              .replace('{year}', year)
              .replace('{tab}', activeTab)}
          </h1>
          <PlannerView
            selections={selections}
            year={year}
            activeTab={activeTab}
            onRestart={handleRestart}
          />
        </>
      )}
    </>
  );
}
