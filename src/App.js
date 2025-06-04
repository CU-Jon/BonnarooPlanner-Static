// src/App.js
import React, { useState, useEffect } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import {
  BUILDER_TITLE_TEMPLATE,
  HTML_TITLE_TEMPLATE,
  APP_TITLE_PLANNER
} from './config';

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

  // Whenever view/year/activeTab change, update the browser tab <title>
  useEffect(() => {
    if (view === 'builder') {
      // Builder page: “Select Your Bonnaroo Events” or “Select Your Bonnaroo Events 2025”
      const yearPart = year ? ` ${year}` : '';
      document.title = BUILDER_TITLE_TEMPLATE.replace('{yearPart}', yearPart);
    } else {
      // Planner page: “Bonnaroo Planner – {year} – {tab}”
      const tabPart = ` - ${activeTab}`;
      document.title = HTML_TITLE_TEMPLATE
        .replace('{year}', year)
        .replace('{tabPart}', tabPart);
    }
  }, [view, year, activeTab]);

  return (
    <>
      {view === 'builder' && (
        <>
          {/* Only one <h1> here. Year will append once user picks it. */}
          <h1>
            {BUILDER_TITLE_TEMPLATE.replace(
              '{yearPart}',
              year ? ` ${year}` : ''
            )}
          </h1>
          <PlannerBuilder onBuild={handleBuild} />
        </>
      )}

      {view === 'planner' && (
        <>
          {/* Planner heading remains “Your Bonnaroo {year} Planner – {tab}” */}
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
