import { test } from "node:test";
import assert from "node:assert/strict";
import { isSlotInPast, parseTimeToParts } from "../src/features/rooms/utils/slotAvailability.ts";

test("parseTimeToParts parses hours, minutes and seconds safely", () => {
  assert.deepEqual(parseTimeToParts("07:30:15"), { hours: 7, minutes: 30, seconds: 15 });
  assert.deepEqual(parseTimeToParts("15:00"), { hours: 15, minutes: 0, seconds: 0 });
  assert.deepEqual(parseTimeToParts(""), { hours: 0, minutes: 0, seconds: 0 });
});

test("all slots on prior dates are marked as past", () => {
  const now = new Date("2026-10-20T10:00:00Z");
  assert.equal(isSlotInPast("2026-10-19", "07:00:00", now), true);
  assert.equal(isSlotInPast("2026-10-19", "18:00:00", now), true);
});

test("slots on future dates are not marked as past", () => {
  const now = new Date("2026-10-20T10:00:00Z");
  assert.equal(isSlotInPast("2026-10-21", "07:00:00", now), false);
  assert.equal(isSlotInPast("2026-10-21", "18:00:00", now), false);
});

test("slots on same day are past if startTime <= now", () => {
  // Use local time for same-day comparison
  const now = new Date(2026, 9, 20, 14, 0, 0); // 14:00 on 2026-10-20
  // Morning slots (07:00, 09:30, 13:00) have started or passed
  assert.equal(isSlotInPast("2026-10-20", "07:00:00", now), true);
  assert.equal(isSlotInPast("2026-10-20", "09:30:00", now), true);
  assert.equal(isSlotInPast("2026-10-20", "13:00:00", now), true);
  // Evening slot (15:30) is in future
  assert.equal(isSlotInPast("2026-10-20", "15:30:00", now), false);
});

test("invalid or empty inputs return false safely", () => {
  const now = new Date();
  assert.equal(isSlotInPast("", "07:00:00", now), false);
  assert.equal(isSlotInPast("2026-10-20", "", now), false);
  assert.equal(isSlotInPast("invalid-date", "07:00:00", now), false);
});
