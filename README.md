[![Azure Static Web Apps CI/CD](https://github.com/CU-Jon/BonnarooPlanner-Static/actions/workflows/azure-static-web-apps-blue-meadow-029a01a0f.yml/badge.svg)](https://github.com/CU-Jon/BonnarooPlanner-Static/actions)
[![MIT License](https://img.shields.io/github/license/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/commits)
[![Issues](https://img.shields.io/github/issues/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/issues)
[![Node Version](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

# Bonnaroo Festival Tools

A modern, mobile-friendly suite of tools for your Bonnaroo experience — plan your schedule and pack your bags, all in one place.

- **Schedule Planner** — Browse the lineup, pick your must-see acts, and build a personalized schedule you can export to PDF, CSV, or `.ics`.
- **Packing List** — Check off everything you need to bring, add custom items and categories, then export or print your list.

---

## Features

### Schedule Planner

- Browse and select events across Centeroo and Outeroo by day, stage, and time
- Visual conflict detection highlights overlapping selections
- Export your schedule as:
  - PDF (portrait or landscape)
  - CSV (Artist/Event, Location, Sublocation, Day, Start, End — sorted by day and time)
  - Calendar file (`.ics`) with proper America/Chicago timezone
- Save your plan to a JSON file and reload it later
- Share your plan via a compressed, URL-safe hash link
- Live festival status banner (not started / in progress / ended) with color coding
- Responsive layout for phones, tablets, and desktops
- Optimized print styles for a clean hard copy

### Packing List

- Pre-loaded checklist organized by category
- Add custom categories and items
- Per-category select-all / deselect-all controls
- Export selected items as a PDF or save/load the full list as JSON

### General

- Automatic festival week calculation based on the third Sunday in June (Father's Day weekend) — no manual date updates needed year to year
- Schedules are fetched on demand; the app defaults to the latest year with available data
- Date/time spoofing via `?now=YYYY-MM-DDTHH:mm:ss` for testing status states
- Obfuscated footer email link to prevent bot scraping

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/CU-Jon/BonnarooPlanner-Static.git
   cd BonnarooPlanner-Static
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. *(Optional)* Set up a `.env.local` file for the footer email link:

   ```
   VITE_EMAIL_USER=youruser
   VITE_EMAIL_DOMAIN=yourdomain.com
   VITE_EMAIL_SUBJECT=Reporting an issue with Bonnaroo Planner
   ```

4. Start the development server:

   ```sh
   npm start
   ```

   Then open [http://localhost:5173](http://localhost:5173) in your browser.

5. To create a production build:

   ```sh
   npm run build
   ```

---

## Project Structure

```
public/
  assets/
    style.css                        # Main styles
    schedules/
      centeroo_XXXX.json             # Centeroo schedule for year XXXX
      outeroo_XXXX.json              # Outeroo schedule for year XXXX
    favicon/                         # Favicons and PWA icons
src/
  components/
    LandingPage.js                   # Landing page / tool hub
    PlannerBuilder.js                # Event selection UI
    PlannerView.js                   # Schedule table and export controls
    SelectionGrid.js                 # Per-day, per-stage selection grid
    TabContainer.js                  # Centeroo / Outeroo tab switcher
    YearSelector.js                  # Year dropdown
    Footer.js                        # Footer with optional obfuscated email link
    PackingList/
      PackingListApp.js              # Packing list app root
      PackingListView.js             # Packing list print/export view
      CategoryCard.js                # Per-category checklist card
      AddCategoryModal.js            # Modal for adding custom categories
  utils/
    bonnarooStatus.js                # Festival status logic
    conflictUtils.js                 # Schedule conflict detection
    csvExporter.js                   # CSV export
    icsExporter.js                   # iCalendar (.ics) export
    packingExporter.js               # Packing list JSON save/load
    packingPdf.js                    # Packing list PDF export
    plannerExporter.js               # Planner plan save/load
    scheduleUtils.js                 # Schedule JSON fetching
    shareUtils.js                    # URL share encode/decode (LZ-string)
    timeUtils.js                     # Time parsing, late-night logic, festival date math
  config.js                          # All app-wide settings and templates
  App.js                             # Planner app root
  index.js                           # Planner entry point
  landing.js                         # Landing page entry point
  packing-list.js                    # Packing list entry point
index.html                           # Landing page HTML shell
planner/index.html                   # Planner HTML shell
packing-list/index.html              # Packing list HTML shell
vite.config.js                       # Vite build config (multi-page)
package.json
```

---

## Configuration (`src/config.js`)

All app-wide settings live in `src/config.js`. Key options:

| Setting | Description |
|---|---|
| `availableYears` | Years shown in the year dropdown. Add new years here. |
| `jsonBase` | Path to the schedule JSON folder. |
| `dayOffsets` | Maps day names to their offset from the festival's Monday. |
| `LATE_NIGHT_CUTOFF` | Minutes after midnight at which a set still counts as the previous day (default: `420` = 7:00 AM). |
| `bonnarooMondayOverrides` | Per-year override for the festival Monday, for years that fall outside the Father's Day rule. |
| `BUILDER_TITLE_TEMPLATE` | Heading template for the builder page. Supports `{yearPart}`. |
| `HTML_TITLE_TEMPLATE` | Browser tab title template. Supports `{year}` and `{tabPart}`. |
| `APP_TITLE_PLANNER` | Planner view heading template. Supports `{year}` and `{tab}`. |
| `PDF_FILENAME_TEMPLATE` | PDF export filename template. Supports `{year}`, `{label}`, `{orientation}`. |
| `CSV_FILENAME_TEMPLATE` | CSV export filename template. Supports `{year}`, `{tab}`. |
| `ICS_FILENAME_TEMPLATE` | ICS export filename template. Supports `{year}`, `{tab}`. |
| `ICS_CALENDARNAME_TEMPLATE` | Calendar name inside `.ics` files. Supports `{year}`, `{tab}`. |
| `SAVE_FILENAME_TEMPLATE` | Saved plan JSON filename template. Supports `{year}`, `{date}`. |
| `SHOW_PRINT_BUTTON` | Show/hide the browser print button in the planner view. |
| `BONNAROO_STATUS_*_TEMPLATE` | Status banner text for ended / not started / in progress states. |
| `SCHEDULE_NOT_AVAILABLE_TEMPLATE` | Message shown when no schedule data is available for the selected year. |
| `FOOTER_HTML` | Footer HTML. Use `{{EMAIL_LINK}}` as a placeholder for the obfuscated email link. |
| `EMAIL_USER`, `EMAIL_DOMAIN`, `EMAIL_SUBJECT`, `EMAIL_LINK_TEXT` | Footer email config — `USER` and `DOMAIN` are read from environment variables. |
| `PACKING_JSON_PATH` | Path to the packing list JSON data file. |
| `PACKING_PDF_FILENAME` | Filename for exported packing list PDFs. |
| `PACKING_SAVE_FILENAME_TEMPLATE` | Filename template for saved packing list JSON. |

### Adding a new year

1. Add schedule JSON files to `public/assets/schedules/`:
   - `centeroo_XXXX.json`
   - `outeroo_XXXX.json`
2. Add the year to `availableYears` in `src/config.js`.

The app will automatically calculate the festival dates. If Bonnaroo falls on a non-standard week for that year, add an override:

```js
export const bonnarooMondayOverrides = {
  2027: '2027-06-07'
};
```

### Late-night cutoff

Sets that end before `LATE_NIGHT_CUTOFF` (default 7:00 AM) are grouped with the previous day to match Bonnaroo's official schedule presentation. Exported `.ics` files always use the real calendar date and time.

---

## Environment Variables

The footer email link is optional. If you want a contact link in the footer, set these variables so the email address is never hard-coded in source:

| Variable | Description |
|---|---|
| `VITE_EMAIL_USER` | The username part of the email address. |
| `VITE_EMAIL_DOMAIN` | The domain part (e.g. `example.com`). |
| `VITE_EMAIL_SUBJECT` | Pre-filled subject line for the mailto link. |

For local development, put these in a `.env.local` file (not committed to git).

### Azure Static Web Apps deployment

Azure SWA does not inject environment variables into the Vite build automatically. Set these as **GitHub repository variables** (not Secrets), then pass them in your workflow:

```yaml
env:
  VITE_EMAIL_USER: ${{ vars.REACT_APP_EMAIL_USER }}
  VITE_EMAIL_DOMAIN: ${{ vars.REACT_APP_EMAIL_DOMAIN }}
  VITE_EMAIL_SUBJECT: ${{ vars.REACT_APP_EMAIL_SUBJECT }}
```

> [!NOTE]
> The GitHub repository variable names use the `REACT_APP_` prefix for legacy reasons. The build maps them to the correct `VITE_` prefix in the workflow file.

---

## Schedule JSON Format

Schedules are stored as JSON files in `public/assets/schedules/`. The expected structure is a nested object:

```json
{
  "Thursday": {
    "Which Stage": [
      { "name": "Artist Name", "start": "8:00 PM", "end": "9:30 PM" }
    ]
  }
}
```

See the predecessor project [BonnarooPlanner/jsonbuilder](https://github.com/CU-Jon/BonnarooPlanner/blob/main/jsonbuilder) for PHP tooling to build and edit schedule files.

---

## Testing Status States

You can simulate any date/time to test the festival status banner without changing your system clock:

```
http://localhost:5173/?now=2025-06-12T10:00:00
```

- Before festival start → yellow banner
- During the festival → green banner
- After the festival ends → red banner
- No schedule available → red banner

---

## Credits

Made with ❤️ by [CU-Jon](https://github.com/CU-Jon)
