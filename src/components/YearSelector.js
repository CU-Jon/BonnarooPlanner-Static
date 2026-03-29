// src/components/YearSelector.js
import React, { useEffect, useState } from 'react';
import { availableYears } from '../config';

export default function YearSelector({ onYearChange, defaultYear }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    setYears(availableYears);
  }, []);

  return (
    <div className="year-selector">
      <label htmlFor="year-select">Year:</label>
      <select
        id="year-select"
        value={defaultYear ?? ''}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        <option value="" disabled>
          -- Select Year --
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
