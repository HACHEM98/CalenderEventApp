import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../service/calendar-event.service';
import { CalendarEventFormGroup, CalendarEventFormService } from './calendar-event-form.service';

@Component({
  selector: 'jhi-calendar-event-update',
  templateUrl: './calendar-event-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CalendarEventUpdateComponent implements OnInit {
  isSaving = false;
  calendarEvent: ICalendarEvent | null = null;

  protected calendarEventService = inject(CalendarEventService);
  protected calendarEventFormService = inject(CalendarEventFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CalendarEventFormGroup = this.calendarEventFormService.createCalendarEventFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calendarEvent }) => {
      this.calendarEvent = calendarEvent;
      if (calendarEvent) {
        this.updateForm(calendarEvent);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const calendarEvent = this.calendarEventFormService.getCalendarEvent(this.editForm);
    if (calendarEvent.id !== null) {
      this.subscribeToSaveResponse(this.calendarEventService.update(calendarEvent));
    } else {
      this.subscribeToSaveResponse(this.calendarEventService.create(calendarEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalendarEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(calendarEvent: ICalendarEvent): void {
    this.calendarEvent = calendarEvent;
    this.calendarEventFormService.resetForm(this.editForm, calendarEvent);
  }
}
