
export const formatTime = (date: Date) => {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const formatDate = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = `${date.getFullYear()}`.padStart(4, '0');

    return `${day}.${month}.${year}`;
}

export const formatDateTime = (date: Date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
}

export const toLocalDate = (date: Date) => {   
    return new Date(date.getTime() + date.getTimezoneOffset() * MINUTE_2_MS)
}

export const toGlobalDate = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * MINUTE_2_MS)
}

export const SEC_2_MS = 1000;
export const MINUTE_2_MS = 60 * SEC_2_MS;
export const HOUR_2_MS = 60 * MINUTE_2_MS;
export const DAY_2_MS = 24 * HOUR_2_MS; // 1000*60*60*24=86400000
export const WEEK_2_MS = 7 * DAY_2_MS;
export const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const;
export const DAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const;

export const getWeekdayOffsetMS = (date: Date) => {
    const days = date.getUTCDay() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return days * DAY_2_MS + hours * HOUR_2_MS + minutes * MINUTE_2_MS + seconds * SEC_2_MS;
}

export const getKW = (_date: Date) => {
    const date = new Date(_date.getTime());
  
    // ISO week date weeks start on Monday, so correct the day number
    const nDay = (date.getDay() + 6) % 7;
  
    // ISO 8601 states that week 1 is the week with the first Thursday of that year
    // Set the target date to the Thursday in the target week
    date.setDate(date.getDate() - nDay + 3);
  
    // Store the millisecond value of the target date
    const n1stThursday = date.getTime();
  
    // Set the target to the first Thursday of the year
    // First, set the target to January 1st
    date.setMonth(0, 1);
  
    // Not a Thursday? Correct the date to the next Thursday
    if (date.getDay() !== 4) {
      date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
    }
  
    // The week number is the number of weeks between the first Thursday of the year
    // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000 => milliseconds in a week)
    return 1 + Math.ceil((n1stThursday - date.getTime()) / 604800000);
  }

/**
 * 
 * @param date date in local time
 * @returns first monday of this week, in local time 
 */
export const getLastMonday = (date: Date = new Date()) => {
    const dateCopy = new Date(date.getTime());
    dateCopy.setHours(0, 0, 0, 0);
    return new Date(dateCopy.getTime() - ((dateCopy.getDay() + 6) % 7) * DAY_2_MS);
}

export const dateBetween = (date: Date, start: Date, end: Date) => {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}