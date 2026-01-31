# HCFR CAD-DOWN CHANGELOG

---

## v963 | 2026-01-27 (America/New_York)
- Change: Station lineup remains Haversine (crow distance) but now supports optional deterministic barrier-penalty refinement (rivers/bays/limited crossings) with adjustable barrier lines.
- Change: Lineup display shows adjusted distance; if a barrier penalty applies, shows raw + penalty breakdown.

## v956 | 2026-01-27 (America/New_York)
- Update: Fire Station Lineup and Station # autofill now use STATIONS🚒 tab roster (Stations 1–47).
- Update: Station quick-entry keeps existing behavior (enter station number or PSOC) while using updated station addresses/cross streets/grids.

## v936 | 2026-01-22 (America/New_York)
- Feature: Excel XML export now generates three worksheets (Calls, Notes, Unit Status) for easier filtering/auditing.
- Feature: Calls sheet remains pre-formatted (column widths, wrap, top align, frozen header row).

## v935 | 2026-01-22 (America/New_York)
- Feature: Excel XML export now opens pre-formatted (column widths, wrap, top align, frozen header row).

## v934 | 2026-01-22 (America/New_York)
- Fix: Notes export now populates via narrative/notes blur-logging with timestamp + dispatcher attribution (notesLog).
- Fix: Add-note dispatcher attribution now uses dispatcherId / dispatcher-id consistently.

## v933 | 2026-01-22 (America/New_York)
- Fix: Excel XML export now includes notesLog and unitStatusLog columns (were not included in column set)

## v932 | 2026-01-22 (America/New_York)
- Change: Excel export is now the primary export (SpreadsheetML .xls); CSV export option removed
- Change: Export now includes note history (timestamp + dispatcher) and unit status history (timestamp + dispatcher + unit + status)
- Change: Unit status changes are persisted onto the selected call for export/audit

## v929 | 2026-01-22 (America/New_York)
- Change: Excel export now uses SpreadsheetML (.xls) for native Excel compatibility (no warning dialog).
- Change: Excel export scope is ALL calls (all users, all statuses) for administrative reporting.
- Note: CSV export remains available.
- Fix: Export uses true file download via Blob for Excel compatibility.

## v925 | 2026-01-22 (America/New_York)
- Fix: CSV export now uses UTF-8 BOM and Windows CRLF newlines for reliable Excel import.
- Fix: CSV export enforced as file download via Blob (no tab-open), preserving data on open.

## v921 | 2026-01-22 (America/New_York)
- Fix: Corrected invalid JS token in persistence/export block.

## v920 | 2026-01-22 (America/New_York)
- Fix: Separate dispatcher ID persistence from calls persistence (prevents overwriting call store).
- Feature: Call log + CSV export default to showing only calls under current dispatcher ID (my calls), including Active and Closed via filter.

## v919 | 2026-01-22 (America/New_York)
- Hardening: Defensive suppression of legacy Test Siren UI on DOMContentLoaded.
- Cleanup: Remove legacy Test Siren / purge siren debug elements now permanently disabled.

## v918 | 2026-01-12 (America/New_York)
- UI: Hide Test Siren control from dispatcher header in standard operation.
- UI: Hide related purge siren debug status text.

## v845 | 2026-01-12 (America/New_York)
- Messaging: Simplified Chat addressing — removed Targeted mode; retained Broadcast and DM.
- Messaging: Added closed-chat visual notification (unread badge + pulsing launcher) for incoming messages.

## v844 | 2026-01-12 (America/New_York)
- Messaging: Replaced template-based Messaging panel with Teams-style Chat (timestamp + Dispatcher ID per message).
- Messaging: Added message priority styling (Normal/Medium/High) and reply-to capability.
- Messaging: Added Broadcast, Targeted (to one or more dispatcher IDs), and DM modes with view filtering.

## v843 | 2026-01-12 (America/New_York)
- UI: Added an in-app Messaging panel (floating button + modal) with message composer, templates, history, copy/export.
- Storage: Messages persist locally via localStorage (hcfrCadDownMessages).
- Safety: Module is namespaced and isolated; no changes to CAD logic.

## v842 | 2026-01-12 (America/New_York)
- Fix: Added top padding to dispatcher bar to prevent header-area text clipping.
- No CAD logic changes.

## v841 | 2026-01-12 (America/New_York)
- Chore: UI cleanup — removed Protocol Loader control from main header.
- Chore: UI cleanup — removed Geocoder mode selector from main header.
- No CAD logic changes.

## v806 | 2026-01-09 (America/New_York)
- Chore: Centralized version authority (window.HCFR_VERSION) and auto-synced title + header on load.
- Chore: Added canonical console boot banner for the authoritative version.
- No functional CAD logic changes.

## v799 | 2026-01-08 (America/New_York)
- Fix: Call-log mirroring layer added so calls are upserted into the persisted call log on CREATE, DISPATCH (unit assignment), and CLOSE.
- Result: TAC/GATE/CALL ENTRY all reference a consistent call dataset; TAC close now reports logFound=true when the call exists in persisted log.

## v798 | 2026-01-08 (America/New_York)
- Fix: TAC board now excludes CLOSED calls using a canonical closed-call predicate, and forces TAC rerender after Close.
- Result: Closing a call from TAC removes it from TAC immediately (as well as GATE and CALL ENTRY), eliminating TAC-only persistence.

## v794 | 2026-01-08 (America/New_York)
- Fix: TAC Close interceptor now reliably resolves the call ID from the TAC row (not the button text) and no longer contains corrupted code.
- Result: Closing a call from TAC updates the canonical call-log and removes the call from ACTIVE CALLS everywhere immediately.

## v793 | 2026-01-08 (America/New_York)
- Fix: Corrected addUnitToCall call-log seeding so newly-created calls remain in WAITING until a unit is assigned (prevents calls disappearing from GATE/TAC/CALL ENTRY).
- Fix: Dispatch (unit assignment) now always promotes the call to ACTIVE and persists the update to the canonical call log, even when the legacy addUnitToCall pathway returns success.
- Fix: Call creation (CALL ENTRY submit) now upserts the created call into the canonical call log and mirrors it to the legacy storage key, ensuring all boards render from the same dataset without opening the call detail.

## v714 | 2026-01-05 (America/New_York)
- Chore: Updated document title and main header version label to V714 to match current build lineage.
- No functional logic changes in this version; based on v713.

## v680 | 2026-01-04 (America/New_York)
- Fix: Closing a call from GATE/TAC now persists to the same localStorage call-log key that the UI reads, so calls disappear from ACTIVE CALLS across CALL ENTRY, GATE, and TAC consistently.
- Fix: Repaired hcfrSaveCallLog helper so it correctly writes wrapped or legacy call-log formats.

## v616 | 2025-12-31 (America/New_York)
- TAC 1/TAC 2: removed FIRE DIST column from Active Calls tables to prevent squishing.

## v611 | 2025-12-31 (America/New_York)
- Fix: units added/dispatched now persist correctly to call log by repairing unitListText assignment (was undefined 'merged' variable).
- Result: UNITS column on ACTIVE CALLS and TAC boards can populate from call schema.

## v606 | 2025-12-31 (America/New_York)
- ACTIVE CALLS: removed Action column to prevent table squish (row-click open retained).
- TAC 1/TAC 2: render from call-log snapshot read from localStorage (read-only) so UNITS reflect latest assignments without introducing render loops.

---

*For earlier versions, see project archive.*