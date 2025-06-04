// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HTML_TITLE } from './config';

// Set the <title> tag dynamically at startup
document.title = HTML_TITLE;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
