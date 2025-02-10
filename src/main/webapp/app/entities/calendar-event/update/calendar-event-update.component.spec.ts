import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { CalendarEventService } from '../service/calendar-event.service';
import { ICalendarEvent } from '../calendar-event.model';
import { CalendarEventFormService } from './calendar-event-form.service';

import { CalendarEventUpdateComponent } from './calendar-event-update.component';

describe('CalendarEvent Management Update Component', () => {
  let comp: CalendarEventUpdateComponent;
  let fixture: ComponentFixture<CalendarEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let calendarEventFormService: CalendarEventFormService;
  let calendarEventService: CalendarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendarEventUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CalendarEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalendarEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    calendarEventFormService = TestBed.inject(CalendarEventFormService);
    calendarEventService = TestBed.inject(CalendarEventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const calendarEvent: ICalendarEvent = { id: 9443 };

      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      expect(comp.calendarEvent).toEqual(calendarEvent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendarEvent>>();
      const calendarEvent = { id: 4390 };
      jest.spyOn(calendarEventFormService, 'getCalendarEvent').mockReturnValue(calendarEvent);
      jest.spyOn(calendarEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendarEvent }));
      saveSubject.complete();

      // THEN
      expect(calendarEventFormService.getCalendarEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(calendarEventService.update).toHaveBeenCalledWith(expect.objectContaining(calendarEvent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendarEvent>>();
      const calendarEvent = { id: 4390 };
      jest.spyOn(calendarEventFormService, 'getCalendarEvent').mockReturnValue({ id: null });
      jest.spyOn(calendarEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendarEvent }));
      saveSubject.complete();

      // THEN
      expect(calendarEventFormService.getCalendarEvent).toHaveBeenCalled();
      expect(calendarEventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendarEvent>>();
      const calendarEvent = { id: 4390 };
      jest.spyOn(calendarEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendarEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(calendarEventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
