import { Injectable } from '@angular/core';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class SessionAvailabilityService {
  constructor() {}

  calculateAvailability(session: Session, cartQuantity: number): string {
    const initialAvailability = session.initialAvailability || 0;
    return (initialAvailability - cartQuantity).toString();
  }

  initializeSession(session: Session, cartQuantity: number) {
    session.selected = cartQuantity;
    session.availability = this.calculateAvailability(session, cartQuantity);
  }
}
