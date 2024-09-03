export function timeLeft(targetDate: Date): string {
  const now = new Date();
  const timeDifference = targetDate.getTime() - now.getTime();

  if (timeDifference <= 0) {
    return "The date has passed!";
  }


  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Format the result as a string
  const daysStr = days > 0 ? `${days} days ` : "";
  const hoursStr = hours > 0 ? `${hours} hours ` : "";
  if (days <= 0) {
    return `${hoursStr} left`
  } else {
    return `${daysStr} left`;
  }
}
