import { Injectable } from '@angular/core';
import { FoodItem } from '../models/food-item.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject: BehaviorSubject<number>;

  constructor() {
    const count: number = JSON.parse(localStorage.getItem('cartItems') || '[]')
      ? JSON.parse(localStorage.getItem('cartItems') || '[]').length
      : 0;

    this.cartSubject = new BehaviorSubject<number>(count);
  }

  public get cartSubjectValue(): number {
    return this.cartSubject.value;
  }

  getProductsInCart(): FoodItem[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  addProductToCart(foodItem: FoodItem) {
    const productsInCart = this.getProductsInCart();
    productsInCart.push(foodItem);
    this.saveFoodItemToLocalStorage(productsInCart);
  }

  setCartSubjectvalue() {
    const cartCount = this.getCartProductsFromLocalStorage().length;
    this.cartSubject.next(cartCount);
  }

  deleteProductFromCart(id: number) {
    const productsInCart = this.getProductsInCart();
    const index = productsInCart.findIndex((product: any) => product.id === id);
    productsInCart.splice(index, 1);
    this.saveFoodItemToLocalStorage(productsInCart);
  }

  saveFoodItemToLocalStorage(productsInCart: FoodItem[]) {
    localStorage.setItem('cartItems', JSON.stringify(productsInCart));
    this.setCartSubjectvalue();
  }

  getCartProductsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  placeOrder(): void {
    localStorage.clear();
    this.cartSubject.next(0);
  }
}
