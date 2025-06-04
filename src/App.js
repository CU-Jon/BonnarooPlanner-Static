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

  // When “Build My Planner” is clicked:
  function handleBuild(selected, selectedYear, tabName) {
    setSelections(selected);
    setYear(selectedYear);
    setActiveTab(tabName);
    setView('planner');
  }

  // When “Start Over” is clicked:
  function handleRestart() {
    setSelections([]);
    setYear(null);
    setActiveTab('Centeroo');
    setView('builder');
  }

  // Whenever view/year/tab changes, update the HTML <title>:
  useEffect(() => {
    if (view === 'builder') {
      // Only year (no tab) in the builder title
      const yearPart = year ? ` ${year}` : '';
      document.title = BUILDER_TITLE_TEMPLATE.replace(
        '{yearPart}',
        yearPart
      );
    } else {
      // view === 'planner'
      // We want: “Bonnaroo Planner - {year} - {tab}”
      // Our template is "Bonnaroo Planner - {year}{tabPart}"
      const tabPart = ` - ${activeTab}`;
      document.title = HTML_TITLE_TEMPLATE.replace(
        '{year}',
        year
      ).replace('{tabPart}', tabPart);
    }
  }, [view, year, activeTab]);

  return (
    <>
      {view === 'builder' && (
        <>
          <h1>
            {BUILDER_TITLE_TEMPLATE
              .replace('{yearPart}', year ? ` ${year}` : '')}
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
