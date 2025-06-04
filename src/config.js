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
export const APP_TITLE_BUILDER = 'Select Your Bonnaroo {year} Events - {tab}';
export const APP_TITLE_PLANNER = 'Your Bonnaroo {year} Planner - {tab}';

// Filename templates (use .replace('{year}', year).replace('{tab}', activeTab)):
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.pdf';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';

// Inside ICS calendar-name (displayed by Outlook/Google Calendar):
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';
