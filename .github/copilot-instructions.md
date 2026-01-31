# Copilot Instructions for HCFR-CAD-DOWN-Project

## Project Overview
- This is a single-file, browser-based HTML/JS application for fire/EMS CAD-down operations, with a focus on local data persistence and robust UI for dispatchers.
- The main file is `hcfr_cad_down_v973_manual_roster_lineup_map_wired.html.html`, which contains all logic, UI, and styles (no build system or external JS except for Leaflet map library).

## Key Architectural Patterns
- **Monolithic HTML/JS:** All application logic, UI, and CSS are in one HTML file. There are no modules or imports; use IIFEs and namespacing for isolation.
- **LocalStorage Persistence:** Data (calls, notes, unit status, messages) is stored in browser `localStorage` under specific keys (e.g., `hcfrCadDownMessages`).
- **Versioning:** The authoritative version is set via `window.HCFR_VERSION` and displayed in the UI and console.
- **UI Components:** Custom UI (tables, overlays, dropdowns) is built with vanilla JS and CSS, not frameworks.
- **Map Integration:** Uses Leaflet (via CDN) for map previews and station markers.

## Developer Workflows
- **No Build Step:** Edit the HTML file directly. Open in a browser to run. No npm, bundler, or transpiler.
- **Debugging:** Use browser DevTools. Console logs are versioned and namespaced (e.g., `[HCFR v820] ...`).
- **Testing:** Manual, via browser interaction. No automated test suite.
- **Export/Import:** Data export is via Excel XML (SpreadsheetML) or CSV, triggered from the UI.

## Project-Specific Conventions
- **Changelog:** Maintained as HTML comments at the top of the file, with version/date/feature notes.
- **CSS:** Uses versioned comment blocks to document style changes. Light/dark themes are handled via `:root[data-theme=...]` selectors.
- **UI/UX:** Prioritizes accessibility and clarity for dispatchers (e.g., color-coded unit status, keyboard-friendly controls).
- **Error Handling:** Defensive coding in JS (try/catch, fallback UI) to ensure resilience in browser environments.

## Integration Points
- **Leaflet:** Only external dependency, loaded via CDN for map features.
- **No Backend:** All data is local to the browser; no server or API calls.

## Examples
- To add a new feature, encapsulate logic in an IIFE or function, and update the changelog.
- To persist new data, use `localStorage.setItem`/`getItem` with a unique key.
- For UI changes, update both the HTML structure and corresponding CSS blocks.

## Key File
- [`hcfr_cad_down_v973_manual_roster_lineup_map_wired.html.html`](../hcfr_cad_down_v973_manual_roster_lineup_map_wired.html.html): All code, styles, and documentation.

---
For questions or unclear patterns, review the changelog and in-file comments for rationale and historical context.
