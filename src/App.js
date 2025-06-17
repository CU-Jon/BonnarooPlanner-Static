// src/App.js
import React, { useState, useEffect } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import Footer from './components/Footer';
import {
  BUILDER_TITLE_TEMPLATE,
  HTML_TITLE_FALLBACK,
  HTML_TITLE_TEMPLATE,
  APP_TITLE_PLANNER,
  availableYears
} from './config';
import { fetchSchedule } from './utils/scheduleUtils';

export default function App() {
  const [view, setView] = useState('builder');
  const [selections, setSelections] = useState([]);
  const [year, setYear] = useState(null);
  const [activeTab, setActiveTab] = useState('Centeroo');
  const [initialSchedule, setInitialSchedule] = useState(null);
  const [lastModified, setLastModified] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refactored logic for picking the default year and schedule
  async function pickDefaultYearAndSchedule() {
    setLoading(true);
    for (let i = availableYears.length - 1; i >= 0; i--) {
      const y = availableYears[i];
      const { exists, centeroo, outeroo, lastModified } = await fetchSchedule(y);
      if (exists) {
        setYear(y);
        setInitialSchedule({ Centeroo: centeroo, Outeroo: outeroo });
        setLastModified(lastModified || null);
        setSelections([]);
        setActiveTab('Centeroo');
        setView('builder');
        setLoading(false);
        return;
      }
    }
    // If no year has a schedule, pick the latest year but set empty schedule
    setYear(availableYears[availableYears.length - 1]);
    setInitialSchedule({ Centeroo: null, Outeroo: null });
    setLastModified(null);
    setSelections([]);
    setActiveTab('Centeroo');
    setView('builder');
    setLoading(false);
  }

  useEffect(() => {
    pickDefaultYearAndSchedule();
    // eslint-disable-next-line
  }, []);

  function handleBuild(selected, selectedYear, tabName) {
    setSelections(selected);
    setActiveTab(tabName);
    setView('planner');
  }

  function handleRestart() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    pickDefaultYearAndSchedule();
  }

  async function handleYearChange(newYear) {
    setLoading(true);
    setYear(newYear);
    const { centeroo, outeroo, lastModified } = await fetchSchedule(newYear);
    setInitialSchedule({ Centeroo: centeroo, Outeroo: outeroo });
    setLastModified(lastModified || null);
    setLoading(false);
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
    <div className="page-wrap">
      {!loading && year !== null && view === 'builder' && (
        <>
          <h1>
            {BUILDER_TITLE_TEMPLATE.replace(
              '{yearPart}',
              year ? ` ${year}` : ''
            )}
          </h1>
          <PlannerBuilder
            year={year}
            setYear={handleYearChange}
            onBuild={handleBuild}
            initialSchedule={initialSchedule}
            lastModified={lastModified}
          />
        </>
      )}
      {loading && (
        <div className="container" id="app">
          <div className="loading-status">Loading schedule...</div>
        </div>
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
      <Footer />
    </div>
  );
}
