// src/App.js
import React, { useState } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import { APP_TITLE_BUILDER, APP_TITLE_PLANNER } from './config';

export default function App() {
  const [view, setView] = useState('builder');
  const [selections, setSelections] = useState([]);
  const [year, setYear] = useState(null);
  const [activeTab, setActiveTab] = useState('Centeroo');

  function handleBuild(selected, selectedYear, tabName) {
    setSelections(selected);
    setYear(selectedYear);
    setActiveTab(tabName);
    setView('planner');
  }

  function handleRestart() {
    // Simply clear out all state—do NOT reload the page.
    setSelections([]);
    setYear(null);
    setActiveTab('Centeroo');
    setView('builder');
    // Now the builder view will show with no year set;
    // YearSelector will detect years and pick the latest automatically.
  }

  return (
    <>
      {view === 'builder' && (
        <>
          <h1>
            {APP_TITLE_BUILDER
              .replace('{year}', year || '')
              .replace('{tab}', activeTab)}
          </h1>
          <PlannerBuilder onBuild={handleBuild} />
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
