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

// -------------------------------------------------
// On‐screen builder heading (we’ll inject “ 2025” when year is set)
// -------------------------------------------------
export const BUILDER_TITLE_TEMPLATE = 'Select Your Bonnaroo{yearPart} Events for Your Planner';

// -------------------------------------------------
// Fallback window/title before React loads (index.html’s <title> shows briefly)
// -------------------------------------------------
export const HTML_TITLE_FALLBACK = 'Bonnaroo Planner';

// -------------------------------------------------
// Runtime template for the browser’s tab title, once React knows year & tab.
// Examples:
//   “Bonnaroo Planner - 2025”    (view === 'builder', year set to 2025)
//   “Bonnaroo Planner - 2025 - Centeroo”  (view === 'planner')
// -------------------------------------------------
export const HTML_TITLE_TEMPLATE = 'Bonnaroo Planner - {year}{tabPart}';

// -------------------------------------------------
// On‐screen planner heading
// -------------------------------------------------
export const APP_TITLE_PLANNER = 'Your Bonnaroo {year} Planner - {tab}';

// -------------------------------------------------
// Filename templates
// -------------------------------------------------
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.pdf';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';

// -------------------------------------------------
// Toggle showing/hiding the “Print” button in PlannerView
// -------------------------------------------------
export const SHOW_PRINT_BUTTON = false;
