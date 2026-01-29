# HCFR CAD-DOWN: AI Coding Agent Instructions

## Project Overview
**HCFR CAD-DOWN** is a single-page dispatch management application (fire/rescue CAD system) built as vanilla HTML/CSS/JavaScript. It manages emergency calls, unit dispatch, messaging, and operational status across multiple synchronized windows (GATE, TAC 1/2, UNIT STATUS, CALL ENTRY).

**Key Property**: All application state persists via `localStorage` with a **canonical call-log** as the system of record (`hcfr_call_log_v1`). Multiple UI modules (GATE, TAC, CALL ENTRY) must stay synchronized by reading/writing to this shared store.

---

## Architecture & Data Flow

### Data Persistence (Critical)
- **Canonical Call Log**: `localStorage.hcfr_call_log_v1` — master store for all calls
  - Each call has: `id`, `address`, `nature`, `grid`, `units`, `status` (WAITING/ACTIVE/CLOSED), `priority`, `notes`, `notesLog`, `unitStatusLog`
  - Must be updated on CREATE, DISPATCH (unit assignment), and CLOSE operations
  - All boards (GATE, TAC, CALL ENTRY) read from this single source
- **Dispatcher ID**: `localStorage.hcfr_dispatcher_id` — filter "my calls" by dispatcher
- **Fire Apparatus Status Display (FASD)**: `localStorage.hcfr_fasd_rows_v1` — unit roster + status
- **Messaging**: `localStorage.hcfrCadDownMessages` — timestamped messages with dispatcher attribution
- **Unit Status Map**: `localStorage.hcfr_unit_status_map_v1` — unit → status lookup

### Module Architecture
- **GATE** (Active Calls board): Reads calls from canonical log, WAITING on top / ACTIVE on bottom
- **TAC 1 & TAC 2** (Readonly snapshots): Render from localStorage snapshot without introducing render loops
- **UNIT STATUS**: Interactive tile grid for unit status changes, tied to dispatcher/unit area model
- **CALL ENTRY**: Form to create calls; upserts to canonical log immediately on submit
- **Fire Apparatus Status Display (FASD)**: Right-side resizable panel showing unit roster/status

### Window Management
- **Multi-window tabs**: Elements `#hcfrCadTabs` and `#hcfrCadWindows` with `.hcfr-window[data-window="gate|tac1|tac2|unit-status"]`
- **Active window tracking**: `window.__hcfrActiveWindow` or query `.hcfr-window.active`
- **Version authority**: `window.HCFR_VERSION` (e.g., "v950") syncs title + console banner

---

## Critical Conventions & Patterns

### Call Lifecycle
1. **CREATE** (CALL ENTRY form submit)
   - Generate unique `id`, create call object
   - Upsert to `localStorage.hcfr_call_log_v1` → status = WAITING
   - Mirror to legacy storage key for backward compatibility
   
2. **DISPATCH** (assign unit from GATE/TAC/UNIT STATUS)
   - Merge unit into `units` array/string
   - Promote call to ACTIVE status
   - Persist **immediately** to canonical log (don't rely on background sync)
   
3. **CLOSE** (from GATE/TAC row click or button)
   - Set call status = CLOSED
   - Remove from active views instantly
   - Persist to canonical log
   - Must use call ID from DOM row, not button text (to avoid corruption)

### Unit Status Colors (Global Palette)
Used consistently across GATE, TAC, UNIT STATUS, FASD:
- **Dispatched**: `#facc15` (yellow)
- **En-Route**: `#166534` (dark green)
- **Staged**: `#b91c1c` (dark red)
- **On-Scene**: `#c2410c` (orange)
- **To Facility**: `#93c5fd` (light blue)
- **At Facility**: `#1d4ed8` (deep blue)
- **Available**: `#22c55e` (bright green)
- **In Command**: `#84a62a` (olive)
- **Out-of-Service**: `#020617` (dark) with border `rgba(148,163,184,0.55)`
- **Out of District**: `#ffffff` (white)

Apply via CSS classes `.s-{status}` on tiles.

### Theme Variables (CSS Custom Properties)
```css
--hcfr-bg, --hcfr-surface, --hcfr-surface-2  /* bg layers */
--hcfr-text, --hcfr-muted                     /* text colors */
--hcfr-border                                 /* dividers */
--hcfr-accent, --hcfr-accent-text             /* interactive */
--hcfr-input-bg, --hcfr-input-text            /* form fields */
```
Dark mode (default): `#020617` bg, `#e5e7eb` text  
Light mode: `:root[data-theme="light"]` sets white bg, `#0f172a` text

---

## Key Functions & APIs

### Storage Helpers
```javascript
// Save canonical call log (must preserve wrapped/legacy formats)
hcfrSaveCallLog(calls)

// Upsert call into log (on CREATE/DISPATCH/CLOSE)
localStorage.hcfr_call_log_v1 = JSON.stringify(calls)

// Load calls for filtering by dispatcher
const calls = JSON.parse(localStorage.hcfr_call_log_v1 || '{"calls":[]}')

// Apply/retrieve dispatcher ID
window.applyDispatcherId(id)
window.dispatcherId  // or window.__HCFR_DISPATCHER_ID
```

### Dispatcher & Login
```javascript
setDispatcherId(id)           // set and persist dispatcher
hcfrLoginContinue()           // hide login overlay
hcfrOnDispatcherIdChange()    // re-render boards when dispatcher changes
```

### Version Management
```javascript
window.HCFR_VERSION = "v950"  // syncs title + console on load
// Auto-updates document.title and header h1 via applyVersion()
```

### Unit Status (Interactive Tiles)
```javascript
fasdSetVisible(windowKey, visible)  // toggle FASD panel visibility
fasdRenderActiveIfVisible(bool)     // render only if visible
fasdGetActiveWindowKey()            // current active window
```

---

## Common Fixes & Validation Rules

### Call Object Structure (Required Fields)
```javascript
{
  id: "unique-id",
  address: "123 Main St",           // NOT "addr" (critical fix in v966!)
  nature: "MEDICAL - Chest Pain",
  grid: "A5",
  priority: "Medium",
  units: "Engine1, Rescue2",        // or array ["Engine1", "Rescue2"]
  status: "ACTIVE",                 // WAITING, ACTIVE, or CLOSED
  notesLog: [{timestamp, dispatcher, text}, ...],
  unitStatusLog: [{timestamp, dispatcher, unit, status}, ...]
}
```

### Common Bugs & Fixes
1. **Field Mismatch**: Use `address` not `addr` (v966 fix)
2. **Persistence Timeout**: Always save immediately, don't queue
3. **TAC Render Loop**: Read localStorage snapshot instead of live call-log
4. **Unit Tile Wrapping**: Use flex-wrap on `.tac-units-wrap` to show all units
5. **Module Overlay (Call Detail)**: Ensure dark theme overrides don't affect module body
6. **Dispatcher Filter**: Use current `window.dispatcherId` to show "my calls" first

---

## Testing & Validation
- **Multi-window sync**: Create call in CALL ENTRY → verify in GATE (WAITING) → dispatch unit → verify ACTIVE in TAC/UNIT STATUS → close → verify gone from all
- **localStorage**: Open DevTools Console, verify `JSON.parse(localStorage.hcfr_call_log_v1)` has correct structure
- **Dispatcher ID**: Change dispatcher in header → "my calls" filter should update
- **Unit Colors**: Tile backgrounds must match `.s-{status}` palette; check with color picker

---

## File Organization
- **Single HTML file** (`hcfr_cad_down_v966_manual_roster_lineup_map_wired.html.html`)
  - All CSS (inline `<style>`)
  - All JS (inline `<script>`)
  - External: Leaflet (for map preview) + Leaflet map markers
- **Version in changelog** at top (list all fixes/features by version)
- **Comments format**: `/* v{version}: description */` for quick version blame

## Development Workflow
1. **Version Bump**: Update `window.HCFR_VERSION` (e.g., v951)
2. **Add Changelog Entry**: Insert at top of HTML in comment block (most recent first)
3. **Test**: Open file in browser, test sync across all windows
4. **Console**: Verify no errors; check localStorage for corruption
5. **Commit**: Use version label in git message, e.g., `"v951: feature description"`
