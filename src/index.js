// src/index.js

// -------------------------------------------------------------
// Unregister any existing service workers (to silence a console warning)
// -------------------------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HTML_TITLE_FALLBACK } from './config';

// Show fallback title (“Bonnaroo Planner”) until React replaces it:
document.title = HTML_TITLE_FALLBACK;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
