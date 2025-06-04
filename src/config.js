// Base paths and cutoffs
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

// On-screen titles:
// {year} and {tab} (Centeroo/Outeroo) will be replaced via .replace()
export const BUILDER_TITLE_TEMPLATE = 'Select Your Bonnaroo Events{yearPart}';
export const APP_TITLE_PLANNER = 'Bonnaroo {year} Planner - {tab}';

// Filename templates (use .replace('{year}', year).replace('{tab}', activeTab)):
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.pdf';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';

// Inside ICS calendar-name (displayed by Outlook/Google Calendar):
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';

// -----------------------------------
// NEW: Toggle to show/hide the Print button
// Set to false to hide “Print” in PlannerView
// -----------------------------------
export const SHOW_PRINT_BUTTON = false;

// -----------------------------------
// NEW: HTML <title> for index.html
// You can include {year} or {tabPart} if you wish, but it’s static here
// -----------------------------------
export const HTML_TITLE_TEMPLATE = 'Bonnaroo Planner - {year}';

// The “static” default title before React mounts:
export const HTML_TITLE_FALLBACK = 'Bonnaroo Planner';
