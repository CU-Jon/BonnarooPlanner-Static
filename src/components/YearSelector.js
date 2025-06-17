// src/components/YearSelector.js
import React, { useEffect, useState } from 'react';
import { availableYears } from '../config';

export default function YearSelector({ onYearChange, defaultYear }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    setYears(availableYears);
  }, []);

  return (
    <form style={{ marginBottom: '20px' }}>
      <label htmlFor="year">Select Year:</label>
      <select
        id="year"
        value={defaultYear ?? ''}
        onChange={(e) => onYearChange(Number(e.target.value))}
        style={{ marginLeft: '10px' }}
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
    </form>
  );
}
