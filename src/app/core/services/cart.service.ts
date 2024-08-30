import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: any[] = [];
  cartSubject = new BehaviorSubject<any[]>(this.cart);

  constructor() {}

  getCart() {
    return this.cart;
  }

  getCartObservable() {
    return this.cartSubject.asObservable();
  }

  addCart(item: any) {
    const existingItemIndex = this.cart.findIndex(
      (cartItem) =>
        cartItem.eventId === item.eventId &&
        cartItem.sessionDate === item.sessionDate
    );

    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity = item.quantity;
    } else {
      this.cart.push(item);
    }
  }

  removeItemCart(eventId: string, sessionDate: string) {
    const index = this.cart.findIndex(
      (item) => item.eventId === eventId && item.sessionDate === sessionDate
    );
    if (index !== -1) {
      const cartItem = this.cart[index];
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        this.cart.splice(index, 1);
      }

      this.cartSubject.next(this.cart);
    }
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next(this.cart);
  }
}
