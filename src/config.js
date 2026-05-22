// src/config.js

// =================================================
// SHARED
// =================================================

// -------------------------------------------------
// Toggle showing/hiding the "Print" button in PlannerView and PackingListView.
// (This does not disable printing, just the button.)
// -------------------------------------------------
export const SHOW_PRINT_BUTTON = true;

// -------------------------------------------------
// Footer content shown in both the planner and packing list.
// The email address is split across env vars and assembled at runtime to deter
// basic web crawlers. Use {{EMAIL_LINK}} in FOOTER_HTML as the placeholder.
// Set VITE_EMAIL_USER, VITE_EMAIL_DOMAIN, and VITE_EMAIL_SUBJECT at deploy time.
// -------------------------------------------------
export const EMAIL_USER = import.meta.env.VITE_EMAIL_USER || '';
export const EMAIL_DOMAIN = import.meta.env.VITE_EMAIL_DOMAIN || '';
export const EMAIL_SUBJECT = import.meta.env.VITE_EMAIL_SUBJECT || '';
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

// =================================================
// SCHEDULE PLANNER
// =================================================

// --- Data & years ------------------------------------

// -------------------------------------------------
// Path prefix for schedule JSON files.
// Files are expected at {jsonBase}/centeroo_{year}.json and outeroo_{year}.json.
// -------------------------------------------------
export const jsonBase = '/assets/data/schedules';

// -------------------------------------------------
// Years available in the year selector.
// The app defaults to the latest year that has schedule files available.
// -------------------------------------------------
export const availableYears = [2025, 2026]; // Add more years as needed

// --- Date & time -------------------------------------

// -------------------------------------------------
// Maps day names to their offset from the festival's opening Monday.
// Used for date calculations throughout the app.
// -------------------------------------------------
export const dayOffsets = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6
};

// -------------------------------------------------
// Cutoff (in minutes after midnight) for "late night" sets to count as the
// previous calendar day, specified per year.
// -------------------------------------------------
export const lateNightCutoffs = {
  2025: 7 * 60,      // 7:00 AM (420 minutes)
  2026: 6.75 * 60    // 6:45 AM (405 minutes) - accommodates 7:00 AM Sunday bird watching
};

// -------------------------------------------------
// For years where the festival does NOT follow the usual Father's Day rule,
// specify the opening Monday as an override (YYYY: 'YYYY-MM-DD').
// The app calculates the Monday before the third Sunday in June for all other years.
// -------------------------------------------------
export const bonnarooMondayOverrides = {
  // Example:
  // 2027: '2027-06-07'
  2026: '2026-06-08'
};

// --- UI text & status messages -----------------------

// -------------------------------------------------
// Fallback browser tab title shown before React loads
// (the index.html <title> displays this briefly on first paint).
// -------------------------------------------------
export const HTML_TITLE_FALLBACK = 'Bonnaroo Planner';

// -------------------------------------------------
// Browser tab title template once the planner year is known.
// Example: "Bonnaroo Planner - 2025"
// -------------------------------------------------
export const HTML_TITLE_TEMPLATE = 'Bonnaroo Planner - {year}';

// -------------------------------------------------
// Status messages shown in the colored box above the schedule.
// -------------------------------------------------
export const BONNAROO_STATUS_ENDED_TEMPLATE = 'Bonnaroo {year} has ended.';
export const BONNAROO_STATUS_NOT_STARTED_TEMPLATE = 'Bonnaroo {year} begins on {date}.';
export const BONNAROO_STATUS_STARTED_TEMPLATE = 'Bonnaroo {year} has begun!';

// -------------------------------------------------
// Shown when no schedule file is available for the selected year.
// -------------------------------------------------
export const SCHEDULE_NOT_AVAILABLE_TEMPLATE = 'The schedule for {year} is not available yet. Check back once Bonnaroo releases the official schedule.';

// -------------------------------------------------
// Shown when only one of the two schedules is available.
// {missing} = unavailable tab name, {available} = available tab name, {year} = festival year
// -------------------------------------------------
export const PARTIAL_SCHEDULE_NOT_AVAILABLE_TEMPLATE = 'The {missing} schedule for {year} is not yet available. Check back once Bonnaroo releases the official schedule. The {available} schedule is available — switch to the {available} tab.';

// --- Export filenames --------------------------------

export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{label}_{orientation}.pdf';
export const CSV_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.csv';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';
export const SAVE_FILENAME_TEMPLATE = 'bonnaroo_planner_{year}_{date}.json';

// =================================================
// PACKING LIST
// =================================================

// -------------------------------------------------
// Path to the default packing list data file.
// -------------------------------------------------
export const PACKING_JSON_PATH = '/assets/data/packing_list.json';

// --- Export filenames --------------------------------

export const PACKING_PDF_FILENAME_TEMPLATE = 'bonnaroo_packing_list_{date}.pdf';
export const PACKING_CSV_FILENAME_TEMPLATE = 'bonnaroo_packing_list_{date}.csv';
export const PACKING_SAVE_FILENAME_TEMPLATE = 'bonnaroo_packing_list_{date}.json';
