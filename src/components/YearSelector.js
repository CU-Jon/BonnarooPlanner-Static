import React, { useEffect, useState } from 'react';
import { jsonBase, firstYearAvailable, yearsAvailable } from '../config';

export default function YearSelector({ onYearChange, defaultYear }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function detectYears() {
      const foundYears = [];

      // We know the range is firstYearAvailable – (firstYear + yearsAvailable – 1).
      for (let i = 0; i < yearsAvailable; i++) {
        const y = firstYearAvailable + i;
        try {
          // Do a GET instead of HEAD; if the file exists, resp.ok will be true
          const resp = await fetch(`${jsonBase}/centeroo_${y}.json`);
          if (resp.ok) {
            foundYears.push(y);
          }
        } catch {
          // ignore any network/fetch errors
        }
      }

      if (foundYears.length) {
        foundYears.sort();
        setYears(foundYears);

        // If the parent hasn’t already set a defaultYear, pick the last one:
        if (!defaultYear) {
          onYearChange(foundYears[foundYears.length - 1]);
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
