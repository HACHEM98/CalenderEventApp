import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICalendarEvent, NewCalendarEvent } from '../calendar-event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICalendarEvent for edit and NewCalendarEventFormGroupInput for create.
 */
type CalendarEventFormGroupInput = ICalendarEvent | PartialWithRequiredKeyOf<NewCalendarEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICalendarEvent | NewCalendarEvent> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type CalendarEventFormRawValue = FormValueOf<ICalendarEvent>;

type NewCalendarEventFormRawValue = FormValueOf<NewCalendarEvent>;

type CalendarEventFormDefaults = Pick<NewCalendarEvent, 'id' | 'startTime' | 'endTime'>;

type CalendarEventFormGroupContent = {
  id: FormControl<CalendarEventFormRawValue['id'] | NewCalendarEvent['id']>;
  title: FormControl<CalendarEventFormRawValue['title']>;
  description: FormControl<CalendarEventFormRawValue['description']>;
  startTime: FormControl<CalendarEventFormRawValue['startTime']>;
  endTime: FormControl<CalendarEventFormRawValue['endTime']>;
};

export type CalendarEventFormGroup = FormGroup<CalendarEventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CalendarEventFormService {
  createCalendarEventFormGroup(calendarEvent: CalendarEventFormGroupInput = { id: null }): CalendarEventFormGroup {
    const calendarEventRawValue = this.convertCalendarEventToCalendarEventRawValue({
      ...this.getFormDefaults(),
      ...calendarEvent,
    });
    return new FormGroup<CalendarEventFormGroupContent>({
      id: new FormControl(
        { value: calendarEventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(calendarEventRawValue.title),
      description: new FormControl(calendarEventRawValue.description),
      startTime: new FormControl(calendarEventRawValue.startTime),
      endTime: new FormControl(calendarEventRawValue.endTime),
    });
  }

  getCalendarEvent(form: CalendarEventFormGroup): ICalendarEvent | NewCalendarEvent {
    return this.convertCalendarEventRawValueToCalendarEvent(form.getRawValue() as CalendarEventFormRawValue | NewCalendarEventFormRawValue);
  }

  resetForm(form: CalendarEventFormGroup, calendarEvent: CalendarEventFormGroupInput): void {
    const calendarEventRawValue = this.convertCalendarEventToCalendarEventRawValue({ ...this.getFormDefaults(), ...calendarEvent });
    form.reset(
      {
        ...calendarEventRawValue,
        id: { value: calendarEventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CalendarEventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertCalendarEventRawValueToCalendarEvent(
    rawCalendarEvent: CalendarEventFormRawValue | NewCalendarEventFormRawValue,
  ): ICalendarEvent | NewCalendarEvent {
    return {
      ...rawCalendarEvent,
      startTime: dayjs(rawCalendarEvent.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawCalendarEvent.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertCalendarEventToCalendarEventRawValue(
    calendarEvent: ICalendarEvent | (Partial<NewCalendarEvent> & CalendarEventFormDefaults),
  ): CalendarEventFormRawValue | PartialWithRequiredKeyOf<NewCalendarEventFormRawValue> {
    return {
      ...calendarEvent,
      startTime: calendarEvent.startTime ? calendarEvent.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: calendarEvent.endTime ? calendarEvent.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
