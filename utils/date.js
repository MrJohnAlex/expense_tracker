export function getFomattedDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
export function getDateMinutesDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
