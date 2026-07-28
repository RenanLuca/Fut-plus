export const BRAZIL_UTC_OFFSET_HOURS = 3;

export function getBrazilCalendarDate(
  date: Date = new Date(),
): Date {
  const brazilInstant = new Date(
    date.getTime() - BRAZIL_UTC_OFFSET_HOURS * 60 * 60 * 1000,
  );
  return new Date(
    Date.UTC(
      brazilInstant.getUTCFullYear(),
      brazilInstant.getUTCMonth(),
      brazilInstant.getUTCDate(),
      brazilInstant.getUTCHours(),
      brazilInstant.getUTCMinutes(),
    ),
  );
}

export function getBrazilCurrentMonthStart(
  date: Date = new Date(),
): Date {
  const brazilDate = getBrazilCalendarDate(date);
  return new Date(
    Date.UTC(
      brazilDate.getUTCFullYear(),
      brazilDate.getUTCMonth(),
      1,
    ),
  );
}
