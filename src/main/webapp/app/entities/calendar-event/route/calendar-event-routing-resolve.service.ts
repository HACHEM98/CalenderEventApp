import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../service/calendar-event.service';

const calendarEventResolve = (route: ActivatedRouteSnapshot): Observable<null | ICalendarEvent> => {
  const id = route.params.id;
  if (id) {
    return inject(CalendarEventService)
      .find(id)
      .pipe(
        mergeMap((calendarEvent: HttpResponse<ICalendarEvent>) => {
          if (calendarEvent.body) {
            return of(calendarEvent.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default calendarEventResolve;
