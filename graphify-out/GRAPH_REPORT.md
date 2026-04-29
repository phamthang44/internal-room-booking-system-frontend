# Graph Report - src/features  (2026-04-29)

## Corpus Check
- 186 files · ~60,971 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 462 nodes · 359 edges · 25 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Feature module 0|Feature module 0]]
- [[_COMMUNITY_Feature module 1|Feature module 1]]
- [[_COMMUNITY_Feature module 2|Feature module 2]]
- [[_COMMUNITY_Feature module 4|Feature module 4]]
- [[_COMMUNITY_Feature module 5|Feature module 5]]
- [[_COMMUNITY_Feature module 6|Feature module 6]]
- [[_COMMUNITY_Feature module 7|Feature module 7]]
- [[_COMMUNITY_Feature module 9|Feature module 9]]
- [[_COMMUNITY_Feature module 10|Feature module 10]]
- [[_COMMUNITY_Feature module 11|Feature module 11]]
- [[_COMMUNITY_Feature module 13|Feature module 13]]
- [[_COMMUNITY_Feature module 15|Feature module 15]]
- [[_COMMUNITY_Feature module 16|Feature module 16]]
- [[_COMMUNITY_Feature module 17|Feature module 17]]
- [[_COMMUNITY_Feature module 18|Feature module 18]]
- [[_COMMUNITY_Feature module 21|Feature module 21]]
- [[_COMMUNITY_Feature module 25|Feature module 25]]
- [[_COMMUNITY_Feature module 26|Feature module 26]]
- [[_COMMUNITY_Feature module 27|Feature module 27]]
- [[_COMMUNITY_Feature module 31|Feature module 31]]
- [[_COMMUNITY_Feature module 32|Feature module 32]]
- [[_COMMUNITY_Feature module 36|Feature module 36]]
- [[_COMMUNITY_Feature module 37|Feature module 37]]
- [[_COMMUNITY_Feature module 38|Feature module 38]]
- [[_COMMUNITY_Feature module 39|Feature module 39]]

## God Nodes (most connected - your core abstractions)
1. `t()` - 25 edges
2. `adaptMyBookings()` - 6 edges
3. `formatBookingHistoryTitle()` - 6 edges
4. `useAdminRoomsService()` - 5 edges
5. `adaptApprovalsRow()` - 5 edges
6. `adaptBookingDetail()` - 5 edges
7. `normalizeCode()` - 5 edges
8. `adaptRoomDetail()` - 5 edges
9. `unwrapApiResult()` - 4 edges
10. `getBookingHistoryTitleI18nKey()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `uploadImages()` --calls--> `t()`  [INFERRED]
  adminRooms\components\RoomMediaSection.tsx → penalties\components\AdminPenaltyPanel.tsx
- `slotStatusLabel()` --calls--> `t()`  [INFERRED]
  adminRooms\pages\AdminRoomAuditPanelPage.tsx → penalties\components\AdminPenaltyPanel.tsx
- `cn()` --calls--> `t()`  [INFERRED]
  adminUsers\components\AdminUsersTable.tsx → penalties\components\AdminPenaltyPanel.tsx
- `getErrorMessage()` --calls--> `t()`  [INFERRED]
  auth\hooks\useGoogleAuth.ts → penalties\components\AdminPenaltyPanel.tsx
- `cn()` --calls--> `t()`  [INFERRED]
  notifications\components\NotificationsPopover.tsx → penalties\components\AdminPenaltyPanel.tsx

## Communities

### Community 0 - "Feature module 0"
Cohesion: 0.05
Nodes (19): getDisplayStatusLabel(), getStatusTheme(), normalizeStatusKey(), getViolationLabel(), t(), cn(), cn(), cn() (+11 more)

### Community 1 - "Feature module 1"
Cohesion: 0.16
Nodes (10): adaptRoom(), buildGradient(), adaptCreateBookingResponse(), adaptRoomDetail(), formatBookingTimeSlotSummary(), pickRoomStatus(), sortSchedule(), isRoomStatusApiAvailable() (+2 more)

### Community 2 - "Feature module 2"
Cohesion: 0.24
Nodes (9): adaptBookingDetail(), adaptMyBookings(), canCancelFromStatus(), iconForStatus(), mapStatusApiToUi(), toTimeRange(), toTimeSummary(), deriveCheckInWindow() (+1 more)

### Community 4 - "Feature module 4"
Cohesion: 0.36
Nodes (8): resolveEventTitle(), formatBookingHistoryTitle(), getBookingHistoryIcon(), getBookingHistoryTitleI18nKey(), getBookingHistoryTone(), humanizeCode(), normalizeCode(), pairKey()

### Community 5 - "Feature module 5"
Cohesion: 0.22
Nodes (1): slotStatusLabel()

### Community 6 - "Feature module 6"
Cohesion: 0.28
Nodes (5): formatTimeShort(), handleConfirm(), isSlotInPast(), mapApiSlotToBookingSlot(), parseTimeToParts()

### Community 7 - "Feature module 7"
Cohesion: 0.36
Nodes (5): useAdminRoomsService(), useAdminRoomCreateMutation(), useAdminRoomDetailQuery(), useAdminRoomStatusMutation(), useAdminRoomUpdateMutation()

### Community 9 - "Feature module 9"
Cohesion: 0.48
Nodes (4): generatePassword(), pickChar(), randomInt(), shuffleInPlace()

### Community 10 - "Feature module 10"
Cohesion: 0.33
Nodes (2): getViolationTypeLabel(), normalizeViolationTypeKey()

### Community 11 - "Feature module 11"
Cohesion: 0.29
Nodes (1): cn()

### Community 13 - "Feature module 13"
Cohesion: 0.6
Nodes (4): isApiEnvelope(), isApiResult(), normalizePage(), unwrapApiResult()

### Community 15 - "Feature module 15"
Cohesion: 0.47
Nodes (3): approveOne(), isPendingBooking(), openReject()

### Community 16 - "Feature module 16"
Cohesion: 0.6
Nodes (5): adaptApprovalsRow(), initialsFromName(), normalizeReliability(), safeDateLabel(), safeSlotRange()

### Community 17 - "Feature module 17"
Cohesion: 0.6
Nodes (4): normalizePage(), readMeta(), readMetaMessage(), unwrapApiResult()

### Community 18 - "Feature module 18"
Cohesion: 0.5
Nodes (2): isSelected(), toggleEquipment()

### Community 21 - "Feature module 21"
Cohesion: 0.5
Nodes (2): handleRowKeyDown(), openRow()

### Community 25 - "Feature module 25"
Cohesion: 0.67
Nodes (2): unwrapApiResult(), unwrapCreateResult()

### Community 26 - "Feature module 26"
Cohesion: 0.5
Nodes (1): uploadImages()

### Community 27 - "Feature module 27"
Cohesion: 0.5
Nodes (1): cn()

### Community 31 - "Feature module 31"
Cohesion: 0.5
Nodes (1): getErrorMessage()

### Community 32 - "Feature module 32"
Cohesion: 0.67
Nodes (2): cn(), t()

### Community 36 - "Feature module 36"
Cohesion: 1.0
Nodes (2): useAdminRoomUpsertForm(), useAdminRoomUpsertSchema()

### Community 37 - "Feature module 37"
Cohesion: 1.0
Nodes (2): extractAdminRoomsErrorCode(), messageForAdminRoomsError()

### Community 38 - "Feature module 38"
Cohesion: 1.0
Nodes (2): adminBookingDetailQueryKey(), useAdminBookingDetailDisclosure()

### Community 39 - "Feature module 39"
Cohesion: 1.0
Nodes (2): decodeJWT(), isTokenExpired()

## Knowledge Gaps
- **Thin community `Feature module 5`** (9 nodes): `AdminRoomAuditPanelPage.tsx`, `confirmStatus()`, `formatIsoDate()`, `formatIsoDay()`, `formatIsoDayShort()`, `formatTime()`, `openStatusModal()`, `slotStatusLabel()`, `statusBadgeClass()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 10`** (7 nodes): `clamp()`, `formatDateLabel()`, `getViolationTypeLabel()`, `normalizeViolationTypeKey()`, `StatChip()`, `TogglePills()`, `AdminAnalyticsSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 11`** (7 nodes): `bookingIdFromRelatedId()`, `canNavigate()`, `cn()`, `iconForType()`, `stablePreviewCount()`, `toastToneForType()`, `NotificationsPopover.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 18`** (5 nodes): `RoomEquipmentSection.tsx`, `getQuantity()`, `isSelected()`, `setEquipmentQuantity()`, `toggleEquipment()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 21`** (5 nodes): `BookingActivityRow.tsx`, `fallbackStyles()`, `handleRowKeyDown()`, `mapToChipStatus()`, `openRow()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 25`** (4 nodes): `adminRooms.api.service.ts`, `assertApiSuccess()`, `unwrapApiResult()`, `unwrapCreateResult()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 26`** (4 nodes): `RoomMediaSection.tsx`, `addImageUrl()`, `removeImageAt()`, `uploadImages()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 27`** (4 nodes): `AdminUsersTable.tsx`, `cn()`, `initials()`, `statusPillClass()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 31`** (4 nodes): `useGoogleAuth.ts`, `categorizeError()`, `getErrorMessage()`, `useGoogleAuth()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 32`** (4 nodes): `MyBookingsPage.tsx`, `cn()`, `status()`, `t()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 36`** (3 nodes): `useAdminRoomUpsertForm.ts`, `useAdminRoomUpsertForm()`, `useAdminRoomUpsertSchema()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 37`** (3 nodes): `adminRoomsErrors.ts`, `extractAdminRoomsErrorCode()`, `messageForAdminRoomsError()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 38`** (3 nodes): `useAdminBookingDetailDisclosure.ts`, `adminBookingDetailQueryKey()`, `useAdminBookingDetailDisclosure()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feature module 39`** (3 nodes): `jwt.ts`, `decodeJWT()`, `isTokenExpired()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `t()` connect `Feature module 0` to `Feature module 4`, `Feature module 5`, `Feature module 6`, `Feature module 10`, `Feature module 11`, `Feature module 26`, `Feature module 27`, `Feature module 31`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `formatBookingHistoryTitle()` connect `Feature module 4` to `Feature module 0`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `slotStatusLabel()` connect `Feature module 5` to `Feature module 0`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Are the 24 inferred relationships involving `t()` (e.g. with `cn()` and `cn()`) actually correct?**
  _`t()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `formatBookingHistoryTitle()` (e.g. with `resolveEventTitle()` and `t()`) actually correct?**
  _`formatBookingHistoryTitle()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useAdminRoomsService()` (e.g. with `useAdminRoomDetailQuery()` and `useAdminRoomCreateMutation()`) actually correct?**
  _`useAdminRoomsService()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `Feature module 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._