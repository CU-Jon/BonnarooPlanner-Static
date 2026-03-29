// src/packing-list.js
import './styles/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import PackingListApp from './components/PackingList/PackingListApp';

document.title = 'Bonnaroo Packing List';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PackingListApp />);
