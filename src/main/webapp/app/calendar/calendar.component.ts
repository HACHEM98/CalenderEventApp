import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarEvent, CalendarEventService } from 'app/entities/calendar-event/service/calendar-event.service';

@Component({
  selector: 'jhi-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  errorMessage: string | null = null; // <-- Property for storing error messages

  // Inject service
  private calendarEventService = inject(CalendarEventService);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.calendarEventService.getEvents().subscribe({
      next: (data: CalendarEvent[]) => {
        this.events = data;
        this.errorMessage = null; // Clear any previous error message
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading events:', error);
        this.handleError(error); // Handle error by setting the errorMessage
      },
    });
  }

  addEvent(): void {
    const newEvent: CalendarEvent = {
      title: 'New Event',
      description: 'Description here',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };

    this.calendarEventService.createEvent(newEvent).subscribe({
      next: () => {
        this.loadEvents(); // Reload events after creating new event
        this.errorMessage = null; // Clear error message on success
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error); // Handle error by setting the errorMessage
      },
    });
  }

  deleteEvent(id: number): void {
    this.calendarEventService.deleteEvent(id).subscribe({
      next: () => {
        this.loadEvents(); // Reload events after deletion
        this.errorMessage = null; // Clear error message on success
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error); // Handle error by setting the errorMessage
      },
    });
  }

  private handleError(error: HttpErrorResponse): void {
    // Set the error message based on error status or message
    if (error.status === 0) {
      this.errorMessage = 'Network error. Please check your connection.';
    } else if (error.status >= 400 && error.status < 500) {
      this.errorMessage = `Client error: ${error.message}`;
    } else if (error.status >= 500) {
      this.errorMessage = `Server error: ${error.message}`;
    } else {
      this.errorMessage = 'An unknown error occurred.';
    }
  }
}
