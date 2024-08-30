import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Session } from '../../../core/models/session';
import { Event } from '../../../core/models/event';
import { Subscription } from 'rxjs';
import { SessionAvailabilityService } from '../../../core/services/sessionAvailability.service';
import { ShoppingCartComponent } from '../../../shared/components/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ShoppingCartComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event | undefined;
  sessions: Session[] = [];
  private cartSubscription: Subscription | undefined;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private sessionAvailabilityService: SessionAvailabilityService
  ) {}

  ngOnInit() {
    this.loadEventData();
    this.cartSubscription = this.cartService
      .getCartObservable()
      .subscribe(() => {
        this.updateSessionAvailability();
      });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadEventData() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventInfo(+eventId).subscribe((data) => {
        this.event = data.event;
        this.sessions = data.sessions
          .map((session) => {
            session.referenceId = `${eventId}-${session.date}`;
            session.initialAvailability = Number(session.availability) || 0;
            return session;
          })
          .sort((a, b) => Number(a.date) - Number(b.date));

        this.updateSessionAvailability();
      });
    }
  }

  updateSessionAvailability() {
    if (this.event) {
      this.sessions.forEach((session) => {
        const cartItem = this.cartService
          .getCart()
          .find(
            (item) =>
              item.eventId === this.event?.id &&
              item.sessionDate === session.date
          );

        const cartQuantity = cartItem ? cartItem.quantity : 0;
        this.sessionAvailabilityService.initializeSession(
          session,
          cartQuantity
        );
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

    if (session.selected > 0) {
      this.cartService.addCart(item);
    } else {
      this.cartService.removeItemCart(this.event?.id || '', session.date);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
