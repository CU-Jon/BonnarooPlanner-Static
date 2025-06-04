// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HTML_TITLE_FALLBACK } from './config';

// Set a sensible default so that, before React loads, the user sees this:
document.title = HTML_TITLE_FALLBACK;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
