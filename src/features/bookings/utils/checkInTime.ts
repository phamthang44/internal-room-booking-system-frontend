export interface CheckInWindow {
  readonly opensAt: Date;
  readonly expiresAt: Date;
}

const parseLocalDateTime = (bookingDate: string, time: string): Date | null => {
  // bookingDate: yyyy-MM-dd
  // time: HH:mm or HH:mm:ss
  const [y, m, d] = bookingDate.split("-").map((n) => Number(n));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

  const [hh, mm, ss] = time.split(":").map((n) => Number(n));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;

  const date = new Date(y, m - 1, d, hh, mm, Number.isFinite(ss) ? ss : 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

export const deriveCheckInWindow = (
  bookingDate?: string | null,
  startTime?: string | null,
): CheckInWindow | null => {
  if (!bookingDate || !startTime) return null;
  const start = parseLocalDateTime(bookingDate, startTime);
  if (!start) return null;

  const opensAt = new Date(start.getTime() - 30 * 60 * 1000);
  const expiresAt = new Date(start.getTime() + 15 * 60 * 1000);
  return { opensAt, expiresAt };
};

export const formatCountdownMMSS = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
};

