import dayjs from 'dayjs/esm';

export interface ICalendarEvent {
  id: number;
  title?: string | null;
  description?: string | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
}

export type NewCalendarEvent = Omit<ICalendarEvent, 'id'> & { id: null };
