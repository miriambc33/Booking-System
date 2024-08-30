import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor() {}

  getCart() {
    return this.cart;
  }

  addToCart(item: any) {
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

  removeFromCart(eventId: string, sessionDate: string) {
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
    }
  }

  clearCart() {
    this.cart = [];
  }
}
