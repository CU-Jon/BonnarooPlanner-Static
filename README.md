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
Easily select your favorite events, view your custom schedule, and export it as a PDF, CSV, or calendar file.

---

## Features

- **Interactive Event Selection:**  
  Choose your favorite events by day, stage, and time.

- **Custom Schedule Table:**  
  View your selections in a clean, printable table format.

- **PDF, CSV & Calendar Export:**  
  Download your schedule as a PDF (portrait or landscape), CSV, or export to `.ics` for your calendar.

- **Mobile Friendly:**  
  Responsive design for use on phones, tablets, and desktops.

- **Print Support:**  
  Optimized print styles for a professional-looking hard copy.

- **Automatic Festival Week Calculation:**  
  The app automatically determines the festival week for any year in `availableYears` based on the third Sunday in June (Father's Day).

- **Efficient Schedule Fetching:**  
  Schedules are only fetched once per year selection, and the app will default to the latest year with available schedule data.

- **Status Message Color Coding:**  
  The status message box color changes based on whether Bonnaroo has not started (yellow), is in progress (green), or has ended/no schedule (red).

- **Date/Time Spoofing for Testing:**  
  You can test status messages for any date/time by adding a `?now=YYYY-MM-DDTHH:mm:ss` query parameter to the URL.

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

3. **Set up environment variables for local development:**  
   Create a `.env.local` file in your project root (not committed to git):

   ```
   REACT_APP_EMAIL_USER=youruser
   REACT_APP_EMAIL_DOMAIN=yourdomain.com
   REACT_APP_EMAIL_SUBJECT=Reporting an issue with Bonnaroo Planner
   ```

   For **Azure Static Web Apps**, you must set these as **GitHub repository variables** (not as Azure SWA Environment Variables or Secrets) and pass them to the build step in your workflow.  
   See the "Azure Static Web Apps Deployment" section below.

4. **Start the development server:**
   ```sh
   npm start
   # or
   yarn start
   ```

5. **Open in your browser:**  
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
    favicon/                # Favicon and web app icons
      favicon.ico           # Standard favicon (ICO)
      favicon.svg           # SVG favicon (recommended for modern browsers)
      favicon-96x96.png     # PNG favicon (fallback for some browsers)
      apple-touch-icon.png  # iOS home screen icon
      site.webmanifest      # Web app manifest for PWA support
      web-app-manifest-192x192.png # PWA icon
      web-app-manifest-512x512.png # PWA icon
  index.html
src/
  components/               # React components
    PlannerBuilder.js       # Builder components (initial page)
    PlannerView.js          # Built planner "view" components
    SelectionGrid.js        # The selection grid where you pick the events/artists
    TabContainer.js         # Tab containers to separate Centeroo and Outeroo
    YearSelector.js         # Year selection, defaults to the latest year with schedule data
    Footer.js               # Footer component (handles obfuscated email link if chosen to use)
  utils/                    # Utility functions
    csvExporter.js          # Helper functions for exporting to .csv
    icsExporter.js          # Helper functions for exporting to .ics
    timeUtils.js            # Logic behind "late night" sets, festival date calculation, and overlaps
    scheduleUtils.js        # Efficient schedule fetching/checking
    bonnarooStatus.js       # Status message logic for festival state
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
   - Export to CSV (with columns: Artist/Event, Location, Sublocation, Day, Start, End; sorted by day and time)
   - Export to calendar (.ics)
   - Print directly from your browser (Currently disabled in preference of exportable PDFs. Print button can be enabled in `config.js`)

---

## Customization

- **Event Data:**  
  Update or add new schedules in `public/assets/schedules/`.

- **Styling:**  
  Edit `public/assets/style.css` for custom themes or branding.

- **Footer:**  
  The footer is implemented as a dedicated React component (`src/components/Footer.js`).  
  The footer HTML is stored as a template string in `src/config.js` and uses a `{{EMAIL_LINK}}` token as a placeholder for the email link.  
  The email address is **not hard-coded** in the source code; instead, it is dynamically injected at runtime using environment variables and JavaScript for obfuscation.  
  If you remove `{{EMAIL_LINK}}` from the template, the email link will not be shown.  
  This helps prevent email scraping by bots and keeps your email private in forks and public clones.

- **Titles, headers, and exported file names:**  
  Titles, headers, and file names can be configured in `src/config.js`.

- **Late-night cutoff:**  
  The late-night cutoff time can be configured in `src/config.js` to accommodate later "late-night" sets. Currently set to 7:00 AM as the last set for the "day" per Bonnaroo's official schedules.
  For example, Bonnaroo may show an artist or event from 3:00 AM - 5:00 AM on Thursday, when in reality, this is on Friday morning. This will place the artist or event at the end of Thursday's schedule to align with the official schedules (as opposed to in the morning on Thursday).
  Exported .ics files will show the artist or event on the actual day and time.

- **Festival Start Date Calculation and Overrides**  
  By default, the app automatically calculates the festival's Monday start date for any year in `availableYears` by finding the Monday before the third Sunday in June (the week of Father's Day).

  **If Bonnaroo is ever scheduled for a different week, you can override the start date for that year by adding an entry to the `bonnarooMondayOverrides` object in `src/config.js`:**

  ```js
  export const bonnarooMondayOverrides = {
    2027: '2027-06-07' // Example: manually set Monday for 2027
  };
  ```
  The app will use the override for that year, and automatic calculation for all others.
**This approach keeps your code automatic for most years, but flexible for rare exceptions.**

- **Status Message Color Coding:**  
  The status message box color changes automatically:  
  - **Yellow:** Before Bonnaroo starts  
  - **Green:** While Bonnaroo is in progress  
  - **Red:** After Bonnaroo ends or if no schedule is available

- **Date/Time Spoofing for Testing:**  
  You can test status messages for any date/time by adding a `?now=YYYY-MM-DDTHH:mm:ss` query parameter to the URL.  
  Example:  
  ```
  http://localhost:3000/?now=2025-06-12T10:00:00
  ```

---

## Configuration (`src/config.js`)

The `src/config.js` file centralizes all app-wide settings, templates, and customization options.  
**You can adjust these values to change the app’s behavior, appearance, and exported file formats.**

### Key Options

| Name                              | Purpose & Usage                                                                                                  |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `jsonBase`                        | Path to the folder containing event schedule JSON files.                                                         |
| `availableYears`                  | Array of years available for selection.                                                                          |
| `dayOffsets`                      | Maps day names to their offset from the festival’s Monday (e.g., Thursday = 3).                                  |
| `LATE_NIGHT_CUTOFF`               | The cutoff (in minutes after midnight) for “late night” sets to count as the previous day (default: 7:00 AM).    |
| `bonnarooMondayOverrides`          | Object for rare years to override the festival's starting Monday. Keys are years, values are `'YYYY-MM-DD'`.      |
| `BUILDER_TITLE_TEMPLATE`          | Template for the builder page heading. Supports `{yearPart}` placeholder.                                        |
| `HTML_TITLE_FALLBACK`             | Fallback browser tab title before React loads.                                                                   |
| `HTML_TITLE_TEMPLATE`             | Template for the browser tab title. Supports `{year}` and `{tabPart}` placeholders.                              |
| `APP_TITLE_PLANNER`               | Template for the planner view heading. Supports `{year}` and `{tab}` placeholders.                               |
| `PDF_FILENAME_TEMPLATE`           | Template for exported PDF filenames. Supports `{year}`, `{tab}`, and `{orientation}` placeholders.               |
| `CSV_FILENAME_TEMPLATE`           | Template for exported CSV filenames. Supports `{year}` and `{tab}` placeholders.                                 |
| `ICS_FILENAME_TEMPLATE`           | Template for exported calendar filenames. Supports `{year}` and `{tab}` placeholders.                            |
| `ICS_CALENDARNAME_TEMPLATE`       | Template for the calendar name in exported `.ics` files. Supports `{year}` and `{tab}` placeholders.             |
| `SHOW_PRINT_BUTTON`               | Boolean to show/hide the “Print” button in the planner view.                                                     |
| `BONNAROO_STATUS_ENDED_TEMPLATE`  | Template for the status message when the festival has ended.                                                     |
| `BONNAROO_STATUS_NOT_STARTED_TEMPLATE` | Template for the status message before the festival starts.                                                |
| `BONNAROO_STATUS_STARTED_TEMPLATE`| Template for the status message when the festival is in progress.                                                |
| `SCHEDULE_NOT_AVAILABLE_TEMPLATE` | Template for the message shown if no schedule is available for the selected year.                                |
| `EMAIL_USER`, `EMAIL_DOMAIN`, `EMAIL_SUBJECT`, `EMAIL_LINK_TEXT` | Email footer config, loaded from environment variables (except `EMAIL_LINK_TEXT`) for privacy. (Optional) |
| `FOOTER_HTML`                     | HTML string for the app footer. Use `{{EMAIL_LINK}}` as a placeholder for the obfuscated email link if you choose to add a contact email address. |

### How to Customize

- **Add or update years:**  
  Update `availableYears` to support new festival years. The app will automatically calculate the festival week for each year.

- **Change late-night cutoff:**  
  Adjust `LATE_NIGHT_CUTOFF` (in minutes) to match how you want late-night sets to be grouped. Keep in mind this should be no less than the latest late-night cutoff for any of your schedules available.

- **Edit titles and headings:**  
  Change the templates to update how the app and exported files are named and displayed.

- **Status and Unavailable Schedule Messages:**  
  You can customize the status messages shown above the schedule (before, during, and after the festival) and the "schedule not available" message by editing the corresponding templates in `src/config.js`:
  - `BONNAROO_STATUS_ENDED_TEMPLATE`
  - `BONNAROO_STATUS_NOT_STARTED_TEMPLATE`
  - `BONNAROO_STATUS_STARTED_TEMPLATE`
  - `SCHEDULE_NOT_AVAILABLE_TEMPLATE`

- **Show/hide print button:**  
  Set `SHOW_PRINT_BUTTON` to `true` or `false` to control whether users can print directly from the browser with a Print button. This does not enable/disable printing completely, just the button.

- **Customize the footer:**  
  Edit `FOOTER_HTML` to change the footer text or link. Use `{{EMAIL_LINK}}` as a placeholder for the obfuscated email link if you choose to add a contact email address. Change the text for the obfuscated email link in the footer by editing `EMAIL_LINK_TEXT` in `src/config.js`. (Please remember to give attribution to the original author :) )

---

## Environment Variables

To keep your email address private and out of the public repo, set the following in a `.env.local` file in your project root (not committed to git):

```
REACT_APP_EMAIL_USER=youruser
REACT_APP_EMAIL_DOMAIN=yourdomain.com
REACT_APP_EMAIL_SUBJECT=Reporting an issue with Bonnaroo Planner
```

### Azure Static Web Apps Deployment

**Important:**  
For Azure Static Web Apps, you must set these as **GitHub repository variables** (not as Azure SWA Environment Variables or Secrets) and pass them to the build step in your workflow file.  
Azure SWA Environment Variables are **not** injected into the frontend build for Create React App.

**Steps:**
1. Go to your GitHub repo → Settings → Secrets and variables → Actions → **Variables** tab → **New repository variable**.
2. Add:
   - `REACT_APP_EMAIL_USER`
   - `REACT_APP_EMAIL_DOMAIN`
   - `REACT_APP_EMAIL_SUBJECT`
3. In your `.github/workflows/azure-static-web-apps-*.yml` workflow file, add:
   ```
   env:
     REACT_APP_EMAIL_USER: ${{ vars.REACT_APP_EMAIL_USER }}
     REACT_APP_EMAIL_DOMAIN: ${{ vars.REACT_APP_EMAIL_DOMAIN }}
     REACT_APP_EMAIL_SUBJECT: ${{ vars.REACT_APP_EMAIL_SUBJECT }}
   ```
   under the build step.

4. Commit and push to trigger a new build.

---

## Footer Obfuscation

The footer email link is **not hard-coded** in the HTML or JavaScript.  
Instead, the footer template in `config.js` uses a `{{EMAIL_LINK}}` token, which is replaced at runtime by the `Footer` component with an obfuscated email link using environment variables.  
If you remove `{{EMAIL_LINK}}` from the template, no email link will be shown.  
This makes it much harder for bots to scrape your email address and keeps your email private in forks and public clones.

---

## Festival Week Calculation

The app **automatically calculates the festival's Monday start date** for any year in `availableYears` by finding the Monday before the third Sunday in June (the weekend of Father's Day).  
You do **not** need to manually update a start date for each year—just add the year to `availableYears` and the app will handle the rest.
On the rare occurrence that Bonnaroo does not land on the third Sunday in June, set `bonnarooMondayOverrides` in `config.js` for the Monday preceeding Bonnaroo weekend.

---

## Efficient Schedule Fetching

- The app will only fetch schedule JSONs for a year when needed.
- On first load, it will default to the latest year in `availableYears` that actually has schedule files available.
- All years in `availableYears` will still appear in the dropdown, but only years with schedule files will load a schedule.

---

## Status Message Color Coding

- The status message box color changes automatically:
  - **Yellow:** Before Bonnaroo starts
  - **Green:** While Bonnaroo is in progress
  - **Red:** After Bonnaroo ends or if no schedule is available

---

## Date/Time Spoofing for Testing

- You can test status messages for any date/time by adding a `?now=YYYY-MM-DDTHH:mm:ss` query parameter to the URL.
- Example:  
  ```
  http://localhost:3000/?now=2025-06-12T10:00:00
  ```

---

## Building JSON schedules

See the predecessor project [BonnarooPlanner/jsonbuilder](https://github.com/CU-Jon/BonnarooPlanner/blob/main/jsonbuilder) for the PHP code to build or edit schedules. Unfortunately, the builder/editor cannot be served as a static web app to perform live updates to the files for obvious reasons :(

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Credits

Made with ❤️ by [CU-Jon](https://github.com/CU-Jon)
