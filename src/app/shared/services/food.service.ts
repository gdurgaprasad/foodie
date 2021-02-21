import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FoodItem,
  FoodQuote,
  OrderHistoryItem,
} from '../models/food-item.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PAGES } from '../utils/constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient, private router: Router) {}

  getAvailableFoodItems() {
    return this.http.get<FoodItem[]>('/assets/data.json');
  }

  getOrderHistory(itemsPerPage: number, currentPage: number) {
    const paymentTypes = [
      'CASH',
      'UPI',
      'ONLINE BANKING',
      'CREDIT CARD',
      'DEBIT CARD',
      'PAYPAL',
    ];
    return this.http.get('/assets/data.json').pipe(
      map((data: any) => {
        const totalOrdersCount = 1000 * 30;
        const array = Array.from({ length: itemsPerPage }, (_, i) => i + 1);
        const orderHistory: OrderHistoryItem[] = [];
        let index = itemsPerPage * (currentPage - 1);
        array.forEach(() => {
          const itemsOrdered: FoodItem[] = data.slice(
            0,
            this.getRandomArrayIndex(data)
          );
          index += 1;
          orderHistory.push({
            id: `ORD-${index}`,
            paymentType: paymentTypes[this.getRandomArrayIndex(paymentTypes)],
            orderedDate: new Date().toString(),
            itemsOrdered,
            orderAmountWithDiscount: itemsOrdered.reduce((total, product) => {
              return (total += product.discount_price);
            }, 0),
            orderAmountWithoutDiscount: itemsOrdered.reduce(
              (total, product) => {
                return (total += product.price);
              },
              0
            ),
          });
        });
        return { totalOrdersCount, orderHistory };
      })
    );
  }

  getFoodQuote(): Observable<FoodQuote[]> {
    return this.http.get<FoodQuote[]>('/assets/quotes.json');
  }

  navToCart(): void {
    this.router.navigate([PAGES.CART]);
  }

  navToOrderHistory(): void {
    this.router.navigate([PAGES.HISTORY]);
  }

  navToHome(): void {
    this.router.navigate([PAGES.HOME]);
  }

  getRandomArrayIndex(array: any[]): number {
    return Math.ceil(Math.random() * (array.length - 1));
  }
}
