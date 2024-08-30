import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [CommonModule],
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe((eventList: Event[]) => {
      this.events = eventList.sort((a, b) => {
        const endDateA = Number(a.endDate);
        const endDateB = Number(b.endDate);

        return endDateA - endDateB;
      });
    });
  }

  buyEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }
}
