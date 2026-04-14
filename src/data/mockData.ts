export type BookingStatus =
  | "confirmed"
  | "pending"
  | "rejected"
  | "cancelled"
  | "completed";

export interface BookingTimeRange {
  readonly startTime: string; // "14:00"
  readonly endTime: string; // "16:00"
}

export interface BookingActivityItem {
  readonly id: string;
  readonly roomCode: string; // e.g. "A-102"
  readonly roomName: string; // e.g. "Design Lab"
  readonly icon: string; // material symbol name, e.g. "meeting_room"
  readonly dateLabel: string; // e.g. "Oct 24, 2023"
  readonly time: BookingTimeRange;
  readonly status: BookingStatus;
  readonly canCancel: boolean;
}

export interface BookingHistoryItem {
  readonly id: string;
  readonly roomLabel: string; // e.g. "D-404 - Media Lab"
  readonly dateTimeLabel: string; // e.g. "Oct 12 • 15:00 - 17:00"
  readonly status: Exclude<BookingStatus, "pending" | "confirmed">; // cancelled | completed | rejected
}

export interface MyBookingsMockData {
  readonly summary: {
    readonly title: string;
    readonly description: string;
    readonly reservedSlots: number;
  };
  readonly recentActivity: {
    readonly title: string;
    readonly downloadLabel: string;
    readonly items: readonly BookingActivityItem[];
  };
  readonly history: {
    readonly items: readonly BookingHistoryItem[];
    readonly cta: {
      readonly label: string;
    };
  };
}

/**
 * Mock dataset derived from `documents/designs/my_bookings.html`.
 * Keep this mock copy-focused for UI fidelity; we can translate later.
 */
export const myBookingsMockData: MyBookingsMockData = {
  summary: {
    title: "Active Reservoir",
    description: "You have 3 upcoming study sessions this week.",
    reservedSlots: 3,
  },
  recentActivity: {
    title: "Recent Activity",
    downloadLabel: "Download Report",
    items: [
      {
        id: "activity-1",
        roomCode: "A-102",
        roomName: "Design Lab",
        icon: "meeting_room",
        dateLabel: "Oct 24, 2023",
        time: { startTime: "14:00", endTime: "16:00" },
        status: "confirmed",
        canCancel: true,
      },
      {
        id: "activity-2",
        roomCode: "B-305",
        roomName: "Collaborative Space",
        icon: "hub",
        dateLabel: "Oct 26, 2023",
        time: { startTime: "09:00", endTime: "11:30" },
        status: "pending",
        canCancel: true,
      },
      {
        id: "activity-3",
        roomCode: "C-201",
        roomName: "Seminar Hall",
        icon: "school",
        dateLabel: "Oct 18, 2023",
        time: { startTime: "10:00", endTime: "12:00" },
        status: "rejected",
        canCancel: false,
      },
    ],
  },
  history: {
    items: [
      {
        id: "history-1",
        roomLabel: "D-404 - Media Lab",
        dateTimeLabel: "Oct 12 • 15:00 - 17:00",
        status: "cancelled",
      },
      {
        id: "history-2",
        roomLabel: "A-110 - Quiet Zone",
        dateTimeLabel: "Oct 10 • 08:00 - 10:00",
        status: "completed",
      },
    ],
    cta: {
      label: "Book a New Session",
    },
  },
};

