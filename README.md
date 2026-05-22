[![Azure Static Web Apps CI/CD](https://github.com/CU-Jon/BonnarooPlanner-Static/actions/workflows/azure-static-web-apps-blue-meadow-029a01a0f.yml/badge.svg)](https://github.com/CU-Jon/BonnarooPlanner-Static/actions)
[![MIT License](https://img.shields.io/github/license/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/commits)
[![Issues](https://img.shields.io/github/issues/CU-Jon/BonnarooPlanner-Static)](https://github.com/CU-Jon/BonnarooPlanner-Static/issues)
[![Node Version](https://img.shields.io/badge/node-%3E=22.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

# Bonnaroo Festival Tools

A modern, mobile-friendly suite of tools for Bonnaroo — browse the lineup, build your personal schedule, and pack your bags, all in one place.

---

## Features

### Schedule Planner

- Browse and select sets across Centeroo and Outeroo by day, stage, and time
- Visual conflict detection highlights overlapping selections
- Export your schedule as PDF (portrait or landscape), CSV, or `.ics` calendar file with proper `America/Chicago` timezone handling
- Save your plan to JSON and reload it in a future session
- Share your plan via a compressed, URL-safe hash link (no server required)
- Live festival status banner — color-coded for not started, in progress, and ended
- Responsive layout and optimized print styles

### Packing List

- Pre-loaded checklist organized by category
- Add custom categories and items; per-category select-all / deselect-all controls
- Export checked items as a PDF or CSV, or save/load the full list as JSON

### General

- Automatic festival-week calculation based on the Father's Day weekend rule — no manual date updates needed from year to year
- Per-year Monday overrides for years where Bonnaroo falls off the standard schedule
- Schedules are fetched on demand; the app defaults to the latest year with data
- Date/time spoofing via `?now=YYYY-MM-DDTHH:mm:ss` for testing status states
- Obfuscated footer email link to deter bot scraping

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/)

### Installation

```sh
git clone https://github.com/CU-Jon/BonnarooPlanner-Static.git
cd BonnarooPlanner-Static
npm install
```

Create a `.env.local` file with the required email configuration:

```
VITE_EMAIL_USER=youruser
VITE_EMAIL_DOMAIN=yourdomain.com
VITE_EMAIL_SUBJECT=Reporting an issue with Bonnaroo Planner
```

### Development

```sh
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```sh
npm run build
```

Output is written to the `build/` directory.

---

## Project Structure

```
public/
  assets/
    logo.svg                         # Site header logo
    style.css                        # Base styles (served as-is)
    print-planner.css                # Print styles for the planner
    print-packing.css                # Print styles for the packing list
    data/
      packing_list.json              # Default packing list data
      schedules/
        centeroo_XXXX.json           # Centeroo schedule for year XXXX
        outeroo_XXXX.json            # Outeroo schedule for year XXXX
    favicon/                         # Favicons and PWA manifest
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
    csvExporter.js                   # CSV export (planner and packing list)
    icsExporter.js                   # iCalendar (.ics) export
    packingExporter.js               # Packing list JSON save/load/merge
    packingPdf.js                    # Packing list PDF export
    plannerExporter.js               # Planner plan save/load
    scheduleUtils.js                 # Schedule JSON fetching
    shareUtils.js                    # URL share encode/decode (LZ-string)
    timeUtils.js                     # Time parsing, late-night logic, festival date math
  config.js                          # All app-wide settings and filename templates
  App.js                             # Planner app root
  index.js                           # Planner entry point
  landing.js                         # Landing page entry point
  packing-list.js                    # Packing list entry point
index.html                           # Landing page HTML shell
planner/index.html                   # Planner HTML shell
packing-list/index.html              # Packing list HTML shell
vite.config.js                       # Vite multi-page build config
package.json
```

---

## Configuration (`src/config.js`)

All app-wide settings and filename templates live in `src/config.js`.

| Setting | Description |
|---|---|
| `availableYears` | Years shown in the year selector. Add new years here. |
| `jsonBase` | Base path for schedule JSON files. |
| `dayOffsets` | Maps day names to their offset from the festival's opening Monday. |
| `lateNightCutoffs` | Per-year minutes past midnight at which a set still counts as the prior day. Example: `{ 2025: 420, 2026: 405 }`. |
| `bonnarooMondayOverrides` | Per-year override of the opening Monday for years that fall outside the Father's Day rule. |
| `HTML_TITLE_FALLBACK` | Browser tab title shown before React hydrates. |
| `HTML_TITLE_TEMPLATE` | Browser tab title template. Supports `{year}`. |
| `BONNAROO_STATUS_*_TEMPLATE` | Status banner text for ended / not started / in progress. |
| `SCHEDULE_NOT_AVAILABLE_TEMPLATE` | Message when no schedule file exists for the selected year. |
| `PDF_FILENAME_TEMPLATE` | Planner PDF filename. Supports `{year}`, `{label}`, `{orientation}`. |
| `CSV_FILENAME_TEMPLATE` | Planner CSV filename. Supports `{year}`, `{tab}`. |
| `ICS_FILENAME_TEMPLATE` | Calendar file filename. Supports `{year}`, `{tab}`. |
| `ICS_CALENDARNAME_TEMPLATE` | Calendar name embedded in `.ics` files. Supports `{year}`, `{tab}`. |
| `SAVE_FILENAME_TEMPLATE` | Saved plan JSON filename. Supports `{year}`, `{date}`. |
| `SHOW_PRINT_BUTTON` | Show or hide the browser Print button. |
| `FOOTER_HTML` | Footer HTML. Use `{{EMAIL_LINK}}` as a placeholder for the obfuscated email link. |
| `EMAIL_USER`, `EMAIL_DOMAIN`, `EMAIL_SUBJECT`, `EMAIL_LINK_TEXT` | Footer email config — `USER` and `DOMAIN` are read from environment variables. |
| `PACKING_JSON_PATH` | Path to the default packing list data file. |
| `PACKING_PDF_FILENAME_TEMPLATE` | Packing list PDF filename. Supports `{date}`. |
| `PACKING_CSV_FILENAME_TEMPLATE` | Packing list CSV filename. Supports `{date}`. |
| `PACKING_SAVE_FILENAME_TEMPLATE` | Saved packing list JSON filename. Supports `{date}`. |

### Adding a new year

1. Add schedule JSON files to `public/assets/data/schedules/`:
   - `centeroo_XXXX.json`
   - `outeroo_XXXX.json`
2. Add the year to `availableYears` in `src/config.js`.

The app calculates festival dates automatically. If Bonnaroo falls on a non-standard week for that year, add a `bonnarooMondayOverrides` entry:

```js
export const bonnarooMondayOverrides = {
  2027: '2027-06-07'
};
```

### Late-night cutoff

Sets that end before the year's late-night cutoff (defined in `lateNightCutoffs` in `config.js`) are grouped with the previous calendar day to match Bonnaroo's official schedule presentation. Exported `.ics` files always use the actual calendar date and time.

---

## Schedule JSON Format

Schedules live in `public/assets/data/schedules/` as one file per stage area per year.
The expected structure is a nested object keyed by day, then stage:

```json
{
  "Thursday": {
    "Which Stage": [
      { "name": "Artist Name", "start": "8:00 PM", "end": "9:30 PM" }
    ]
  }
}
```

See the predecessor project [BonnarooPlanner/jsonbuilder](https://github.com/CU-Jon/BonnarooPlanner/blob/main/jsonbuilder) for PHP tooling to build and validate schedule files.

---

## Environment Variables

The footer contact link is optional. Set these variables so the email address is never hard-coded in source:

| Variable | Description |
|---|---|
| `VITE_EMAIL_USER` | The username part of the email address. |
| `VITE_EMAIL_DOMAIN` | The domain (e.g. `example.com`). |
| `VITE_EMAIL_SUBJECT` | Pre-filled subject line for the mailto link. |

For local development, put these in a `.env.local` file (not committed to source control). The app requires all three to be set.

### Azure Static Web Apps deployment

Azure SWA does not inject environment variables into the Vite build automatically.
Set these as **GitHub repository variables** (not Secrets), then pass them in the workflow:

```yaml
env:
  VITE_EMAIL_USER: ${{ vars.REACT_APP_EMAIL_USER }}
  VITE_EMAIL_DOMAIN: ${{ vars.REACT_APP_EMAIL_DOMAIN }}
  VITE_EMAIL_SUBJECT: ${{ vars.REACT_APP_EMAIL_SUBJECT }}
```

> [!NOTE]
> The repository variable names use the `REACT_APP_` prefix for legacy reasons.
> The workflow maps them to the correct `VITE_` prefix at build time.

---

## Testing Status States

Simulate any date and time to test the festival status banner without touching your system clock:

```
http://localhost:5173/?now=2025-06-12T10:00:00
```

| Scenario | Banner color |
|---|---|
| Before festival start | Yellow |
| During the festival | Green |
| After the festival ends | Red |
| No schedule available for year | Red |

---

## Credits

Made with ❤️ by [CU-Jon](https://github.com/CU-Jon)
