import React, { useEffect, useState } from 'react';
import { jsonBase, firstYearAvailable, yearsAvailable } from '../config';

export default function YearSelector({ onYearChange, defaultYear }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function detectYears() {
      const arr = [];
      const range = Array.from({ length: yearsAvailable }, (_, i) => firstYearAvailable + i);
      for (const y of range) {
        try {
          const resp = await fetch(`${jsonBase}/centeroo_${y}.json`, { method: 'HEAD' });
          if (resp.ok) arr.push(y);
        } catch {}
      }
      arr.sort();
      setYears(arr);
      if (arr.length && !defaultYear) onYearChange(arr[arr.length - 1]);
    }
    detectYears();
  }, []);

  return (
    <form style={{ marginBottom: '20px' }}>
      <label htmlFor="year">Select Year:</label>
      <select
        id="year"
        value={defaultYear}
        onChange={e => onYearChange(Number(e.target.value))}
        style={{ marginLeft: '10px' }}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </form>
  );
}