import React from 'react';

export default function TabContainer({
  activeTab,
  onTabClick,
  selectionCounts = {}
}) {
  const tabs = ['Centeroo', 'Outeroo'];
  return (
    <div className="tab-container">
      {tabs.map(tab => (
        <button
          key={tab}
          type="button"
          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
          {selectionCounts[tab] > 0 && (
            <span className="tab-badge">{selectionCounts[tab]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
