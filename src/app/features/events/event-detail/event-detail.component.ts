import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Session } from '../../../core/models/session';
import { Event } from '../../../core/models/event';

@Component({
  standalone: true,
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  imports: [CommonModule],
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | undefined;
  sessions: Session[] = [];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventInfo(+eventId).subscribe((data) => {
        this.event = data.event;
        this.sessions = data.sessions
          .map((session: Session) => {
            session.selected = session.selected || 0;
            session.uniqueId = `${eventId}-${session.date}`;
            session.originalAvailability = Number(session.availability);
            return session;
          })
          .sort((a, b) => {
            const dateA = Number(a.date);
            const dateB = Number(b.date);
            return dateA - dateB;
          });
      });
    }
  }

  increment(session: Session) {
    if (Number(session.availability) > 0) {
      session.selected = (session.selected || 0) + 1;
      session.availability = (Number(session.availability) - 1).toString();

      this.updateCart(session);
    }
  }

  decrement(session: Session) {
    if (session.selected && session.selected > 0) {
      session.selected--;
      session.availability = (Number(session.availability) + 1).toString();

      this.updateCart(session);
    }
  }

  updateCart(session: Session) {
    const item = {
      eventTitle: this.event?.title,
      eventId: this.event?.id,
      sessionDate: session.date,
      quantity: session.selected,
    };

    if (session.selected && session.selected > 0) {
      this.cartService.addToCart(item);
    } else {
      this.cartService.removeFromCart(this.event?.id || '', session.date);
    }
  }

  removeFromCart(eventId: string, sessionDate: string) {
    const sessionToUpdate = this.sessions.find(
      (session) => session.date === sessionDate
    );

    if (sessionToUpdate) {
      const removedItem = this.cartService
        .getCart()
        .find(
          (item) => item.eventId === eventId && item.sessionDate === sessionDate
        );

      if (removedItem) {
        sessionToUpdate.selected = Math.max(0, sessionToUpdate.selected - 1);
        sessionToUpdate.availability = (
          Number(sessionToUpdate.availability) + 1
        ).toString();
      }
    }

    this.cartService.removeFromCart(eventId, sessionDate);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  cartGroups() {
    const grouped = this.cartService.getCart().reduce((acc, item) => {
      const eventGroup = acc.find(
        (group: { eventId: string }) => group.eventId === item.eventId
      );
      if (!eventGroup) {
        acc.push({
          eventId: item.eventId,
          title: item.eventTitle,
          sessions: [{ date: item.sessionDate, quantity: item.quantity }],
        });
      } else {
        const session = eventGroup.sessions.find(
          (sess: { date: string }) => sess.date === item.sessionDate
        );
        if (session) {
          session.quantity = item.quantity;
        } else {
          eventGroup.sessions.push({
            date: item.sessionDate,
            quantity: item.quantity,
          });
        }
      }
      return acc;
    }, [] as { eventId: string; title: string; sessions: { date: string; quantity: number }[] }[]);
    return grouped;
  }
}
