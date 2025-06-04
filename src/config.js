// src/config.js

export const jsonBase = 'assets/schedules';
export const firstYearAvailable = 2025;
export const yearsAvailable = 1;
export const bonnarooStartMonday = { 2025: '2025-06-09' };
export const dayOffsets = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6
};
export const LATE_NIGHT_CUTOFF = 7 * 60;

// ---------------------------------------------
// On-screen builder heading (use {yearPart} to inject “ 2025” once year is chosen)
export const BUILDER_TITLE_TEMPLATE = 'Select Your Bonnaroo Events{yearPart}';

// ---------------------------------------------
// Browser tab title (fallback before React loads)
export const HTML_TITLE_FALLBACK = 'Bonnaroo Planner';

// Runtime template for window title once React knows year & tab:
// Example final: “Bonnaroo Planner – 2025 – Centeroo”
export const HTML_TITLE_TEMPLATE = 'Bonnaroo Planner - {year}{tabPart}';

// ---------------------------------------------
// On-screen planner heading (unchanged from before)
export const APP_TITLE_PLANNER = 'Your Bonnaroo {year} Planner - {tab}';

// Filename templates (unchanged)
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.pdf';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';

// ---------------------------------------------
// Toggle hiding/showing the Print button on Planner page
export const SHOW_PRINT_BUTTON = false;
