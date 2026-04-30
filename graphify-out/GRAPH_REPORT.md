# Graph Report - room-booking-frontend  (2026-04-29)

## Corpus Check
- 241 files · ~187,004 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 580 nodes · 465 edges · 26 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `t()` - 27 edges
2. `useI18n()` - 14 edges
3. `getAuthConfig()` - 9 edges
4. `adaptMyBookings()` - 6 edges
5. `formatBookingHistoryTitle()` - 6 edges
6. `normalizeApiError()` - 6 edges
7. `presentBookingNotification()` - 5 edges
8. `useAdminRoomsService()` - 5 edges
9. `adaptApprovalsRow()` - 5 edges
10. `adaptBookingDetail()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `slotStatusLabel()` --calls--> `t()`  [INFERRED]
  src\features\adminRooms\pages\AdminRoomAuditPanelPage.tsx → src\features\penalties\components\AdminPenaltyPanel.tsx
- `getErrorMessage()` --calls--> `t()`  [INFERRED]
  src\features\auth\hooks\useGoogleAuth.ts → src\features\penalties\components\AdminPenaltyPanel.tsx
- `getErrorMessage()` --calls--> `t()`  [INFERRED]
  src\features\auth\hooks\useGoogleLogin.ts → src\features\penalties\components\AdminPenaltyPanel.tsx
- `t()` --calls--> `handleConfirm()`  [INFERRED]
  src\features\penalties\components\AdminPenaltyPanel.tsx → src\features\rooms\components\detail\BookingSidebar.tsx
- `formatDisplayDate()` --calls--> `t()`  [INFERRED]
  src\shared\utils\date.ts → src\features\penalties\components\AdminPenaltyPanel.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (17): getDisplayStatusLabel(), getStatusTheme(), normalizeStatusKey(), getViolationLabel(), t(), cn(), cn(), cn() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (16): StatusBadge(), BookingHistoryCard(), EquipmentTag(), FullScreenLoader(), LanguageSwitcher(), RoomCard(), RoomStatusChip(), BookingLocationMap() (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (6): normalizeApiError(), titleKeyForStatus(), fingerprint(), presentAppError(), pushErrorToast(), showToastError()

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (10): adaptRoom(), buildGradient(), adaptCreateBookingResponse(), adaptRoomDetail(), formatBookingTimeSlotSummary(), pickRoomStatus(), sortSchedule(), isRoomStatusApiAvailable() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (9): fetchAdminBookingTrend(), fetchAdminDashboardOverview(), fetchAdminRoomStats(), fetchAdminViolationTrend(), fetchAdminRoomsListPage(), getAuthConfig(), getAuthConfigWithHeaders(), fetchStudentDashboard() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.24
Nodes (9): adaptBookingDetail(), adaptMyBookings(), canCancelFromStatus(), iconForStatus(), mapStatusApiToUi(), toTimeRange(), toTimeSummary(), deriveCheckInWindow() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (8): getLanguageFromStorage(), formatDisplayDate(), formatIsoRelativeCaption(), getRelativeTime(), fingerprint(), mapTypeToMaterialIcon(), mapTypeToTone(), presentBookingNotification()

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (8): extractApiErrorMessage(), getApiErrorCode(), isValidationApiError(), getNestedValue(), interpolate(), translate(), extractAdminRoomsErrorCode(), messageForAdminRoomsError()

### Community 9 - "Community 9"
Cohesion: 0.36
Nodes (8): resolveEventTitle(), formatBookingHistoryTitle(), getBookingHistoryIcon(), getBookingHistoryTitleI18nKey(), getBookingHistoryTone(), humanizeCode(), normalizeCode(), pairKey()

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (1): slotStatusLabel()

### Community 11 - "Community 11"
Cohesion: 0.28
Nodes (5): formatTimeShort(), handleConfirm(), isSlotInPast(), mapApiSlotToBookingSlot(), parseTimeToParts()

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (2): useInitAuth(), RouterContent()

### Community 13 - "Community 13"
Cohesion: 0.36
Nodes (5): useAdminRoomsService(), useAdminRoomCreateMutation(), useAdminRoomDetailQuery(), useAdminRoomStatusMutation(), useAdminRoomUpdateMutation()

### Community 15 - "Community 15"
Cohesion: 0.48
Nodes (4): generatePassword(), pickChar(), randomInt(), shuffleInPlace()

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (2): getViolationTypeLabel(), normalizeViolationTypeKey()

### Community 18 - "Community 18"
Cohesion: 0.6
Nodes (4): isApiEnvelope(), isApiResult(), normalizePage(), unwrapApiResult()

### Community 19 - "Community 19"
Cohesion: 0.47
Nodes (3): approveOne(), isPendingBooking(), openReject()

### Community 20 - "Community 20"
Cohesion: 0.6
Nodes (5): adaptApprovalsRow(), initialsFromName(), normalizeReliability(), safeDateLabel(), safeSlotRange()

### Community 21 - "Community 21"
Cohesion: 0.6
Nodes (4): normalizePage(), readMeta(), readMetaMessage(), unwrapApiResult()

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (2): isSelected(), toggleEquipment()

### Community 25 - "Community 25"
Cohesion: 0.5
Nodes (3): adminBookingDetailQueryKey(), useAdminBookingDetailDisclosure(), useDebouncedValue()

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (2): handleRowKeyDown(), openRow()

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (2): unwrapApiResult(), unwrapCreateResult()

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (2): cn(), t()

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (2): useAdminRoomUpsertForm(), useAdminRoomUpsertSchema()

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (2): decodeJWT(), isTokenExpired()

## Knowledge Gaps
- **Thin community `Community 10`** (9 nodes): `confirmStatus()`, `formatIsoDate()`, `formatIsoDay()`, `formatIsoDayShort()`, `formatTime()`, `openStatusModal()`, `slotStatusLabel()`, `statusBadgeClass()`, `AdminRoomAuditPanelPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (8 nodes): `useInitAuth()`, `AdminRoute()`, `ProtectedRoute()`, `Router()`, `RouterContent()`, `StaffRoute()`, `router.tsx`, `useInitAuth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (7 nodes): `clamp()`, `formatDateLabel()`, `getViolationTypeLabel()`, `normalizeViolationTypeKey()`, `StatChip()`, `TogglePills()`, `AdminAnalyticsSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `getQuantity()`, `isSelected()`, `setEquipmentQuantity()`, `toggleEquipment()`, `RoomEquipmentSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (5 nodes): `fallbackStyles()`, `handleRowKeyDown()`, `mapToChipStatus()`, `openRow()`, `BookingActivityRow.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (4 nodes): `assertApiSuccess()`, `unwrapApiResult()`, `unwrapCreateResult()`, `adminRooms.api.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (4 nodes): `cn()`, `status()`, `t()`, `MyBookingsPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `useAdminRoomUpsertForm()`, `useAdminRoomUpsertSchema()`, `useAdminRoomUpsertForm.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (3 nodes): `jwt.ts`, `decodeJWT()`, `isTokenExpired()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `t()` connect `Community 0` to `Community 1`, `Community 6`, `Community 9`, `Community 10`, `Community 11`, `Community 16`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `getRelativeTime()` connect `Community 6` to `Community 0`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `t()` (e.g. with `cn()` and `cn()`) actually correct?**
  _`t()` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `useI18n()` (e.g. with `StatusBadge()` and `LanguageSwitcher()`) actually correct?**
  _`useI18n()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `getAuthConfig()` (e.g. with `fetchAdminRoomsListPage()` and `fetchAdminDashboardOverview()`) actually correct?**
  _`getAuthConfig()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `formatBookingHistoryTitle()` (e.g. with `resolveEventTitle()` and `t()`) actually correct?**
  _`formatBookingHistoryTitle()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._