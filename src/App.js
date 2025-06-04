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

  // Update the browser tab <title> on each change of view/year/activeTab:
  useEffect(() => {
    if (!year) {
      // No year selected → use fallback (“Bonnaroo Planner”) 
      document.title = HTML_TITLE_FALLBACK;
    } else {
      // Always use HTML_TITLE_TEMPLATE:
      // {year} is guaranteed non-null here.
      // If we're in builder view, we omit tabPart (empty string).
      // If we're in planner view, we include “ - {activeTab}”.
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
          {/* On‐screen heading for the builder page */}
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
          {/* On‐screen heading for the planner page */}
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
