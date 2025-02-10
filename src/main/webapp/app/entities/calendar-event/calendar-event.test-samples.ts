import dayjs from 'dayjs/esm';

import { ICalendarEvent, NewCalendarEvent } from './calendar-event.model';

export const sampleWithRequiredData: ICalendarEvent = {
  id: 21029,
};

export const sampleWithPartialData: ICalendarEvent = {
  id: 28493,
  title: 'inasmuch although',
  description: 'round clearly jubilantly',
  startTime: dayjs('2025-02-10T01:48'),
  endTime: dayjs('2025-02-10T04:20'),
};

export const sampleWithFullData: ICalendarEvent = {
  id: 3321,
  title: 'throughout inasmuch',
  description: 'federate',
  startTime: dayjs('2025-02-09T23:01'),
  endTime: dayjs('2025-02-10T06:07'),
};

export const sampleWithNewData: NewCalendarEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
