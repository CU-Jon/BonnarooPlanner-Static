import React from 'react';
import { timeToMinutes } from '../utils/timeUtils';

export default function SelectionGrid({
  data,
  type,
  onToggleSelection,
  currentSelections
}) {
  return (
    <div id={type} className="tabcontent" style={{ display: 'block' }}>
      {Object.entries(data).map(([day, locations]) => (
        <React.Fragment key={day}>
          <h2>{day}</h2>
          <div className="locations-grid">
            {Object.entries(locations).map(([loc, events]) => {
              if (!events || !events.length) return null;
              const sorted = [...events].sort(
                (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
              );
              return (
                <div className="location-block" key={loc}>
                  <h3>{loc}</h3>
                  {sorted.map(ev => {
                    const key = `${ev.name}-${ev.start}-${ev.end}`;
                    const payload = { type, day, location: loc, event: ev };
                    const isChecked = currentSelections.some(
                      sel =>
                        sel.type === type &&
                        sel.day === day &&
                        sel.location === loc &&
                        sel.event.name === ev.name &&
                        sel.event.start === ev.start &&
                        sel.event.end === ev.end
                    );
                    return (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSelection(payload)}
                        />
                        {` ${ev.name} (${ev.start} - ${ev.end})`}
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
