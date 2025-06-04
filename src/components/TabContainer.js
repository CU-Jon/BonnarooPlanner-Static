import React from 'react';

export default function TabContainer({ activeTab, onTabClick }) {
  return (
    <div className="tab">
      <button
        className={`tablinks ${activeTab === 'Centeroo' ? 'active' : ''}`}
        onClick={() => onTabClick('Centeroo')}
      >
        Centeroo
      </button>
      <button
        className={`tablinks ${activeTab === 'Outeroo' ? 'active' : ''}`}
        onClick={() => onTabClick('Outeroo')}
      >
        Outeroo
      </button>
    </div>
  );
}
