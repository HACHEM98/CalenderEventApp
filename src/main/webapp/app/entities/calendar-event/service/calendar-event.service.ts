import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CalendarEvent {
  id?: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  private apiUrl = '/api/calendar-events'; // Adjust the API URL as per your backend setup

  constructor(private http: HttpClient) {}

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl);
  }

  getEvent(id: number): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.apiUrl, event);
  }

  updateEvent(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}/${id}`, event); // Send PUT request to update event
  }

  deleteEvent(id: number): Observable<void> {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
