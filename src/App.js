// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';
import Footer from './components/Footer';
import {
  HTML_TITLE_FALLBACK,
  HTML_TITLE_TEMPLATE,
  availableYears
} from './config';
import { fetchSchedule } from './utils/scheduleUtils';
import { savePlan, loadPlan } from './utils/plannerExporter';
import { decodeSelections } from './utils/shareUtils';

export default function App() {
  const [view, setView] = useState('builder');
  const [selections, setSelections] = useState([]);
  const [year, setYear] = useState(null);
  const [initialSchedule, setInitialSchedule] = useState(null);
  const [lastModified, setLastModified] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingLoad, setPendingLoad] = useState(null);
  const fileInputRef = useRef(null);

  async function pickDefaultYearAndSchedule() {
    setLoading(true);
    for (let i = availableYears.length - 1; i >= 0; i--) {
      const y = availableYears[i];
      const { exists, centeroo, outeroo, lastModified: lm } = await fetchSchedule(y);
      if (exists) {
        setYear(y);
        setInitialSchedule({ Centeroo: centeroo, Outeroo: outeroo });
        setLastModified(lm || null);
        setSelections([]);
        setView('builder');
        setLoading(false);
        return y;
      }
    }
    const fallback = availableYears[availableYears.length - 1];
    setYear(fallback);
    setInitialSchedule({ Centeroo: null, Outeroo: null });
    setLastModified(null);
    setSelections([]);
    setView('builder');
    setLoading(false);
    return fallback;
  }

  useEffect(() => {
    async function init() {
      const loadedYear = await pickDefaultYearAndSchedule();
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get('share');
      if (shareParam) {
        const decoded = decodeSelections(shareParam);
        if (decoded) {
          if (decoded.year === loadedYear) {
            setSelections(decoded.selections);
            setView('planner');
          } else {
            setPendingLoad(decoded);
          }
        }
      }
    }
    init();
    // eslint-disable-next-line
  }, []);

  function handleBuild(allSelections, selectedYear) {
    setSelections(allSelections);
    setView('planner');
  }

  function handleRestart() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    pickDefaultYearAndSchedule();
  }

  async function handleYearChange(newYear) {
    setLoading(true);
    const { centeroo, outeroo, lastModified: lm } = await fetchSchedule(newYear);
    setYear(newYear);
    setInitialSchedule({ Centeroo: centeroo, Outeroo: outeroo });
    setLastModified(lm || null);
    setLoading(false);
  }

  function handleSavePlan() {
    if (!selections.length) {
      alert('No events selected to save.');
      return;
    }
    savePlan(selections, year);
  }

  function triggerLoadPlan() {
    fileInputRef.current && fileInputRef.current.click();
  }

  async function handleLoadPlanFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = '';
    try {
      const data = await loadPlan(file);
      if (data.year !== year) {
        setPendingLoad(data);
      } else {
        setSelections(data.selections);
        setView('planner');
      }
    } catch (err) {
      alert(`Could not load plan: ${err}`);
    }
  }

  async function applyPendingWithYear(useYear) {
    const pending = pendingLoad;
    setPendingLoad(null);
    if (useYear !== year) {
      setLoading(true);
      const { exists, centeroo, outeroo, lastModified: lm } = await fetchSchedule(useYear);
      if (exists) {
        setInitialSchedule({ Centeroo: centeroo, Outeroo: outeroo });
        setLastModified(lm || null);
      } else {
        setInitialSchedule({ Centeroo: null, Outeroo: null });
        setLastModified(null);
      }
      setYear(useYear);
      setLoading(false);
    }
    setSelections(pending.selections);
    setView('planner');
  }

  useEffect(() => {
    if (!year) {
      document.title = HTML_TITLE_FALLBACK;
    } else {
      document.title = HTML_TITLE_TEMPLATE
        .replace('{year}', year)
        .replace('{tabPart}', '');
    }
  }, [view, year]);

  return (
    <div className="page-wrap">
      <header className="site-header">
        <h1>
          Bonnaroo <span>{year || ''}</span> Planner
        </h1>
        {year && <p>Build your perfect festival schedule</p>}
      </header>

      <main>
        {loading && (
          <div className="loading-status">Loading schedule...</div>
        )}

        {!loading && view === 'builder' && year !== null && (
          <PlannerBuilder
            year={year}
            setYear={handleYearChange}
            onBuild={handleBuild}
            initialSchedule={initialSchedule}
            lastModified={lastModified}
            onSave={handleSavePlan}
            onLoad={triggerLoadPlan}
          />
        )}

        {!loading && view === 'planner' && (
          <PlannerView
            selections={selections}
            year={year}
            onRestart={handleRestart}
            onBack={() => setView('builder')}
            onSave={handleSavePlan}
          />
        )}
      </main>

      <Footer />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleLoadPlanFile}
      />

      {pendingLoad && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Year Mismatch</h2>
            <p>
              This plan was saved for Bonnaroo <strong>{pendingLoad.year}</strong>,
              but you currently have <strong>{year}</strong> loaded.
              How would you like to load it?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-build"
                onClick={() => applyPendingWithYear(pendingLoad.year)}
              >
                Switch to {pendingLoad.year}
              </button>
              <button
                type="button"
                className="btn btn-save"
                onClick={() => applyPendingWithYear(year)}
              >
                Load with current year ({year})
              </button>
              <button
                type="button"
                className="btn btn-back"
                onClick={() => setPendingLoad(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
