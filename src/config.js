// src/config.js

// -------------------------------------------------
// Fallback window/title before React loads (index.html’s <title> shows briefly)
// -------------------------------------------------
export const HTML_TITLE_FALLBACK = 'Bonnaroo Planner';

// -------------------------------------------------
// Path to the folder containing event schedule JSON files
// -------------------------------------------------
export const jsonBase = 'assets/schedules';

// -------------------------------------------------
// List of years available for selection in the dropdown.
// The app will default to the latest year in this list that has schedule files available.
// -------------------------------------------------
export const availableYears = [2025, 2026]; // Add more years as needed

// -------------------------------------------------
// Maps day names to their offset from the festival’s Monday.
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
// The cutoff (in minutes after midnight) for “late night” sets to count as the previous day.
// Default is 7:00 AM (420 minutes).
// -------------------------------------------------
export const LATE_NIGHT_CUTOFF = 7 * 60;

// -------------------------------------------------
// For rare years where the festival does NOT follow the usual Father's Day rule,
// specify the starting Monday as an override here (YYYY: 'YYYY-MM-DD').
// For all other years, the app will automatically calculate the Monday before the third Sunday in June.
// -------------------------------------------------
export const bonnarooMondayOverrides = {
  // Example:
  // 2027: '2027-06-07'
};

// -------------------------------------------------
// Status message templates for different festival states.
// These are shown in the colored status box above the schedule.
// -------------------------------------------------
export const BONNAROO_STATUS_ENDED_TEMPLATE = 'Bonnaroo {year} has ended.';
export const BONNAROO_STATUS_NOT_STARTED_TEMPLATE = 'Bonnaroo {year} begins on {date}.';
export const BONNAROO_STATUS_STARTED_TEMPLATE = 'Bonnaroo {year} has begun!';

// -------------------------------------------------
// Message shown if schedule is not available for the selected year.
// -------------------------------------------------
export const SCHEDULE_NOT_AVAILABLE_TEMPLATE = 'The schedule for {year} is not available yet. Check back once Bonnaroo releases the official schedule.';

// -------------------------------------------------
// On‐screen builder heading (we’ll inject “ 2025” when year is set)
// -------------------------------------------------
export const BUILDER_TITLE_TEMPLATE = 'Select Your Bonnaroo{yearPart} Events for Your Planner';

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
// Filename templates for exported files
// -------------------------------------------------
export const PDF_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}_{orientation}.pdf';
export const CSV_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.csv';
export const ICS_FILENAME_TEMPLATE = 'Bonnaroo_{year}_Planner_{tab}.ics';
export const ICS_CALENDARNAME_TEMPLATE = 'Bonnaroo {year} Planner - {tab}';

// -------------------------------------------------
// Toggle showing/hiding the “Print” button in PlannerView
// (This does not disable printing, just the button.)
// -------------------------------------------------
export const SHOW_PRINT_BUTTON = false;

// -------------------------------------------------
// Footer HTML for the planner view (We obfuscate the email address to prevent basic web crawlers from getting it.)
// Email address needs to be set in your environment variables wherever you're deploying this app.
// Use {{EMAIL_LINK}} as a placeholder for the obfuscated email link.
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