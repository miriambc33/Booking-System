import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventsUrlData = 'assets/mocks/events.json';
  eventInfoUrlBase = 'assets/mocks/event-info-';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrlData);
  }

  getEventInfo(
    eventId: number
  ): Observable<{ event: Event; sessions: Session[] }> {
    const url = `${this.eventInfoUrlBase}${eventId}.json`;
    return this.http.get<{ event: Event; sessions: Session[] }>(url);
  }
}
