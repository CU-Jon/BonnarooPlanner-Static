// src/App.js

import React, { useState } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import { BUILDER_TITLE_TEMPLATE, APP_TITLE_PLANNER } from './config';

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
    setSelections([]);
    setYear(null);
    setActiveTab('Centeroo');
    setView('builder');
  }

  // Compute “{yearPart}” text: either empty or “ YYYY”
  const yearPart = year ? ` ${year}` : '';

  return (
    <>
      {view === 'builder' && (
        <>
          <h1>{BUILDER_TITLE_TEMPLATE.replace('{yearPart}', yearPart)}</h1>
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
