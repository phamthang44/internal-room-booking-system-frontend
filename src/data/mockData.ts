export type BookingStatus =
  | "confirmed"
  | "pending"
  | "rejected"
  | "cancelled"
  | "inUse"
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
  readonly status: Exclude<BookingStatus, "pending" | "confirmed" | "inUse">; // cancelled | completed | rejected
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

export interface BookingLocationInfo {
  readonly primary: string; // e.g. "Room 402 - Arts Block"
  readonly secondary?: string; // e.g. "Floor 4, East Wing"
}

export interface BookingScheduleInfo {
  readonly dateLabel: string; // e.g. "Thursday, Oct 24, 2023"
  readonly timeLabel: string; // e.g. "14:00 - 16:30 (2h 30m)"
  /** yyyy-MM-dd from API; preferred for same-calendar-day checks */
  readonly dateIso?: string;
}

export interface BookingTimelineEvent {
  readonly id: string;
  /** Mock / legacy copy when API action codes are not used */
  readonly title?: string;
  /** API history action (e.g. CREATE_BOOKING); title is resolved via i18n */
  readonly action?: string;
  readonly statusAfter?: string;
  readonly atLabel: string; // e.g. "Oct 20, 2023 · 09:45 AM"
  readonly note?: string;
  readonly icon: string; // material symbol name
  readonly tone: "primary" | "neutral" | "danger";
}

export interface BookingDetail {
  readonly id: string;
  readonly bookingCode: string; // e.g. "#STU-99421"
  readonly status: BookingStatus;
  readonly title: string;
  readonly location: BookingLocationInfo;
  readonly schedule: BookingScheduleInfo;
  readonly checkInWindow?: {
    readonly opensAtIso: string;
    readonly expiresAtIso: string;
  };
  readonly purpose: string;
  readonly attendeesCount: number;
  readonly canCancel: boolean;
  readonly map: {
    readonly imageUrl: string;
    readonly title: string;
    readonly description: string;
    readonly ctaLabel: string;
  };
  readonly actions: {
    readonly addToCalendarLabel: string;
    readonly contactSupportLabel: string;
    readonly cancelLabel: string;
    readonly cancelHint: string;
  };
  readonly proTip?: {
    readonly title: string;
    readonly message: string;
  };
  readonly timeline: readonly BookingTimelineEvent[];
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

/**
 * Detail mock data derived from `documents/designs/booking_detail.html`.
 * Keyed by booking IDs used in `myBookingsMockData` (e.g. "activity-1", "history-1").
 */
export const bookingDetailsById: Readonly<Record<string, BookingDetail>> = {
  "activity-1": {
    id: "activity-1",
    bookingCode: "#STU-99421",
    status: "confirmed",
    title: "Senior Design Capstone Review",
    location: {
      primary: "Room 402 - Arts Block",
      secondary: "Floor 4, East Wing",
    },
    schedule: {
      dateLabel: "Thursday, Oct 24, 2023",
      timeLabel: "14:00 - 16:30 (2h 30m)",
    },
    purpose:
      "Final review session for the Senior Design project. The team will be presenting the 3D printed prototype and the structural integrity analysis report to the advisor. This session requires high-precision projection for CAD model walkthroughs.",
    attendeesCount: 5,
    canCancel: true,
    map: {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA",
      title: "Arts Block, Floor 4",
      description:
        "Located near the central elevator bank. Access via student ID card during business hours.",
      ctaLabel: "View Floor Map",
    },
    actions: {
      addToCalendarLabel: "Add to Calendar",
      contactSupportLabel: "Contact Support",
      cancelLabel: "Cancel Booking",
      cancelHint:
        "Cancellations must be made at least 24 hours prior to the start time.",
    },
    proTip: {
      title: "Pro-Tip",
      message:
        "Arrive 5 minutes early to test the projection system. Technical staff are available at the front desk of the Arts Block if needed.",
    },
    timeline: [
      {
        id: "t-1",
        title: "Booking Confirmed",
        atLabel: "Oct 20, 2023 · 09:45 AM",
        note:
          "\"Approved. Room 402 has the requested high-res projector available.\" — Dr. Sarah Collins (Dept. Head)",
        icon: "check",
        tone: "primary",
      },
      {
        id: "t-2",
        title: "Review Pending",
        atLabel: "Oct 19, 2023 · 14:20 PM",
        icon: "history",
        tone: "neutral",
      },
      {
        id: "t-3",
        title: "Request Submitted",
        atLabel: "Oct 19, 2023 · 11:30 AM",
        icon: "description",
        tone: "neutral",
      },
    ],
  },
  "activity-2": {
    id: "activity-2",
    bookingCode: "#STU-99457",
    status: "pending",
    title: "Collaborative Space Session",
    location: { primary: "B-305 — Collaborative Space" },
    schedule: { dateLabel: "Oct 26, 2023", timeLabel: "09:00 - 11:30" },
    purpose:
      "Collaborative planning session for upcoming coursework deliverables.",
    attendeesCount: 4,
    canCancel: true,
    map: {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA",
      title: "Building B",
      description: "Use your student card to access the floor.",
      ctaLabel: "View Floor Map",
    },
    actions: {
      addToCalendarLabel: "Add to Calendar",
      contactSupportLabel: "Contact Support",
      cancelLabel: "Cancel Booking",
      cancelHint:
        "Cancellations must be made at least 24 hours prior to the start time.",
    },
    timeline: [
      {
        id: "t2-1",
        title: "Review Pending",
        atLabel: "Oct 25, 2023 · 16:10 PM",
        icon: "history",
        tone: "neutral",
      },
      {
        id: "t2-2",
        title: "Request Submitted",
        atLabel: "Oct 25, 2023 · 15:30 PM",
        icon: "description",
        tone: "neutral",
      },
    ],
  },
  "activity-3": {
    id: "activity-3",
    bookingCode: "#STU-99312",
    status: "rejected",
    title: "Seminar Hall Request",
    location: { primary: "C-201 — Seminar Hall" },
    schedule: { dateLabel: "Oct 18, 2023", timeLabel: "10:00 - 12:00" },
    purpose: "Request was rejected due to room unavailability.",
    attendeesCount: 1,
    canCancel: false,
    map: {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA",
      title: "Seminar Hall",
      description: "Please contact support for alternatives.",
      ctaLabel: "View Floor Map",
    },
    actions: {
      addToCalendarLabel: "Add to Calendar",
      contactSupportLabel: "Contact Support",
      cancelLabel: "Cancel Booking",
      cancelHint:
        "Cancellations must be made at least 24 hours prior to the start time.",
    },
    timeline: [
      {
        id: "t3-1",
        title: "Booking Rejected",
        atLabel: "Oct 18, 2023 · 09:10 AM",
        icon: "cancel",
        tone: "danger",
      },
      {
        id: "t3-2",
        title: "Request Submitted",
        atLabel: "Oct 17, 2023 · 18:00 PM",
        icon: "description",
        tone: "neutral",
      },
    ],
  },
  "history-1": {
    id: "history-1",
    bookingCode: "#STU-99201",
    status: "cancelled",
    title: "Media Lab Session",
    location: { primary: "D-404 — Media Lab" },
    schedule: { dateLabel: "Oct 12, 2023", timeLabel: "15:00 - 17:00" },
    purpose: "Cancelled by student.",
    attendeesCount: 2,
    canCancel: false,
    map: {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA",
      title: "Media Lab",
      description: "Lab access requires student ID.",
      ctaLabel: "View Floor Map",
    },
    actions: {
      addToCalendarLabel: "Add to Calendar",
      contactSupportLabel: "Contact Support",
      cancelLabel: "Cancel Booking",
      cancelHint:
        "Cancellations must be made at least 24 hours prior to the start time.",
    },
    timeline: [
      {
        id: "h1-1",
        title: "Booking Cancelled",
        atLabel: "Oct 11, 2023 · 12:05 PM",
        icon: "cancel",
        tone: "neutral",
      },
    ],
  },
  "history-2": {
    id: "history-2",
    bookingCode: "#STU-99177",
    status: "completed",
    title: "Quiet Zone Session",
    location: { primary: "A-110 — Quiet Zone" },
    schedule: { dateLabel: "Oct 10, 2023", timeLabel: "08:00 - 10:00" },
    purpose: "Completed study session.",
    attendeesCount: 1,
    canCancel: false,
    map: {
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA",
      title: "Quiet Zone",
      description: "Arrive early for best seating.",
      ctaLabel: "View Floor Map",
    },
    actions: {
      addToCalendarLabel: "Add to Calendar",
      contactSupportLabel: "Contact Support",
      cancelLabel: "Cancel Booking",
      cancelHint:
        "Cancellations must be made at least 24 hours prior to the start time.",
    },
    timeline: [
      {
        id: "h2-1",
        title: "Booking Completed",
        atLabel: "Oct 10, 2023 · 10:05 AM",
        icon: "check",
        tone: "primary",
      },
    ],
  },
};

export interface CheckInPageMockData {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
  };
  readonly countdownLabel: string;
  readonly actions: {
    readonly primaryLabel: string;
    readonly secondaryLabel: string;
  };
  readonly policy: {
    readonly title: string;
    readonly defaultMessage: string;
  };
  readonly sections: {
    readonly purposeTitle: string;
    readonly attendeesTitle: string;
    readonly equipmentTitle: string;
  };
  readonly equipmentTags: readonly { label: string; icon?: string }[];
  readonly location: {
    readonly imageAlt: string;
    readonly ctaLabel: string;
  };
  readonly help: {
    readonly title: string;
    readonly subtitle: (roomTitle: string) => string;
    readonly contactSupportLabel: string;
    readonly faqLabel: string;
  };
  readonly postCheckInHint: string;
  readonly loadingLabel: string;
  readonly error: {
    readonly title: string;
    readonly subtitle: string;
    readonly retryLabel: string;
    readonly backToListLabel: string;
  };
  readonly attendeesLabel: (count: number) => string;
}

export const checkInPageMockData: CheckInPageMockData = {
  hero: {
    title: "Check-in for your Session",
    subtitle:
      "Welcome back. Please confirm your arrival at the venue to activate your booking and secure your reservation.",
  },
  countdownLabel: "Time Remaining",
  actions: {
    primaryLabel: "Check In Now",
    secondaryLabel: "Scan QR Code",
  },
  policy: {
    title: "Policy Notice:",
    defaultMessage:
      "Please check-in within the grace period to avoid automatic cancellation. Your space may be reallocated to the waitlist after 15 minutes of inactivity.",
  },
  sections: {
    purposeTitle: "Purpose & Agenda",
    attendeesTitle: "Attendees",
    equipmentTitle: "Equipment & Resources",
  },
  equipmentTags: [
    { label: "Projector", icon: "videocam" },
    { label: "Smart Board", icon: "tv" },
    { label: "High-speed LAN", icon: "wifi" },
  ],
  location: {
    imageAlt: "Building preview image",
    ctaLabel: "View Floor Plan",
  },
  help: {
    title: "Need Help?",
    subtitle: (roomTitle) =>
      `Having trouble with the digital check-in or accessing the equipment in ${roomTitle}?`,
    contactSupportLabel: "Contact IT Support",
    faqLabel: "Read Check-in FAQ",
  },
  postCheckInHint: "Post-check-in status will appear here after confirmation.",
  loadingLabel: "Loading booking…",
  error: {
    title: "Unable to load booking details.",
    subtitle: "The booking may not exist yet.",
    retryLabel: "Retry",
    backToListLabel: "Back to My Bookings",
  },
  attendeesLabel: (count) => `${count} People`,
};


