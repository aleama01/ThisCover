export function timeLeft(targetDate: Date): string {
  const now = new Date();

  // Create a new Date object set to 6:00 PM (18:00) of the target date
  const adjustedTargetDate = new Date(targetDate);
  adjustedTargetDate.setUTCHours(18, 0, 0, 0); // Set to 6:00 PM UTC

  // Calculate the time difference in milliseconds
  const timeDifference = adjustedTargetDate.getTime() - now.getTime();

  if (timeDifference <= 0) {
    return "The date has passed!";
  }

  // Calculate the number of days and hours left
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // Format the result as a string
  const daysStr = days > 0 ? `${days} days ` : "";
  const hoursStr = hours > 0 ? `${hours} hours ` : "";

  return `${daysStr}${hoursStr}left`.trim();
}