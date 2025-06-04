// src/components/YearSelector.js
import React, { useEffect, useState } from 'react';
import { jsonBase, firstYearAvailable, yearsAvailable } from '../config';

export default function YearSelector({ onYearChange, defaultYear }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function detectYears() {
      const found = [];
      for (let i = 0; i < yearsAvailable; i++) {
        const y = firstYearAvailable + i;
        try {
          const resp = await fetch(`${jsonBase}/centeroo_${y}.json`);
          if (resp.ok) {
            found.push(y);
          }
        } catch {
          // ignore errors
        }
      }
      if (found.length) {
        found.sort();
        setYears(found);
        if (!defaultYear) {
          onYearChange(found[found.length - 1]);
        }
      }
    }
    detectYears();
  }, [defaultYear, onYearChange]);

  return (
    <form style={{ marginBottom: '20px' }}>
      <label htmlFor="year">Select Year:</label>
      <select
        id="year"
        value={defaultYear || ''}
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
