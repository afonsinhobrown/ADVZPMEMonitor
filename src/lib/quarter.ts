export const QUARTER_MONTHS: Record<number, string> = {
  1: 'Jan - Mar',
  2: 'Abr - Jun',
  3: 'Jul - Set',
  4: 'Out - Dez',
};

export const SUBMISSION_GRACE_DAYS = 15;

export type Quarter = {
  quarter: number;
  year: number;
};

export type QuarterOption = {
  value: string;
  label: string;
  quarter: number;
  year: number;
  start: Date;
  end: Date;
  deadline: Date;
};

export function periodKey(quarter: number, year: number): string {
  return `Q${quarter} ${year}`;
}

export function parsePeriod(value: string): Quarter | null {
  const match = /^Q([1-4])\s+(\d{4})$/.exec(value.trim());
  if (!match) return null;
  return { quarter: Number(match[1]), year: Number(match[2]) };
}

export function quarterStart(quarter: number, year: number): Date {
  return new Date(year, (quarter - 1) * 3, 1);
}

export function quarterEnd(quarter: number, year: number): Date {
  return quarter === 4 ? new Date(year, 11, 31, 23, 59, 59) : new Date(year, quarter * 3, 0, 23, 59, 59);
}

export function quarterDeadline(quarter: number, year: number): Date {
  const deadline = new Date(quarterEnd(quarter, year));
  deadline.setDate(deadline.getDate() + SUBMISSION_GRACE_DAYS);
  deadline.setHours(23, 59, 59, 0);
  return deadline;
}

export function periodLabel(value: string): string {
  const parsed = parsePeriod(value);
  if (!parsed) return value;
  return `${value} (${QUARTER_MONTHS[parsed.quarter]})`;
}

export function periodShortLabel(value: string): string {
  const parsed = parsePeriod(value);
  if (!parsed) return value;
  return `${value} · ${QUARTER_MONTHS[parsed.quarter]}`;
}

export function periodOrder(period: string): number {
  const parsed = parsePeriod(period);
  if (!parsed) return 0;
  return parsed.year * 10 + parsed.quarter;
}

export function currentQuarter(now: Date = new Date()): Quarter {
  return { quarter: Math.floor(now.getMonth() / 3) + 1, year: now.getFullYear() };
}

export function quarterOptions(backwards = 3, forwards = 2, now: Date = new Date()): QuarterOption[] {
  const base = currentQuarter(now);
  const options: QuarterOption[] = [];

  for (let offset = forwards; offset >= -backwards; offset -= 1) {
    const absolute = base.year * 4 + (base.quarter - 1) + offset;
    const year = Math.floor(absolute / 4);
    const quarter = (absolute % 4) + 1;
    options.push({
      value: periodKey(quarter, year),
      label: periodLabel(periodKey(quarter, year)),
      quarter,
      year,
      start: quarterStart(quarter, year),
      end: quarterEnd(quarter, year),
      deadline: quarterDeadline(quarter, year),
    });
  }

  return options;
}

export function daysUntil(date: Date, now: Date = new Date()): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil((date.getTime() - now.getTime()) / MS_PER_DAY);
}

export function isPastDeadline(date: Date, now: Date = new Date()): boolean {
  return date.getTime() < now.getTime();
}

export function monthsBetween(start: Date, end: Date): number {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months + (end.getDate() >= start.getDate() ? 1 : 0));
}