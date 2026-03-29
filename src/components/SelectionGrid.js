import React from 'react';
import { timeToMinutes } from '../utils/timeUtils';
import { getSelectionKey } from '../utils/conflictUtils';

export default function SelectionGrid({
  data,
  type,
  onToggleSelection,
  currentSelections,
  conflictKeys = new Set()
}) {
  return (
    <div>
      {Object.entries(data).map(([day, locations]) => {
        const dayCount = currentSelections.filter(
          s => s.type === type && s.day === day
        ).length;

        return (
          <React.Fragment key={day}>
            <div className="day-heading-row">
              <span className="day-heading-screen">{day}</span>
              {dayCount > 0 && (
                <span className="day-select-badge">{dayCount} selected</span>
              )}
            </div>
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
                          sel.event.start === ev.start
                      );
                      const selKey = getSelectionKey({
                        type,
                        day,
                        location: loc,
                        event: ev
                      });
                      const isConflict = isChecked && conflictKeys.has(selKey);
                      return (
                        <label key={key} className="event-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleSelection(payload)}
                          />
                          <span className="event-label-text">
                            {`${ev.name} (${ev.start}–${ev.end})`}
                            {isConflict && (
                              <span
                                className="conflict-badge"
                                title="Scheduling conflict"
                              >
                                &nbsp;⚠
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
