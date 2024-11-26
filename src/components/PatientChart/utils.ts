import { differenceInWeeks, differenceInDays } from 'date-fns';

export function calculateTreatmentPeriod(date: string, firstVisitDate: string): string {
  const weeks = differenceInWeeks(new Date(date), new Date(firstVisitDate));
  const remainingDays = differenceInDays(new Date(date), new Date(firstVisitDate)) % 7;
  return `${weeks}w${remainingDays}d`;
}