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
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}_{orientation}.pdf';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';

// -------------------------------------------------
// Toggle showing/hiding the “Print” button in PlannerView
// -------------------------------------------------
export const SHOW_PRINT_BUTTON = false;

// -------------------------------------------------
// Footer HTML for the planner view (We obfuscate the email address to prevent basic web crawlers from getting it.)
// Email address needs to be set in your environment variables wherever you're deploying this app.
// -------------------------------------------------
export const EMAIL_USER = process.env.REACT_APP_EMAIL_USER || '';
export const EMAIL_DOMAIN = process.env.REACT_APP_EMAIL_DOMAIN || '';
export const EMAIL_SUBJECT = process.env.REACT_APP_EMAIL_SUBJECT || '';
export const EMAIL_LINK_TEXT = 'email me.';
export const FOOTER_HTML = `
Made with ❤️ by <a href="https://github.com/CU-Jon/BonnarooPlanner-Static" target="_blank" rel="noopener noreferrer">CU-Jon</a><br><br>
Found an issue or schedules updated?<br>
<a href="https://github.com/CU-Jon/BonnarooPlanner-Static/issues" target="_blank" rel="noopener noreferrer">Report an issue</a> or<br>
<a href="https://github.com/CU-Jon/BonnarooPlanner-Static/pulls" target="_blank" rel="noopener noreferrer">Open a pull request</a> on GitHub.<br>
Or you can simply {{EMAIL_LINK}}
<br>
<span style="font-size: 0.6em; color: #888;">
  This project is not affiliated with Bonnaroo or Live Nation.
</span>
`;