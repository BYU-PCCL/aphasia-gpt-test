/**
 * Converts a unix timestamp to a date string
 * @param unixTimeStamp Unix timestamp in seconds
 * @returns Date string in the format "MM/DD/YYYY, HH:MM:SS AM/PM"
 */
export function unixTimestampToDateString(unixTimeStamp: number): string {
  return new Date(unixTimeStamp * 1000).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
