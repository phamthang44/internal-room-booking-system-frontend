# Workspace UI

The interface keeps Academic Atelier's navy identity and prioritizes daily booking work.
The visual direction uses the `high-end-visual-design` skill's light surfaces, nested
enclosures, restrained shadows and deliberate motion, adapted to working app screens.

## Shared rules

- Manrope for headings, body text and controls; tabular numbers for figures.
- Navy primary `#173b58`; neutral workspace `#f4f6f8`; white content surfaces.
- One page inset, owned by `AppLayout`. New routes use `page-frame`; existing `mx-auto`
  page wrappers are normalized by the compatibility rule in `workspace.css`.
- `workspace-intro` / `page-title` establish page headings. `action-primary` and
  `action-secondary` provide consistent 44px, pill-shaped actions.
- Use `panel-shell` with an inner `panel-content` for an emphasized nested surface;
  reserve this treatment for major objects rather than every piece of metadata.
- Shared semantic statuses: green for available/confirmed, amber for pending or
  maintenance, rose for cancelled/rejected/unavailable. Always include a text label.
- Custom easing is defined by `--workspace-ease`. Respect reduced motion. Content
  remains readable without animation; no artificial wait is added to data loading.

## Page priorities

- Student dashboard: upcoming bookings and check-in before secondary metrics.
- Staff dashboard: pending approvals and operational status before analytics.
- Rooms: search, availability, capacity and equipment; real photography when present,
  with the room identifier as an honest fallback when no image exists.
- My bookings: keyword/date/status first; secondary filters in a native disclosure;
  current booking rows before summary information on phones.

## Responsive and keyboard behavior

- Workspace sidebar folds away below 1024px. Phone content has a single page inset.
- Dashboard work columns stack below 1101px. Metrics use a deliberate 2-column phone
  layout, with the leading student metric spanning both columns.
- Sidebar and room-filter drawers support Escape, contain keyboard focus and restore
  focus to the triggering control. Closed navigation is inert.
- A skip link targets the main content. Date selection uses a real button. Selected
  time slots and status views expose their state with `aria-pressed`.

## Verification

The redesign was checked in Edge with intercepted API fixtures at 1440px, 768px and
390px across student/admin dashboards, rooms, room detail, my bookings, admin rooms
and approvals. Fixtures are local QA data, not production records. API contracts,
booking permissions and session storage remain unchanged.

## Room search and booking intent

- Date, up to two time slots and attendee count are visible above the results on
  every device. Equipment and room-status filters stay in the secondary panel.
- The date window matches the backend room-detail schedule: today through six days
  ahead. Slot times and IDs were checked against the running backend.
- Attendees map to the API's minimum `capacity`; multiple slots use repeated
  `timeSlotIds` parameters. Changing search criteria resets pagination to page one.
- Room links carry `bookingDate`, repeated `timeSlotIds` and `attendees` in the URL.
  The availability modal also offers a continuation link with these choices.
- Detail prefills are validated against the room schedule. Missing dates do not
  silently switch to another date. Unavailable or elapsed slots cannot be submitted.
  Background schedule refreshes preserve typed purpose and attendees.
- Unit checks: `node --test tests/roomBookingIntent.test.mjs` (Node 24 used for QA).
  Browser checks covered desktop/tablet/mobile, reloads, pagination, unavailable
  slots and continuation from the availability modal. Authenticated, read-only
  checks against the running Docker backend confirmed the date/capacity/slot
  filters; no booking was created or changed during verification.

## Form controls and applied filters

- Shared inputs and both select implementations use 48px controls, 12px corners,
  a quiet tinted surface, and one consistent focus treatment. Select menus use
  44px option rows with a selected checkmark and a separate keyboard highlight.
- CustomSelect supports arrows, Home/End, Enter/Space, Escape, Tab and typeahead.
  Only the menu scrolls when navigating options. Closed menus leave the DOM.
- Room dates use a localized seven-day list. The trigger shows a compact weekday
  and date; the wider menu shows the full weekday. There is no browser-specific
  native date presentation on this screen.
- Equipment is a radio group because the API accepts one equipment ID. Both status
  and equipment include explicit unrestricted choices; equipment labels are localized.
- Reset in the secondary panel clears only status/equipment. Applied-filter chips
  above results remove individual criteria; Clear all resets the full search.
  Removing a date also clears its dependent time slots.
- Mobile filters include a Show results action. QA covers 1440/768/390/320px,
  keyboard operation, search synchronization, scoped/full resets and booking intent.
