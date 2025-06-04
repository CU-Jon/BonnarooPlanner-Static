// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HTML_TITLE_FALLBACK } from './config';

// Before React renders, set a sensible fallback title:
document.title = HTML_TITLE_FALLBACK;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
