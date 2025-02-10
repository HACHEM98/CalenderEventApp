import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CalendarEventResolve from './route/calendar-event-routing-resolve.service';

const calendarEventRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/calendar-event.component').then(m => m.CalendarEventComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/calendar-event-detail.component').then(m => m.CalendarEventDetailComponent),
    resolve: {
      calendarEvent: CalendarEventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/calendar-event-update.component').then(m => m.CalendarEventUpdateComponent),
    resolve: {
      calendarEvent: CalendarEventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/calendar-event-update.component').then(m => m.CalendarEventUpdateComponent),
    resolve: {
      calendarEvent: CalendarEventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default calendarEventRoute;
