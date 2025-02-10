import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CalendarEventDetailComponent } from './calendar-event-detail.component';

describe('CalendarEvent Management Detail Component', () => {
  let comp: CalendarEventDetailComponent;
  let fixture: ComponentFixture<CalendarEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./calendar-event-detail.component').then(m => m.CalendarEventDetailComponent),
              resolve: { calendarEvent: () => of({ id: 4390 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CalendarEventDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load calendarEvent on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CalendarEventDetailComponent);

      // THEN
      expect(instance.calendarEvent()).toEqual(expect.objectContaining({ id: 4390 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
