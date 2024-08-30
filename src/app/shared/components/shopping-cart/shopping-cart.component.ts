import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Session } from '../../../core/models/session';
import { Event } from '../../../core/models/event';
import { SessionAvailabilityService } from '../../../core/services/sessionAvailability.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  event: Event | undefined;
  sessions: Session[] = [];

  constructor(
    private eventService: EventService,
    private cartService: CartService,
    private sessionAvailabilityService: SessionAvailabilityService
  ) {}

  ngOnInit() {
    this.loadCartData();
  }

  loadCartData() {
    const groupedCartItems = this.groupCartItemsByEvent();

    groupedCartItems.forEach(
      (group: { eventId: string | number; sessions: any[] }) => {
        this.eventService.getEventInfo(+group.eventId).subscribe((data) => {
          this.event = data.event;
          this.sessions = data.sessions.map((session) => {
            const cartItem = group.sessions.find(
              (item: { date: string }) => item.date === session.date
            );

            const cartQuantity = cartItem ? cartItem.quantity : 0;
            this.sessionAvailabilityService.initializeSession(
              session,
              cartQuantity
            );

            return session;
          });
        });
      }
    );
  }

  groupCartItemsByEvent() {
    return this.cartService.getCart().reduce((eventGroups, cartItem) => {
      let eventGroup = eventGroups.find(
        (group: { eventId: any }) => group.eventId === cartItem.eventId
      );

      if (!eventGroup) {
        eventGroup = {
          eventId: cartItem.eventId,
          title: cartItem.eventTitle,
          sessions: [],
        };
        eventGroups.push(eventGroup);
      }

      const existingSession = eventGroup.sessions.find(
        (session: { date: any }) => session.date === cartItem.sessionDate
      );

      if (existingSession) {
        existingSession.quantity += cartItem.quantity;
      } else {
        eventGroup.sessions.push({
          date: cartItem.sessionDate,
          quantity: cartItem.quantity,
        });
      }

      return eventGroups;
    }, [] as { eventId: string; title: string; sessions: { date: string; quantity: number }[] }[]);
  }

  removeItemCart(eventId: string, sessionDate: string) {
    this.cartService.removeItemCart(eventId, sessionDate);
  }
}
