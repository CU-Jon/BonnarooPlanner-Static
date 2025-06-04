import React, { useState } from 'react';
import PlannerBuilder from './components/PlannerBuilder';
import PlannerView from './components/PlannerView';

export default function App() {
  const [view, setView] = useState('builder');
  const [selections, setSelections] = useState([]);
  const [year, setYear] = useState(null);

  function handleBuild(selected, selectedYear) {
    setSelections(selected);
    setYear(selectedYear);
    setView('planner');
  }

  function handleRestart() {
    setSelections([]);
    setYear(null);
    setView('builder');
    window.location.reload();
  }

  return (
    <>
      {view === 'builder' && <PlannerBuilder onBuild={handleBuild} />}
      {view === 'planner' && <PlannerView selections={selections} year={year} onRestart={handleRestart} />}
    </>
  );
}