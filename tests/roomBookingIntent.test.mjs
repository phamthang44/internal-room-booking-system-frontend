import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRoomBookingUrl, readRoomBookingIntent } from "../src/features/rooms/utils/roomBookingIntent.ts";

test("booking choices round-trip through a reloadable room link", () => {
  const url = new URL(buildRoomBookingUrl("42", { bookingDate: "2026-10-21", timeSlotIds: [1, 3], minCapacity: 8 }), "http://localhost");
  assert.equal(url.pathname, "/rooms/42");
  assert.deepEqual(url.searchParams.getAll("timeSlotIds"), ["1", "3"]);
  assert.deepEqual(readRoomBookingIntent(url.searchParams), { date: "2026-10-21", slotIds: ["1", "3"], attendees: "8" });
});

test("a room link without filters does not invent booking choices", () => {
  assert.equal(buildRoomBookingUrl("42", { bookingDate: "", timeSlotIds: [], minCapacity: "" }), "/rooms/42");
  assert.deepEqual(readRoomBookingIntent(new URLSearchParams()), { date: "", slotIds: [], attendees: "" });
});

test("invalid dates cannot silently become a different calendar date", () => {
  for (const date of ["2026-02-30", "2026-13-01", "2026-1-2", "2026-10-21T00:00:00Z", "invalid"]) {
    assert.equal(readRoomBookingIntent(new URLSearchParams({ bookingDate: date })).date, "");
  }
  assert.equal(readRoomBookingIntent(new URLSearchParams({ bookingDate: "2028-02-29" })).date, "2028-02-29");
});

test("URL slot values are positive integers, unique and limited to two", () => {
  const params = new URLSearchParams("timeSlotIds=0&timeSlotIds=-1&timeSlotIds=1.5&timeSlotIds=1&timeSlotIds=1&timeSlotIds=3&timeSlotIds=4");
  assert.deepEqual(readRoomBookingIntent(params).slotIds, ["1", "3"]);
});

test("invalid attendee counts are rejected rather than truncated or coerced", () => {
  for (const attendees of ["0", "-1", "1.5", "2e2", "Infinity", "2147483648", "<script>"]) {
    assert.equal(readRoomBookingIntent(new URLSearchParams({ attendees })).attendees, "");
  }
});

test("room identifiers cannot inject a different path or query", () => {
  assert.equal(buildRoomBookingUrl("a/b?c=d", { bookingDate: "", timeSlotIds: [], minCapacity: "" }), "/rooms/a%2Fb%3Fc%3Dd");
});
