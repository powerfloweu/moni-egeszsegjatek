const pad = (value: number) => value.toString().padStart(2, "0");

export const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const getTodayDateString = () => toDateString(new Date());

export const parseDate = (value: string) => {
  const [year, month, day] = value.split("-").map((v) => parseInt(v, 10));
  return new Date(year, month - 1, day);
};

export const addDays = (value: string, delta: number) => {
  const date = parseDate(value);
  date.setDate(date.getDate() + delta);
  return toDateString(date);
};

export const getMonthId = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const addMonths = (monthId: string, delta: number) => {
  const [yearStr, monthStr] = monthId.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  date.setMonth(date.getMonth() + delta);
  return getMonthId(date);
};

export const getMonthRange = (monthId: string) => {
  const [yearStr, monthStr] = monthId.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
};

export const isSameDate = (a: string, b: string) => a === b;
