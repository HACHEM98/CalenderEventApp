import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../calendar-event.test-samples';

import { CalendarEventFormService } from './calendar-event-form.service';

describe('CalendarEvent Form Service', () => {
  let service: CalendarEventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarEventFormService);
  });

  describe('Service methods', () => {
    describe('createCalendarEventFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCalendarEventFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          }),
        );
      });

      it('passing ICalendarEvent should create a new form with FormGroup', () => {
        const formGroup = service.createCalendarEventFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          }),
        );
      });
    });

    describe('getCalendarEvent', () => {
      it('should return NewCalendarEvent for default CalendarEvent initial value', () => {
        const formGroup = service.createCalendarEventFormGroup(sampleWithNewData);

        const calendarEvent = service.getCalendarEvent(formGroup) as any;

        expect(calendarEvent).toMatchObject(sampleWithNewData);
      });

      it('should return NewCalendarEvent for empty CalendarEvent initial value', () => {
        const formGroup = service.createCalendarEventFormGroup();

        const calendarEvent = service.getCalendarEvent(formGroup) as any;

        expect(calendarEvent).toMatchObject({});
      });

      it('should return ICalendarEvent', () => {
        const formGroup = service.createCalendarEventFormGroup(sampleWithRequiredData);

        const calendarEvent = service.getCalendarEvent(formGroup) as any;

        expect(calendarEvent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICalendarEvent should not enable id FormControl', () => {
        const formGroup = service.createCalendarEventFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCalendarEvent should disable id FormControl', () => {
        const formGroup = service.createCalendarEventFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
