[![Azure Static Web Apps CI/CD](https://github.com/CU-Jon/BonnarooPlanner-Static/actions/workflows/azure-static-web-apps-blue-meadow-029a01a0f.yml/badge.svg)](https://github.com/CU-Jon/BonnarooPlanner-Static/actions)
[![MIT License](https://img.shields.io/github/license/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/commits)
[![Issues](https://img.shields.io/github/issues/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/pulls)
[![Node Version](https://img.shields.io/badge/node-%3E=16.0.0-brightgreen)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/github/languages/top/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/search?l=javascript)
[![React](https://img.shields.io/badge/React-blue?logo=react)](https://react.dev/)

# Bonnaroo Planner

A modern, mobile-friendly web app for planning your Bonnaroo festival schedule.  
Easily select your favorite events, view your custom schedule, and export it as a PDF or calendar file.

---

## Features

- **Interactive Event Selection:**  
  Choose your favorite events by day, stage, and time.

- **Custom Schedule Table:**  
  View your selections in a clean, printable table format.

- **PDF & Calendar Export:**  
  Download your schedule as a PDF (portrait or landscape) or export to `.ics` for your calendar.

- **Mobile Friendly:**  
  Responsive design for use on phones, tablets, and desktops.

- **Print Support:**  
  Optimized print styles for a professional-looking hard copy.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/CU-Jon/BonnarooPlanner-Static.git
   cd BonnarooPlanner-Static
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm start
   # or
   yarn start
   ```

4. **Open in your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
public/
  assets/
    style.css               # Main styles
    schedules/              # JSON event data
      centeroo_XXXX.json    # Where "XXXX" is the year
      outeroo_XXXX.json     # Where "XXXX" is the year
  index.html
src/
  components/               # React components
    PlannerBuilder.js       # Builder components (initial page)
    PlannerView.js          # Built planner "view" components
    SelectionGrid.js        # The selection grid where you pick the events/artists
    TabContainer.js         # Tab containers to separate Centeroo and Outeroo
    YearSelector.js         # Year selection, defaults to the latest year defined in config
  utils/                    # Utility functions
    icsExporter.js          # Helper functions for exporting to .ics
    timeUtils.js            # Logic behind "late night" sets and overlapping events at the same location
  config.js                 # App configuration and templates
  App.js                    # Main app component
  index.js                  # Entry point
package.json                # Necessary modules for this project and the necessary versions
```

---

## Usage

1. **Select Year and Events:**  
   Use the builder to choose your year and favorite events.

2. **View Your Planner:**  
   Click "Build My Planner!" to switch to the planner view to see your custom schedule.

3. **Export or Print:**  
   - Download as PDF (portrait or landscape)
   - Export to calendar (.ics)
   - Print directly from your browser (Currently disabled in preference of exportable PDFs. Print button can be enabled in `config.js`)

---

## Customization

- **Event Data:**  
  Update or add new schedules in `public/assets/schedules/`.

- **Styling:**  
  Edit `public/assets/style.css` for custom themes or branding.

- **Footer:**  
  The footer text is set in `src/config.js` via `FOOTER_HTML`.

- **Titles, headers, and exported file names:**  
  Titles, headers, and file names can be configured in `src/config.js`.

- **Late-night cutoff:**  
  The late-night cutoff time can be configured in `src/config.js` to accommodate later "late-night" sets. Currently set to 7:00 AM as the last set for the "day" per Bonnaroo's official schedules.
  For example, Bonnaroo may show an artist or event from 3:00 AM - 5:00 AM on Thursday, when in reality, this is on Friday morning. This will place the artist or event at the end of Thursday's schedule to align with the official schedules (as opposed to in the morning on Thursday).
  Exported .ics files will show the artist or event on the actual day and time.

---

## Configuration (`src/config.js`)

The `src/config.js` file centralizes all app-wide settings, templates, and customization options.  
**You can adjust these values to change the app’s behavior, appearance, and exported file formats.**

### Key Options

| Name                        | Purpose & Usage                                                                                                  |
|-----------------------------|------------------------------------------------------------------------------------------------------------------|
| `jsonBase`                  | Path to the folder containing event schedule JSON files.                                                         |
| `firstYearAvailable`        | The first year for which schedules are available. Used for year selection.                                       |
| `yearsAvailable`            | Number of years available for selection beginning at `1` based on `firstYearAvailable`. Prevents browser time wastes to loop through and find all schedules.    |
| `bonnarooStartMonday`       | Maps each year to the festival’s starting Monday (YYYY-MM-DD). Used for date calculations in .ics exports.       |
| `dayOffsets`                | Maps day names to their offset from the festival’s start (e.g., Thursday = 3).                                   |
| `LATE_NIGHT_CUTOFF`         | The cutoff (in minutes after midnight) for “late night” sets to count as the previous day (default: 7:00 AM).    |
| `BUILDER_TITLE_TEMPLATE`    | Template for the builder page heading. Supports `{yearPart}` placeholder.                                        |
| `HTML_TITLE_FALLBACK`       | Fallback browser tab title before React loads.                                                                   |
| `HTML_TITLE_TEMPLATE`       | Template for the browser tab title. Supports `{year}` and `{tabPart}` placeholders.                              |
| `APP_TITLE_PLANNER`         | Template for the planner view heading. Supports `{year}` and `{tab}` placeholders.                               |
| `PDF_FILENAME_TEMPLATE`     | Template for exported PDF filenames. Supports `{year}`, `{tab}`, and `{orientation}` placeholders.               |
| `ICS_FILENAME_TEMPLATE`     | Template for exported calendar filenames. Supports `{year}` and `{tab}` placeholders.                            |
| `ICS_CALENDARNAME_TEMPLATE` | Template for the calendar name in exported `.ics` files. Supports `{year}` and `{tab}` placeholders.             |
| `SHOW_PRINT_BUTTON`         | Boolean to show/hide the “Print” button in the planner view.                                                     |
| `FOOTER_HTML`               | HTML string for the app footer. Supports links and emoji. (Don't forget attribution to the original dev ❤️)      |

### How to Customize

- **Add or update years:**  
  Update `firstYearAvailable`, `yearsAvailable`, and `bonnarooStartMonday` to support new festival years.

- **Change late-night cutoff:**  
  Adjust `LATE_NIGHT_CUTOFF` (in minutes) to match how you want late-night sets to be grouped. Keep in mind this should be no less than the latest late-night cutoff for any of your schedules available.

- **Edit titles and headings:**  
  Change the templates to update how the app and exported files are named and displayed.

- **Show/hide print button:**  
  Set `SHOW_PRINT_BUTTON` to `true` or `false` to control whether users can print directly from the browser with a Print button. This does not enable/disable printing completely, just the button.

- **Customize the footer:**  
  Edit `FOOTER_HTML` to change the footer text or link. (Please remember to give attribution to the original author :) )

---

## Building JSON schedules

See the predecessor project [BonnarooPlanner/jsonbuilder](https://github.com/CU-Jon/BonnarooPlanner/blob/main/jsonbuilder) for the PHP code to build or edit schedules. Unfortunately, the builder/editor cannot be served as a static web app to perform live updates to the files for obvious reasons :(

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Credits

Made with ❤️ by [CU-Jon](https://github.com/CU-Jon)
