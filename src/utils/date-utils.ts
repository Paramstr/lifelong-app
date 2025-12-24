
/**
 * Date utilities for WeeklyProgressHeader
 */

/**
 * Get an array of 7 days representing a week around the given date.
 * Based on weekStart ('mon' or 'sun').
 */
export const getWeekDays = (currentDate: Date, weekStart: 'mon' | 'sun' = 'mon') => {
    const days = [];
    const start = new Date(currentDate);

    // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
    const day = start.getDay();

    // Calculate the difference to the start of the week
    let diff = 0;
    if (weekStart === 'mon') {
        // If today is Sunday (0), we need to go back 6 days to get Monday.
        // If today is Monday (1), diff is 0.
        diff = day === 0 ? -6 : 1 - day;
    } else {
        // weekStart === 'sun'
        // If today is Sunday (0), diff is 0.
        // If today is Monday (1), diff is -1.
        diff = -day;
    }

    // Set to the first day of the week
    start.setDate(start.getDate() + diff);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        // Format to ISO YYYY-MM-DD
        const dateIso = d.toISOString().split('T')[0];

        // Short weekday label
        const weekdayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

        // Day number
        const dayNumber = d.getDate();

        days.push({
            date: d,
            dateIso,
            weekdayLabel,
            dayNumber,
        });
    }

    return days;
};

/**
 * Check if two dates are the same calendar day.
 */
export const isSameDay = (d1: Date, d2: Date) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

/**
 * Parse time string (e.g., "8:10 am") to minutes from midnight for sorting.
 * Returns -1 if invalid.
 */
export const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!match) return -1;

    let [_, h, m, period] = match;
    let hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (period.toLowerCase() === 'am' && hours === 12) hours = 0;

    return hours * 60 + minutes;
};
