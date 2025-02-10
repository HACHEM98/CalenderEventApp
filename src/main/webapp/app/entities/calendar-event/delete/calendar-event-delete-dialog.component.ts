import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICalendarEvent } from '../calendar-event.model';
import { CalendarEventService } from '../service/calendar-event.service';

@Component({
  templateUrl: './calendar-event-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CalendarEventDeleteDialogComponent {
  calendarEvent?: ICalendarEvent;

  protected calendarEventService = inject(CalendarEventService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.calendarEventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
