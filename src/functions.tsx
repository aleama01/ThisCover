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

export function getDate(dateString: string) {
  // Create a Date object from the input string
  const date = new Date(dateString);

  // Get the day as a number
  const day = date.getUTCDate(); // Using getUTCDate to avoid timezone differences

  // Array of month names to convert the month number to string
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get the month as a string
  const month = monthNames[date.getUTCMonth()]; // getUTCMonth returns a zero-indexed month (0 = January)

  return { day, month };
}