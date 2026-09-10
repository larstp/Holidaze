export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getNextDate(date: string): string {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate.toISOString().split('T')[0];
}
